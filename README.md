# 🎉 Real-Time AI Child Interaction App

A full-stack application that enables engaging, child-friendly voice conversations with an AI assistant. The AI initiates discussion about a dynamic park scene, with tool-triggered UI interactions like object highlighting and confetti celebrations.

## 🌟 Features

- ✅ **Real-Time Voice Conversation** - Child speaks, AI responds with text-to-speech
- ✅ **Web Speech API** - Browser-native speech recognition (no extra software needed)
- ✅ **Browser SpeechSynthesis** - Natural voice output with child-friendly settings
- ✅ **Tool-Triggered UI Actions** - AI can highlight objects and trigger celebrations
- ✅ **60-Second Interactive Timer** - Automatic conversation management
- ✅ **Child-Safe AI Prompts** - System prompt with safety guardrails
- ✅ **Beautiful UI** - Colorful park scene with Tailwind CSS styling
- ✅ **Production Ready** - Clean code, error handling, modular components

## 📁 Folder Structure

```
Zubi/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── routes/
│   │   └── chat.js              # Chat API endpoint with mock responses
│   ├── middleware/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx          # Main app with state management
│   │   │   ├── ImageDisplay.jsx # Park scene with highlights
│   │   │   ├── MicButton.jsx    # Voice input button
│   │   │   ├── Timer.jsx        # 60-second countdown
│   │   │   ├── TranscriptArea.jsx # Conversation display
│   │   │   └── Confetti.jsx     # Celebration animation
│   │   ├── utils/
│   │   │   ├── speechRecognition.js  # Web Speech API wrapper
│   │   │   ├── textToSpeech.js       # SpeechSynthesis wrapper
│   │   │   └── apiClient.js          # Backend API calls
│   │   ├── index.css            # Tailwind + custom styles
│   │   └── main.jsx             # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser with Web Speech API support (Chrome, Edge, Safari)

### Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# (Optional) Add OpenAI API key for real LLM
# Edit .env and add: OPENAI_API_KEY=your_key_here

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### Setup Frontend

```bash
# Navigate to frontend (in new terminal)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
# Frontend runs on http://localhost:3000
```

### Access the App

Open your browser and go to: **http://localhost:3000**

## 💬 System Prompt

The AI is configured with a comprehensive system prompt that ensures:
- **Simple language** for 6-year-olds
- **Short responses** (1-3 sentences max)
- **Enthusiasm and fun** engagement
- **No personal data collection** (name, age, location, school, family)
- **Safe content only** - appropriate for children
- **Encouraging questions** about the park scene

See [backend/routes/chat.js](backend/routes/chat.js) for the full system prompt.

## 🔌 API Endpoints

### POST `/api/chat/init`
Initialize a new conversation session.

**Response:**
```json
{
  "sessionId": "1234567890",
  "initialMessage": "Hi! I see a beautiful park! Do you see the trees and the swing? What do you like about the park?"
}
```

### POST `/api/chat`
Send a message and get AI response.

**Request:**
```json
{
  "message": "I see a dog!",
  "sessionId": "1234567890"
}
```

**Response (Plain Text):**
```json
{
  "message": "Yes! The doggy loves to play in the park! Do you like dogs?"
}
```

**Response (With Tool):**
```json
{
  "message": "Yes! The doggy loves to play in the park!",
  "tool": {
    "name": "highlight_object",
    "object": "dog"
  }
}
```

## 🛠️ Tool Calling System

The AI can trigger UI actions by returning structured JSON with tool calls:

### Highlight Object Tool
Highlights an object in the image with a glowing circle.

```json
{
  "message": "Wow you found the dog!",
  "tool": {
    "name": "highlight_object",
    "object": "dog"
  }
}
```

**Supported objects:** `dog`, `tree`, `swing`, `flower`

### Celebrate Tool
Triggers confetti celebration animation.

```json
{
  "message": "That's amazing!",
  "tool": {
    "name": "celebrate"
  }
}
```

## 🧠 AI Integration

### Using with OpenAI API

1. Get API key from [openai.com](https://openai.com)
2. Add to `backend/.env`:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Restart backend server

The app will automatically use the real OpenAI API instead of mock responses.

### Using Mock Responses (Default)

For development and demo, the backend provides intelligent mock responses:
- Detects keywords in user input
- Returns contextually appropriate responses
- Includes tool calls for object highlighting and celebrations
- Perfect for testing UI without API costs

## 🎯 How It Works

### Flow Diagram
```
1. App Initializes
   ↓
2. AI speaks opening message
   ↓
3. Microphone auto-activates
   ↓
4. Child speaks (Web Speech API)
   ↓
5. Transcript sent to backend
   ↓
6. AI generates response (OpenAI or mock)
   ↓
7. Check for tool_calls → execute if present
   ↓
8. AI speaks response (SpeechSynthesis)
   ↓
9. Loop back to step 3 until 60 seconds
   ↓
10. AI says goodbye
    ↓
11. Conversation ends
```

## 🎨 Customization

### Change the Image
Edit [frontend/src/components/ImageDisplay.jsx](frontend/src/components/ImageDisplay.jsx) to modify the SVG park scene.

### Change AI Personality
Edit the `SYSTEM_PROMPT` in [backend/routes/chat.js](backend/routes/chat.js).

### Adjust Timer Length
In [frontend/src/App.jsx](frontend/src/App.jsx), change:
```javascript
const TOTAL_TIME = 60; // Change to desired seconds
```

### Add More Tool Types
In [frontend/src/App.jsx](frontend/src/App.jsx), extend `handleToolCall()`:
```javascript
if (tool.name === 'my_new_tool') {
  // Your logic here
}
```

## 🔧 Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI framework + build tool |
| **Styling** | Tailwind CSS | Utility-first CSS |
| **Speech Input** | Web Speech API | Browser STT |
| **Speech Output** | SpeechSynthesis API | Browser TTS |
| **Backend** | Node.js + Express | REST API server |
| **LLM** | OpenAI GPT-4 | AI responses (optional) |

## 📊 Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Web Speech API | ✅ | ❌ | ✅ | ✅ |
| SpeechSynthesis | ✅ | ✅ | ✅ | ✅ |
| React 18 | ✅ | ✅ | ✅ | ✅ |

**Note:** For best experience, use Chrome, Edge, or Safari. Firefox limited to TTS only.

## 🧪 Testing

### Test Microphone Permission
- App will request microphone access on first interaction
- Grant permission to enable voice input

### Test Mock Responses
```bash
# Start backend WITHOUT OpenAI API key
npm run dev
# Enter phrases: "dog", "tree", "yes", "no"
# Watch for automatic tool triggering
```

### Test Real AI
```bash
# Add OpenAI API key to .env
# Restart backend
# Conversation now uses real GPT-4
```

## 🐛 Troubleshooting

### "Speech Recognition not supported"
- Use Chrome, Edge, or Safari
- Firefox only supports TTS (speech output)

### Microphone not activating
- Check browser microphone permissions
- Refresh page if permission denied
- Ensure HTTPS (required for some browsers) or localhost

### Backend connection error
- Verify backend is running: `npm run dev` in backend folder
- Check console for CORS errors
- Ensure `.env` files are configured correctly

### AI responses not appearing
- Check Network tab in DevTools for failed API calls
- Verify `VITE_API_URL` in frontend `.env`
- Backend console should show request logs

## 📝 Example Conversation

```
AI: Hi! I see a beautiful park! Do you see the trees and the swing? What do you like about the park?

Child: I like the dog!

[Tool Triggered: highlight_object "dog"]
[Highlight appears on dog in image]

AI: Yes! The doggy loves to play in the park! Do you like dogs?

Child: Yeah! He's fun!

[Tool Triggered: celebrate]
[Confetti animations appear]

AI: That's awesome! Can you find something green in the park?

[Continues until 60 seconds complete...]

AI: Great job! You were amazing! Goodbye!
```

## 🚀 Production Deployment

### Frontend (Vercel/Netlify)
```bash
# Build for production
npm run build

# Deploy the dist/ folder
```

### Backend (Heroku/Railway/Render)
```bash
# Set environment variables:
OPENAI_API_KEY=your_key
NODE_ENV=production
PORT=3000

# Deploy and run:
npm start
```

## 📄 License

This project is available for educational and commercial use.

## 🤝 Contributing

Feel free to extend this project with:
- More interactive tools
- Additional conversation topics
- Multi-language support
- Authentication and user tracking
- Analytics and conversation history

---

**Built with ❤️ for joyful child-AI interactions!**
