# Architecture & Implementation Details

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
├──────────────────────────────────────┬──────────────────────────┤
│     Frontend (React + Vite)          │    Browser APIs           │
├──────────────────────────────────────┼──────────────────────────┤
│ • ImageDisplay.jsx                   │ • Web Speech API         │
│ • MicButton.jsx                      │ • SpeechSynthesis API   │
│ • Timer.jsx                          │ • Fetch API             │
│ • TranscriptArea.jsx                 │                         │
│ • Confetti.jsx                       │                         │
│ • App.jsx (State Management)         │                         │
│                                      │                         │
│ Utils:                               │                         │
│ • speechRecognition.js               │                         │
│ • textToSpeech.js                    │                         │
│ • apiClient.js                       │                         │
└──────────────────────────────────────┴──────────────────────────┘
          │                                   │
          │ HTTP REST API                     │ Browser APIs
          │                                   │
          ▼                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                         localhost:5000                           │
├─────────────────────────────────────────────────────────────────┤
│              Backend (Node.js + Express)                         │
├─────────────────────────────────────────────────────────────────┤
│ • server.js (Main server)                                       │
│ • routes/chat.js (Chat endpoints)                               │
│                                                                 │
│ Features:                                                       │
│ • Session management (Map<sessionId, history>)                  │
│ • Conversation history tracking                                 │
│ • Mock response generation                                      │
│ • OpenAI API integration (optional)                             │
│                                                                 │
│ Endpoints:                                                      │
│ • POST /api/chat/init - Initialize session                     │
│ • POST /api/chat - Send message                                │
└──────────────────┬────────────────────────────────────────────┘
                   │
                   │ (Optional - Real LLM)
                   │
                   ▼
        ┌──────────────────────┐
        │  OpenAI API          │
        │  (GPT-4 Turbo)       │
        └──────────────────────┘
```

## Component Hierarchy

```
<App> (Main orchestrator)
├── <Timer> (Display countdown)
├── <ImageDisplay> (Render park scene)
│   └── <HighlightOverlay> (Tool-triggered glow)
├── <TranscriptArea> (Conversation history)
├── <MicButton> (Voice input control)
├── <Confetti> (Celebration animation)
└── (Loading indicator)
```

## State Flow Diagram

```
┌─────────────────────────────────┐
│   Component State (App.jsx)      │
├─────────────────────────────────┤
│ sessionId                        │
│ messages[]                       │
│ timeLeft                         │
│ isListening                      │
│ isConversationActive             │
│ interimTranscript                │
│ highlightedObject                │
│ celebrateTriggered               │
│ isLoading                        │
│ apiAvailable                     │
└──────────────┬────────────────────┘
               │
         ┌─────▼─────┐
         │  Refs     │
         ├───────────┤
         │ recognition
         │ timerInterval
         │ autoListen
         └───────────┘
```

## Execution Timeline

### Initial Load (0-2 seconds)
```
1. App mounts
2. Health check API
3. Initialize session (/api/chat/init)
4. Add initial message to state
5. Speak opening message to child
```

### Main Conversation Loop (2-62 seconds)
```
For each iteration:
  1. AI finishes speaking
  2. Auto-activate microphone (500ms delay)
  3. Child speaks into microphone
  4. Web Speech API captures transcript
  5. Stop listening
  6. Send message to backend (/api/chat)
  7. Backend adds to history
  8. Backend calls OpenAI (or mock)
  9. Backend returns response + optional tool
  10. Frontend receives response
  11. Handle tool call (highlight/celebrate)
  12. Speak AI response
  13. Extract text from response
  14. Add to message list (UI updates)
  15. Return to step 2 (if time left)
```

### Teardown (62+ seconds)
```
1. Timer reaches 0
2. handleConversationEnd() triggered
3. Set isConversationActive = false
4. Stop listening
5. Speak goodbye message
6. Show completion screen
7. User can restart
```

## Key Implementation Details

### 1. Microphone Auto-Activation Strategy

```javascript
// After AI finishes speaking:
1. Speech synthesis onend event fires
2. autoActivateMic() called
3. setTimeout(500ms) for safety
4. Check conditions:
   - isConversationActive === true
   - isSpeaking() === false
5. Call handleStartListening()
```

**Why 500ms delay?**
- Prevents microphone from capturing TTS audio
- Gives user time to react
- Stable in different browsers

### 2. Conversation History Management

```javascript
// Backend stores per session:
Map<sessionId, Message[]>

// Message format:
{ role: 'user'|'assistant', content: 'text' }

// Real conversation with 3 exchanges:
[
  { role: 'user', content: 'I like the dog' },
  { role: 'assistant', content: 'Great! Do you like dogs?' },
  { role: 'user', content: 'Yes!' },
  { role: 'assistant', content: 'Awesome!' },
  // ... continues
]

// Pruning:
if (history.length > 20) {
  history.shift(); // Remove oldest
}
```

### 3. Tool Call Detection and Handling

```javascript
// Response from backend:
{
  "message": "Text to speak",
  "tool": {
    "name": "highlight_object",
    "object": "dog"
  }
}

// Frontend handles:
try {
  const parsed = JSON.parse(response.message);
  if (parsed.message && parsed.tool) {
    // Is structured tool response
    extractedMessage = parsed.message;
    toolCall = parsed.tool;
  }
} catch {
  // Is plain text
  extractedMessage = response.message;
}
```

### 4. Speech Recognition Error Recovery

```javascript
// On recognition error:
1. Stop listening
2. Show error message in transcript
3. Speak fallback message
4. Auto-activate mic again
5. Continue conversation

// Prevents dead conversation
```

### 5. Timer Management

```javascript
// Every 1 second:
setTimeLeft(prev => {
  if (prev <= 1) {
    handleConversationEnd();
    return 0;
  }
  return prev - 1;
});

// Clean up on unmount:
clearInterval(timerIntervalRef.current);
```

## Performance Optimizations

### 1. Conversation Pruning
- Keep only last 20 items (10 exchanges)
- Reduces API payload
- Faster response times
- Still maintains context

### 2. Debounced State Updates
- Batch transcript updates
- Single render after speech ends
- Avoids re-rendering on interim results

### 3. Cleanup References
- Abort recognition on unmount
- Clear timeouts
- Stop TTS
- Free memory

### 4. Component Memoization
```javascript
// Future optimization:
const ImageDisplay = React.memo(({ highlightedObject }) => {
  // Only re-renders when highlightedObject changes
});
```

## Security & Safety

### 1. System Prompt Enforcement
```
- Simple language enforcement
- No personal info collection
- No unsafe content
- Age-appropriate responses
```

### 2. Input Validation
```javascript
if (!message) {
  return { error: 'Message is required' };
}
// Only text, no code execution
```

### 3. API Key Security
```
✅ OPENAI_API_KEY stored in backend .env only
❌ Never exposed in frontend
❌ Never logged in console (production)
```

### 4. CORS Configuration
```javascript
app.use(cors());
// Allows requests from localhost:3000
// Can restrict in production
```

## Error Handling Strategy

### Frontend
```
Speech Recognition Error
  ├─> Log error
  ├─> Show message
  └─> Auto-recover (retry)

API Error
  ├─> Log error
  ├─> Use fallback message
  ├─> Speak fallback
  └─> Resume listening
```

### Backend
```
OpenAI API Error
  ├─> Log error
  ├─> Return mock response
  └─> Continue conversation

Invalid Request
  ├─> Return 400 error
  └─> Frontend handles gracefully
```

## Testing Scenarios

### 1. Happy Path (Full Conversation)
```
✓ App loads
✓ AI speaks greeting
✓ Mic activates
✓ Child speaks "dog"
✓ AI responds with highlight
✓ Highlight appears
✓ AI speaks response
✓ Repeats until 60s
✓ Goodbye message
✓ Completion screen
```

### 2. Error Recovery
```
✓ Mic permission denied
  → Show message
  → Allow retry

✓ Network error
  → Use mock responses
  → Continue conversation

✓ No speech detected
  → Ask again
  → Re-activate mic
```

### 3. Tool Triggering
```
✓ highlight_object
  → Glow appears (3s)
  → Coordinates correct
  → Auto-hides after 3s

✓ celebrate
  → Confetti appears (3.5s)
  → Multiple colors
  → Auto-cleans up
```

## Production Considerations

### 1. API Rate Limiting
```
Recommended: 100 requests/minute per session
Track: sessionId throttling
```

### 2. Session Cleanup
```
Clear old sessions every 1 hour
Prevent memory leaks
```

### 3. Monitoring
```
Log all API calls
Track error rates
Monitor response times
```

### 4. Scaling
- Use Redis for distributed sessions
- Load balance backend instances
- Cache mock responses
- CDN for frontend assets

## Browser Compatibility

### Speech APIs
| Feature | Chrome | Safari | Edge | Firefox |
|---------|--------|--------|------|---------|
| Speech Recognition | ✅ | ✅ (iOS 14.5+) | ✅ | ❌ |
| SpeechSynthesis | ✅ | ✅ | ✅ | ✅ |

### Fallbacks
- No Web Speech API → Show text input
- No TTS → Display text only
- Network fail → Mock responses

## Future Enhancements

1. **Multi-language Support**
   - Language selection at start
   - Different system prompts per language

2. **Analytics**
   - Track engagement metrics
   - Favorite objects/topics
   - Time spent per topic

3. **Advanced Tools**
   - Sound effects on tool trigger
   - Animation sequences
   - Difficulty levels

4. **Persistent Storage**
   - Save conversation history
   - User profiles
   - Progress tracking

5. **Accessibility**
   - High contrast mode
   - Text magnification
   - Adapted for different abilities

---

**For deployment and setup, refer to README.md**
