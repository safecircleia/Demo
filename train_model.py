import os
import random
import logging
import numpy as np
import pandas as pd
import torch

import nltk
from nltk.tokenize import word_tokenize
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
from torch.optim.lr_scheduler import OneCycleLR
from tqdm import tqdm
from typing import Dict, List

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Constants
BATCH_SIZE = 8
ACCUMULATION_STEPS = 4
MAX_LENGTH = 128
NUM_EPOCHS = 10
LEARNING_RATE = 2e-5
MODEL_NAME = "distilbert-base-multilingual-cased"

def set_seed(seed: int = 42):
    """Set seeds for reproducibility."""
    random.seed(seed)
    np.random.seed(seed)
    torch.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)

set_seed()

def get_device():
    """Use GPU if available, otherwise CPU."""
    return torch.device("cuda" if torch.cuda.is_available() else "cpu")

class PredatorDataset(Dataset):
    """Custom Torch Dataset for text classification."""
    def __init__(self, texts, labels, tokenizer, max_length=MAX_LENGTH):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer(
            text,
            truncation=True,
            padding='max_length',
            max_length=self.max_length,
            return_tensors='pt'
        )

        return {
            'input_ids': encoding['input_ids'].squeeze(0),
            'attention_mask': encoding['attention_mask'].squeeze(0),
            'labels': torch.tensor(self.labels[idx], dtype=torch.long)
        }

class EfficientTrainer:
    def __init__(
        self,
        model: AutoModelForSequenceClassification,
        train_dataset: Dataset,
        val_dataset: Dataset,
        learning_rate: float = LEARNING_RATE,
        class_weights: torch.Tensor = None
    ):
        self.model = model
        self.train_dataset = train_dataset
        self.val_dataset = val_dataset
        self.class_weights = class_weights

        self.device = get_device()
        logger.info(f"Using device: {self.device}")
        self.model.to(self.device)
        if self.class_weights is not None:
            self.class_weights = self.class_weights.to(self.device)

        # Optimizer initialization
        self.optimizer = AdamW(
            self.model.parameters(),
            lr=learning_rate,
            weight_decay=0.01
        )

        # Data loaders
        self.train_loader = DataLoader(
            train_dataset,
            batch_size=BATCH_SIZE,
            shuffle=True,
            num_workers=0,
            pin_memory=True
        )

        self.val_loader = DataLoader(
            val_dataset,
            batch_size=BATCH_SIZE,
            shuffle=False,
            num_workers=0,
            pin_memory=True
        )

        steps_per_epoch = max(1, len(self.train_loader) // ACCUMULATION_STEPS)
        self.scheduler = OneCycleLR(
            self.optimizer,
            max_lr=learning_rate,
            steps_per_epoch=steps_per_epoch,
            epochs=NUM_EPOCHS,
            pct_start=0.1
        )

    def compute_weighted_loss(self, logits, labels):
        if self.class_weights is None:
            return torch.nn.functional.cross_entropy(logits, labels)
        return torch.nn.functional.cross_entropy(logits, labels, weight=self.class_weights)

    def train_epoch(self) -> float:
        self.model.train()
        total_loss = 0.0
        self.optimizer.zero_grad()

        progress_bar = tqdm(self.train_loader, desc="Training")

        for idx, batch in enumerate(progress_bar):
            batch = {k: v.to(self.device) for k, v in batch.items()}

            outputs = self.model(**batch)
            if self.class_weights is not None:
                loss = self.compute_weighted_loss(outputs.logits, batch['labels'])
            else:
                loss = outputs.loss

            loss = loss / ACCUMULATION_STEPS
            loss.backward()

            if (idx + 1) % ACCUMULATION_STEPS == 0:
                torch.nn.utils.clip_grad_norm_(self.model.parameters(), 1.0)
                self.optimizer.step()
                self.scheduler.step()
                self.optimizer.zero_grad()

            total_loss += loss.item() * ACCUMULATION_STEPS
            progress_bar.set_postfix({'loss': f'{total_loss/(idx+1):.4f}'})

        return total_loss / len(self.train_loader)

    def evaluate(self) -> Dict:
        self.model.eval()
        total_loss = 0.0
        all_preds = []
        all_labels = []

        with torch.no_grad():
            for batch in tqdm(self.val_loader, desc="Evaluating"):
                batch = {k: v.to(self.device) for k, v in batch.items()}
                outputs = self.model(**batch)

                if self.class_weights is not None:
                    loss = self.compute_weighted_loss(outputs.logits, batch['labels'])
                else:
                    loss = outputs.loss

                total_loss += loss.item()

                preds = torch.argmax(outputs.logits, dim=-1)
                all_preds.extend(preds.cpu().numpy())
                all_labels.extend(batch['labels'].cpu().numpy())

        report = classification_report(all_labels, all_preds, output_dict=True)
        return {
            'loss': total_loss / len(self.val_loader),
            'accuracy': report['accuracy'],
            'f1': report['weighted avg']['f1-score'],
            'precision': report['weighted avg']['precision'],
            'recall': report['weighted avg']['recall']
        }

def augment_data(df: pd.DataFrame) -> pd.DataFrame:
    logger.info("Augmenting dataset...")
    augmented_texts = []
    augmented_labels = []

    for _, row in df.iterrows():
        text = row['text']
        label = row['label']

        # Original text
        augmented_texts.append(text)
        augmented_labels.append(label)

        words = word_tokenize(text)

        if len(words) > 3:
            # Word deletion (remove one word at a time)
            for i in range(len(words)):
                new_text = ' '.join(words[:i] + words[i+1:])
                augmented_texts.append(new_text)
                augmented_labels.append(label)

            # Word order changes
            for _ in range(2):  # Create 2 shuffled versions
                shuffled = words.copy()
                random.shuffle(shuffled)
                augmented_texts.append(' '.join(shuffled))
                augmented_labels.append(label)

            # Add punctuation variations
            if label == 1:  # Only augment harmful messages
                variations = [
                    f"{text}...",
                    f"{text}!",
                    f"{text}?",
                ]
                augmented_texts.extend(variations)
                augmented_labels.extend([label] * len(variations))

    aug_df = pd.DataFrame({'text': augmented_texts, 'label': augmented_labels})
    logger.info(f"Dataset size after augmentation: {len(aug_df)}")
    return aug_df

def main():
    logger.info("Loading dataset...")
    df = pd.read_csv('dataset.csv')

    # Data augmentation
    df = augment_data(df)

    # Calculate class weights
    class_counts = df['label'].value_counts()
    total_samples = len(df)
    class_weights = torch.tensor([
        total_samples / (2 * count) for count in class_counts
    ])

    logger.info(f"Class weights: {class_weights}")

    logger.info("Initializing model and tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=2,
        problem_type="single_label_classification"
    )

    # Split data
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        df['text'].values,
        df['label'].values,
        test_size=0.2,
        stratify=df['label'],
        random_state=42
    )

    train_dataset = PredatorDataset(train_texts, train_labels, tokenizer)
    val_dataset = PredatorDataset(val_texts, val_labels, tokenizer)

    trainer = EfficientTrainer(
        model,
        train_dataset,
        val_dataset,
        class_weights=class_weights
    )

    logger.info("Starting training...")
    best_f1 = 0.0

    for epoch in range(NUM_EPOCHS):
        logger.info(f"\nEpoch {epoch+1}/{NUM_EPOCHS}")

        train_loss = trainer.train_epoch()
        eval_metrics = trainer.evaluate()

        logger.info(f"Train loss: {train_loss:.4f}")
        logger.info(f"Validation metrics: {eval_metrics}")

        if eval_metrics['f1'] > best_f1:
            best_f1 = eval_metrics['f1']
            logger.info("Saving best model...")
            os.makedirs('final_model', exist_ok=True)
            model.save_pretrained('final_model')

    logger.info("\nTraining completed!")

    # Model verification
    logger.info("\nModel Verification:")
    model.eval()
    device = get_device()

    # Test harmful messages
    logger.info("\nTesting known harmful messages:")
    test_harmful = [
        "¿podemos encontrarnos en algún lugar privado?",
        "¿Puedes enviarme una foto?",
        "Quiero mantener esto en secreto",
        "¿Estás solo en casa?",
        "No le digas a tus padres sobre nuestra conversación"
    ]

    # Test safe messages
    logger.info("\nTesting known safe messages:")
    test_safe = [
        "¡Hola! ¿Cómo estás hoy?",
        "¡Que tengas un buen día!",
        "Hablemos de la escuela",
        "¿Cuál es tu película favorita?",
        "¿Qué haces cuando estás aburrido?"
    ]

    with torch.no_grad():
        logger.info("\nHarmful messages probabilities:")
        for msg in test_harmful:
            inputs = tokenizer(msg, return_tensors="pt", truncation=True, max_length=MAX_LENGTH)
            inputs = {k: v.to(device) for k, v in inputs.items()}
            outputs = model(**inputs)
            prob = torch.softmax(outputs.logits, dim=1)[0][1].item()
            logger.info(f"Message: {msg}")
            logger.info(f"Harmful probability: {prob:.4f}")

        logger.info("\nSafe messages probabilities:")
        for msg in test_safe:
            inputs = tokenizer(msg, return_tensors="pt", truncation=True, max_length=MAX_LENGTH)
            inputs = {k: v.to(device) for k, v in inputs.items()}
            outputs = model(**inputs)
            prob = torch.softmax(outputs.logits, dim=1)[0][1].item()
            logger.info(f"Message: {msg}")
            logger.info(f"Harmful probability: {prob:.4f}")

if __name__ == "__main__":
    main()
