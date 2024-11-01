import sys
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Load the pre-trained model and tokenizer
model = AutoModelForSequenceClassification.from_pretrained("./final_model")
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-multilingual-cased")

def predict_message(message):
    encoding = tokenizer(message, truncation=True, padding=True, max_length=128, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**encoding)
    probabilities = torch.softmax(outputs.logits, dim=1)
    harmful_prob = probabilities[0][1].item()
    
    if harmful_prob > 0.7:
        return "Highly likely to be harmful", harmful_prob
    elif harmful_prob > 0.4:
        return "Potentially harmful", harmful_prob
    else:
        return "Likely safe", harmful_prob

if __name__ == "__main__":
    if len(sys.argv) > 1:
        message = sys.argv[1]
        prediction, probability = predict_message(message)
        print(f"{prediction}|{probability:.2f}")
    else:
        print("No message provided")