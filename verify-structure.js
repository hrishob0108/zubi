#!/usr/bin/env node

/**
 * Directory Structure Verification
 * Run: node verify-structure.js
 */

const fs = require('fs');
const path = require('path');

const projectRoot = process.cwd();

const expectedFiles = {
  root: [
    'README.md',
    'PROJECT_OVERVIEW.md',
    'IMPLEMENTATION_CHECKLIST.md',
    'ARCHITECTURE.md',
    'LLM_INTEGRATION_GUIDE.md',
    '.gitignore',
    'setup.sh',
    'setup.bat',
  ],
  backend: [
    'package.json',
    '.env.example',
    'server.js',
    'routes/chat.js',
  ],
  frontend: [
    'package.json',
    '.env.example',
    'index.html',
    'vite.config.js',
    'tailwind.config.js',
    'postcss.config.js',
    'src/main.jsx',
    'src/App.jsx',
    'src/index.css',
    'src/components/ImageDisplay.jsx',
    'src/components/MicButton.jsx',
    'src/components/Timer.jsx',
    'src/components/TranscriptArea.jsx',
    'src/components/Confetti.jsx',
    'src/utils/speechRecognition.js',
    'src/utils/textToSpeech.js',
    'src/utils/apiClient.js',
  ],
};

console.log('\n🔍 Verifying Project Structure...\n');

let allGood = true;

// Check root files
console.log('📁 Root Files:');
expectedFiles.root.forEach((file) => {
  const fullPath = path.join(projectRoot, file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} ${file}`);
  if (!exists) allGood = false;
});

// Check backend files
console.log('\n📁 Backend Files:');
expectedFiles.backend.forEach((file) => {
  const fullPath = path.join(projectRoot, 'backend', file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} backend/${file}`);
  if (!exists) allGood = false;
});

// Check frontend files
console.log('\n📁 Frontend Files:');
expectedFiles.frontend.forEach((file) => {
  const fullPath = path.join(projectRoot, 'frontend', file);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`  ${status} frontend/${file}`);
  if (!exists) allGood = false;
});

console.log('\n' + '='.repeat(60));

if (allGood) {
  console.log('✅ All files present! Project is ready to use.\n');
  console.log('📋 Next Steps:');
  console.log('  1. Run: setup.bat (Windows) or ./setup.sh (Linux/Mac)');
  console.log('  2. Or manually: npm install in backend/ and frontend/');
  console.log('  3. Start: npm run dev in both directories');
  console.log('  4. Open: http://localhost:3000\n');
} else {
  console.log('❌ Some files are missing. Please check the output above.\n');
  process.exit(1);
}
