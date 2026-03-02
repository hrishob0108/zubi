#!/bin/bash
# Quick setup script for Real-Time AI Child Interaction App

set -e

echo "🚀 Setting up Real-Time AI Child Interaction App..."
echo ""

# Backend setup
echo "📦 Setting up Backend..."
cd backend

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ Backend .env created"
fi

echo "Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"
echo ""

# Frontend setup
cd ../frontend

echo "📦 Setting up Frontend..."

if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✅ Frontend .env created"
fi

echo "Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

echo "🎉 Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Open Terminal 1: cd backend && npm run dev"
echo "2. Open Terminal 2: cd frontend && npm run dev"
echo "3. Open browser: http://localhost:3000"
echo ""
echo "💡 Optional: Add OpenAI API key to backend/.env for real LLM"
echo ""
echo "Happy coding! 🎵"
