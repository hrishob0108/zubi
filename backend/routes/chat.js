import express from 'express';
import { handleChat, initSession } from '../controllers/chatController.js';

const router = express.Router();

/**
 * POST /chat
 * Main chat endpoint
 * Receives user message and returns AI response
 */
router.post('/chat', handleChat);

/**
 * POST /chat/init
 * Initialize a new conversation session
 */
router.post('/chat/init', initSession);

export default router;
