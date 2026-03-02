# LLM Integration Guide

## API Call Examples

### Example 1: Send User Message

**HTTP Request:**
```
POST /api/chat
Content-Type: application/json

{
  "message": "I see a dog!",
  "sessionId": "1645567890"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I see a dog!",
    "sessionId": "1645567890"
  }'
```

### Standard Response Format

**Plain Text Response:**
```json
{
  "message": "Yes! The doggy loves to play! Do you like dogs?"
}
```

**Response with Tool Call:**
```json
{
  "message": "Wow! You found the dog!",
  "tool": {
    "name": "highlight_object",
    "object": "dog"
  }
}
```

**Celebration Response:**
```json
{
  "message": "That's amazing! You're doing great!",
  "tool": {
    "name": "celebrate"
  }
}
```

## OpenAI Integration Example

### Using GPT-4 Turbo

```javascript
// In backend/routes/chat.js

const response = await axios.post(
  'https://api.openai.com/v1/chat/completions',
  {
    model: 'gpt-4-turbo',
    messages: [
      {
        role: 'system',
        content: SYSTEM_PROMPT // Child-friendly system prompt
      },
      ...conversationHistory // Previous messages
    ],
    max_tokens: 150,
    temperature: 0.8,
    top_p: 1
  },
  {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  }
);

return response.data.choices[0].message.content;
```

### System Prompt for Child Interaction

```
You are a friendly, helpful AI assistant designed to have conversations 
with a 6-year-old child. Follow these guidelines:

1. Use simple, easy-to-understand words
2. Keep responses very short (1-3 sentences max)
3. Be enthusiastic and fun
4. Ask questions about the image to encourage engagement
5. Never ask for personal information
6. Never suggest meeting in person
7. Use child-safe language only

When highlighting objects, respond ONLY in JSON format:
{
  "message": "Your response",
  "tool": {
    "name": "highlight_object",
    "object": "object_name"
  }
}
```

## Message Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Frontend (React)                       │
│                                                          │
│  [ Speech Recognition ] ──> [ User Transcript ]         │
│                                      │                   │
│                                      ▼                   │
│                          [ Send to Backend ]             │
│                                      │                   │
└──────────────────────────────────────┼──────────────────┘
                                       │
                ┌──────────────────────▼───────────────────┐
                │      Backend (Express + OpenAI)         │
                │                                         │
                │  [ Receive Message ]                    │
                │         │                               │
                │         ▼                               │
                │  [ Add to History ]                     │
                │         │                               │
                │         ▼                               │
                │  [ Call OpenAI API ]                    │
                │         │                               │
                │         ▼                               │
                │  [ Parse Response ]                     │
                │         │                               │
                │         ▼                               │
                │  [ Check for Tools ]                    │
                │         │                               │
                │         ▼                               │
                │  [ Return JSON ]                        │
                │                                         │
                └──────────────┬──────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────┐
│               Frontend (Tool Handling)                  │
│                                                        │
│  [ Receive Response ]                                  │
│         │                                              │
│         ▼                                              │
│  [ If tool.name === "highlight_object" ]              │
│     ├─> Set highlighted object state                  │
│     ├─> Render glow circle on image                   │
│     └─> Clear highlight after 3s                      │
│                                                        │
│  [ If tool.name === "celebrate" ]                     │
│     ├─> Trigger confetti animation                    │
│     └─> Play celebration sounds (optional)            │
│                                                        │
│  [ Speak Response ]                                    │
│     └─> Auto-activate microphone after TTS            │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Conversation History Management

The backend maintains conversation history per session:

```javascript
// Store multiple conversations
const conversations = new Map();

// Each conversation is an array of message objects
conversations.get(sessionId) = [
  { role: 'user', content: 'I like the dog!' },
  { role: 'assistant', content: 'That\'s great! Do you like playing?' },
  // ... more messages
];

// Keep last 20 items (10 exchanges) for context
if (history.length > 20) {
  history.shift();
}
```

## Tool Definitions

### highlight_object
- **Purpose**: Draw attention to specific elements in the image
- **Supported objects**: dog, tree, swing, flower
- **Visual effect**: Glowing golden circle around object
- **Duration**: 3 seconds auto-hide
- **Example**:
  ```json
  {
    "tool": {
      "name": "highlight_object",
      "object": "dog"
    }
  }
  ```

### celebrate
- **Purpose**: Reward positive interactions
- **Visual effect**: Colorful confetti falling animation
- **Duration**: 3.5 seconds
- **Frequency**: Trigger on positive responses (yes, great, awesome, etc.)
- **Example**:
  ```json
  {
    "tool": {
      "name": "celebrate"
    }
  }
  ```

## Frontend Tool Handling Code

```javascript
// In frontend/src/App.jsx

const handleToolCall = (tool) => {
  if (!tool || !tool.name) return;

  if (tool.name === 'highlight_object') {
    // Show highlight
    setHighlightedObject(tool.object);
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setHighlightedObject(null);
    }, 3000);
    
  } else if (tool.name === 'celebrate') {
    // Trigger confetti
    setCelebrateTriggered(true);
    
    // Reset trigger for next time
    setTimeout(() => {
      setCelebrateTriggered(false);
    }, 3500);
  }
};
```

## Mock Response Strategy

For development without OpenAI API:

```javascript
function getMockResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  // Keyword-based responses
  if (lowerMessage.includes('dog')) {
    return JSON.stringify({
      message: 'Yes! The doggy loves to play!',
      tool: { name: 'highlight_object', object: 'dog' }
    });
  }
  
  if (lowerMessage.includes('yes') || lowerMessage.includes('yeah')) {
    return JSON.stringify({
      message: 'Yay! That\'s awesome!',
      tool: { name: 'celebrate' }
    });
  }
  
  // Default response
  return 'That\'s cool! What else do you see?';
}
```

## Error Handling

### Frontend Error Recovery

```javascript
try {
  const response = await sendMessage(userMessage, sessionId);
  // Process response
} catch (error) {
  console.error('Error:', error);
  
  // Show fallback message
  speak('That\'s great! Tell me more!', () => {
    autoActivateMic(); // Re-activate listening
  });
}
```

### Backend Error Responses

```javascript
// 400: Bad request
{ error: 'Message is required' }

// 500: Server error
{ 
  error: 'Failed to process chat request',
  message: 'Detailed error message'
}
```

## Performance Considerations

1. **Context Window**: Keep conversation history to last 10 exchanges (20 items)
2. **Response Tokens**: Max 150 tokens for quick responses
3. **Temperature**: 0.8 for balanced creativity and consistency
4. **Caching**: No caching needed (real-time interaction)

## Security Best Practices

1. ✅ No personal data collection
2. ✅ Input validation on user messages
3. ✅ System prompt prevents unsafe responses
4. ✅ CORS enabled for local frontend
5. ✅ No external API keys in frontend
6. ✅ Rate limiting recommended for production

---

**For questions about integration, see the main README.md**
