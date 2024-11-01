import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split, StratifiedKFold
import pandas as pd
from sklearn.metrics import classification_report
import numpy as np
from imblearn.over_sampling import SMOTE
from nltk.tokenize import word_tokenize
import nltk
from sklearn.feature_extraction.text import CountVectorizer

nltk.download('punkt', quiet=True)

# Load the dataset
df = pd.read_csv('dataset.csv')

# Tokenizer and model
model_name = "distilbert-base-multilingual-cased"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2).to('cuda')  # Move model to GPU

# Data augmentation function
def augment_text(text):
    words = word_tokenize(text)
    augmented = []
    for i in range(len(words)):
        new_text = ' '.join(words[:i] + words[i+1:])
        augmented.append(new_text)
    return augmented

# Augment the dataset
augmented_texts = []
augmented_labels = []
for text, label in zip(df['text'], df['label']):
    augmented_texts.extend(augment_text(text))
    augmented_labels.extend([label] * len(augment_text(text)))

df_augmented = pd.DataFrame({'text': augmented_texts, 'label': augmented_labels})
df = pd.concat([df, df_augmented], ignore_index=True)

# Dataset class
class MessageDataset(torch.utils.data.Dataset):
    def __init__(self, texts, labels):
        self.texts = texts
        self.labels = labels

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts[idx]
        label = self.labels[idx]
        encoding = tokenizer(text, truncation=True, padding='max_length', max_length=128, return_tensors='pt')
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
    }


# Metrics computation
def compute_metrics(pred):
    labels = pred.label_ids
    preds = pred.predictions.argmax(-1)
    report = classification_report(labels, preds, output_dict=True)
    return {
        'accuracy': report['accuracy'],
        'f1': report['weighted avg']['f1-score'],
        'precision': report['weighted avg']['precision'],
        'recall': report['weighted avg']['recall']
    }

# Hyperparameters
hyperparameters = {
    'num_train_epochs': 10,
    'per_device_train_batch_size': 16,
    'per_device_eval_batch_size': 64,
    'warmup_steps': 500,
    'weight_decay': 0.01,
    'learning_rate': 2e-5,
}

# Cross-validation
n_splits = 5
skf = StratifiedKFold(n_splits=n_splits, shuffle=True, random_state=42)

# Vectorize the text data for SMOTE
vectorizer = CountVectorizer()
X_vectorized = vectorizer.fit_transform(df['text'])

for fold, (train_idx, val_idx) in enumerate(skf.split(X_vectorized, df['label']), 1):
    print(f"Fold {fold}")

    X_train, X_val = X_vectorized[train_idx], X_vectorized[val_idx]
    y_train, y_val = df['label'].iloc[train_idx], df['label'].iloc[val_idx]

    # Apply SMOTE to balance the training data
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)

    # Convert back to text
    train_texts_resampled = vectorizer.inverse_transform(X_train_resampled)
    train_texts_resampled = [' '.join(text) for text in train_texts_resampled]

    # Create datasets
    train_dataset = MessageDataset(train_texts_resampled, y_train_resampled)
    val_dataset = MessageDataset(df['text'].iloc[val_idx].tolist(), y_val.tolist())

    # Training arguments
    training_args = TrainingArguments(
        output_dir=f'./results_fold_{fold}',
        num_train_epochs=hyperparameters['num_train_epochs'],
        per_device_train_batch_size=hyperparameters['per_device_train_batch_size'],
        per_device_eval_batch_size=hyperparameters['per_device_eval_batch_size'],
        warmup_steps=hyperparameters['warmup_steps'],
        weight_decay=hyperparameters['weight_decay'],
        learning_rate=hyperparameters['learning_rate'],
        evaluation_strategy="epoch",
        save_strategy="epoch",
        load_best_model_at_end=True,
        metric_for_best_model="f1",
    )

    # Trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics,
    )

    # Train and evaluate
    trainer.train()
    eval_results = trainer.evaluate()
    print(f"Fold {fold} Evaluation Results:", eval_results)

# Save the final model
trainer.save_model("./final_model")
print("Model training completed and saved in ./final_model directory")

# Test with new messages
new_messages = [
    "Puedes mandarme tu foto?",
    "Que estas haciendo hoy?",
    "No le digas a nadie sobre nuestra conversación",
    "¿Quieres ser mi amigo secreto?",
    "Hablemos de tus pasatiempos"
]

model = AutoModelForSequenceClassification.from_pretrained("./final_model").to('cuda')  # Ensure the model is on GPU
encodings = tokenizer(new_messages, truncation=True, padding=True, max_length=128, return_tensors="pt").to('cuda')  # Move inputs to GPU
outputs = model(**encodings)
predictions = torch.softmax(outputs.logits, dim=1)

print("\nPredictions:")
for message, prediction in zip(new_messages, predictions):
    harmful_prob = prediction[1].item()
    label = "Harmful" if harmful_prob > 0.5 else "Safe"
    print(f"Message: {message}")
    print(f"Prediction: {label} (Harmful probability: {harmful_prob:.2f})")
    print()
