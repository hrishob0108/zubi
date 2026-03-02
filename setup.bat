@echo off
REM Quick setup script for Real-Time AI Child Interaction App (Windows)

setlocal enabledelayedexpansion

echo 🚀 Setting up Real-Time AI Child Interaction App...
echo.

REM Backend setup
echo 📦 Setting up Backend...
cd backend

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo ✅ Backend .env created
)

echo Installing backend dependencies...
call npm install

echo ✅ Backend setup complete!
echo.

REM Frontend setup
cd ..\frontend

echo 📦 Setting up Frontend...

if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo ✅ Frontend .env created
)

echo Installing frontend dependencies...
call npm install

echo ✅ Frontend setup complete!
echo.

echo 🎉 Setup Complete!
echo.
echo 📋 Next Steps:
echo 1. Open Terminal 1: cd backend ^&^& npm run dev
echo 2. Open Terminal 2: cd frontend ^&^& npm run dev
echo 3. Open browser: http://localhost:3000
echo.
echo 💡 Optional: Add OpenAI API key to backend\.env for real LLM
echo.
echo Happy coding! 🎵

pause
