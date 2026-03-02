import { GoogleGenAI } from '@google/genai';


const conversations = new Map();

/**
 * System prompt for child-friendly AI
 * Designed for interaction with 6-year-olds
 */
const SYSTEM_PROMPT = `You are a friendly, helpful AI assistant designed to have conversations with a 6-year-old child. Follow these guidelines:

1. Use simple, easy-to-understand words
2. Be conversational and elaborate on your answers so the child is engaged
3. Be enthusiastic and fun
4. Ask questions about the image they see to encourage engagement
5. Never ask for personal information (name, age, location, school, etc.)
6. Never ask questions about their family or home
7. Never suggest meeting in person or online
8. Never collect any personal data
9. Use child-safe language only
10. Correct inappropriate content gently

When you want to highlight an object or show celebration, respond ONLY in this JSON format:
{
  "message": "Your conversational response here",
  "tool": {
    "name": "highlight_object",
    "object": "object_name"
  }
}

Or for celebration:
{
  "message": "Your conversational response here",
  "tool": {
    "name": "celebrate"
  }
}

For normal responses, just provide the text message.`;

/**
 * Main chat handler
 * Receives user message and returns AI response
 */
export const handleChat = async (req, res, next) => {
    try {
        const { message, sessionId } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }


        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, []);
        }

        const history = conversations.get(sessionId);


        history.push({
            role: 'user',
            content: message,
        });


        let aiResponse;

        if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here') {
            aiResponse = await callGemini(history);
        } else {

            aiResponse = getMockResponse(message);
        }


        let parsedResponse = { message: aiResponse };
        try {
            const parsed = JSON.parse(aiResponse);
            if (parsed.message && parsed.tool) {
                parsedResponse = parsed;
            }
        } catch (e) {

            parsedResponse = { message: aiResponse };
        }


        history.push({
            role: 'assistant',
            content: aiResponse,
        });


        if (history.length > 20) {
            history.shift();
        }

        res.json(parsedResponse);
    } catch (error) {
        next(error);
    }
};

/**
 * Initialize a new conversation session
 */
export const initSession = (req, res) => {
    const sessionId = Date.now().toString();
    conversations.set(sessionId, []);

    res.json({
        sessionId,
        initialMessage: 'Hi! I see a beautiful park! Do you see the trees and the swing? What do you like about the park?',
    });
};

/**
 * Call Gemini API with conversation history
 */
async function callGemini(history) {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



        const geminiHistory = history.map(msg => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }]
        }));

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: geminiHistory,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                maxOutputTokens: 500,
                temperature: 0.8,
            }
        });

        return response.text;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('Failed to get response from Gemini');
    }
}

/**
 * Mock responses for development and demo purposes
 * Returns child-friendly responses about a park scene
 */
function getMockResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();


    if (lowerMessage.includes('dog') || lowerMessage.includes('puppy')) {
        return JSON.stringify({
            message: 'Yes! The doggy loves to play in the park! Do you like dogs?',
            tool: {
                name: 'highlight_object',
                object: 'dog',
            },
        });
    }

    if (lowerMessage.includes('tree') || lowerMessage.includes('trees')) {
        return 'Trees give us shade and fresh air! They\'re so cool!';
    }

    if (lowerMessage.includes('swing') || lowerMessage.includes('play')) {
        return JSON.stringify({
            message: 'Swings are so much fun! You can go really high!',
            tool: {
                name: 'celebrate',
            },
        });
    }

    if (lowerMessage.includes('flower') || lowerMessage.includes('flower')) {
        return 'Pretty flowers make the park beautiful! Do you like colors?';
    }

    if (lowerMessage.includes('kids') || lowerMessage.includes('children')) {
        return 'Kids have so much fun playing together in the park!';
    }

    if (lowerMessage.includes('yes') || lowerMessage.includes('yeah')) {
        return JSON.stringify({
            message: 'Yay! That\'s awesome!',
            tool: {
                name: 'celebrate',
            },
        });
    }

    if (lowerMessage.includes('no') || lowerMessage.includes('nope')) {
        return 'That\'s okay! What do you think about this part?';
    }


    const defaults = [
        'That\'s cool! What else do you see in the park?',
        'Nice! Do you like playing outside?',
        'Awesome! Can you find something green?',
        'Great! What\'s your favorite thing in the park?',
    ];

    return defaults[Math.floor(Math.random() * defaults.length)];
}
