/**
 * API Client Utility
 * Handles all backend API calls
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Initialize a new chat session
 */
export const initializeSession = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/api/chat/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to initialize session');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Session initialization error:', error);
    throw error;
  }
};

/**
 * Send a message to the AI and get a response
 * @param {string} message - User message
 * @param {string} sessionId - Session identifier
 * @returns {Promise<{message: string, tool?: {name: string, object?: string}}>}
 */
export const sendMessage = async (message, sessionId) => {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

/**
 * Health check for backend
 */
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
