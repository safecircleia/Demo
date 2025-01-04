# AI Predator Detection System (Demo)

![Project Banner](docs/banner.png)

## ⚠️ Important Notice
This is a **technical demonstration** intended for educational and research purposes only. This project should not be used in production environments or as a reliable tool for detecting predatory behavior. The model's predictions should not be considered as definitive evidence of harmful intent.

## 🎯 Overview
This project demonstrates an AI-powered system designed to analyze Spanish text conversations for potentially harmful patterns. It combines a fine-tuned DistilBERT model with a modern web interface for real-time message analysis.

### Key Features
- 🤖 Fine-tuned multilingual DistilBERT model
- 💬 Real-time message analysis
- 🌐 Modern web interface with dark/light mode
- 🔄 Interactive chat-like experience
- 🎨 Smooth animations and transitions
- 📊 Probability-based risk assessment

## 🛠️ Technical Stack
- **Frontend**: Next.js 13+, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes, Python
- **ML Model**: HuggingFace Transformers, PyTorch
- **Language Support**: Spanish (primary)

## 📋 Prerequisites
- Node.js 16+
- Python 3.8+
- pip (Python package manager)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Tresillo2017/AI-Predator-Detector.git
cd ai-predator-detector
```

### 2. Install Dependencies

Frontend dependencies:
```bash
npm install
# or
yarn install
```

Backend dependencies:
```bash
pip install -r requirements.txt
```

### 3. Train the Model (Optional)
```bash
python train_model.py
```
This will create a `final_model` directory with the trained model.

### 4. Start the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## 💻 Usage

1. Open the web interface in your browser
2. Enter the API key (default: `7SJjywNVXa$f0iVn5WmXXI*4`)
3. Type a message in Spanish
4. The system will analyze the message and provide a risk assessment

## 📁 Project Structure

```
ai-predator-detector/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── fonts/             # Custom fonts
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # UI components
│   └── ChatInterface.tsx # Main chat interface
├── lib/                  # Utility functions
├── public/              # Static files
├── dataset.csv         # Training dataset
├── main.py            # Python prediction script
├── train_model.py    # Model training script
├── requirements.txt  # Python dependencies
└── README.md        # This file
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_KEY=your_api_key_here
```

### Model Training Parameters
Adjust hyperparameters in `train_model.py`:
```python
BATCH_SIZE = 8
ACCUMULATION_STEPS = 4
MAX_LENGTH = 128
NUM_EPOCHS = 10
LEARNING_RATE = 2e-5
```

## 🤝 Contributing
This is a demo project and is not intended for production use. However, if you'd like to improve the educational aspects of this demo:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## ⚠️ Limitations
- The model is trained on a limited dataset
- False positives and negatives are possible
- Should not be used as the sole means of detection
- Limited to Spanish language text
- CPU-only training optimizations

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔍 References
- [DistilBERT Paper](https://arxiv.org/abs/1910.01108)
- [Next.js Documentation](https://nextjs.org/docs)
- [HuggingFace Transformers](https://huggingface.co/transformers/)

## 👥 Contact
For educational and research inquiries only:
- [Your Name](mailto:contact@tomasps.com)
- [Project Issues](https://github.com/Tresillo2017/AI-Predator-Detector/issues)

---

**Disclaimer**: This project is a technical demonstration and should not be used in real-world applications for detecting predatory behavior. Always consult with appropriate authorities and professionals for handling suspicious activities.
