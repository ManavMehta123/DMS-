# Quick Setup Guide - Document Management System

## Super Simple 3-Step Setup

### Step 1: Install Prerequisites (One Time Only)

**Install Node.js:**
- Go to https://nodejs.org/
- Download and install the LTS version
- Verify: Open terminal/cmd and type `node --version`

**Install MongoDB:**

**Windows:**
- Go to https://www.mongodb.com/try/download/community
- Download MongoDB Community Server
- Run installer (use default settings)
- MongoDB starts automatically

**Mac:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongod
```

### Step 2: Install Project Dependencies

Open terminal/command prompt in the project folder:

```bash
cd backend
npm install
```

Wait for installation to complete (may take 2-3 minutes).

### Step 3: Run the Application

**Easy Way (Recommended):**

**Windows:** 
- Double-click `start.bat`

**Mac/Linux:**
```bash
./start.sh
```

**Manual Way:**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
-if backend is opened then use 
 cd..
 In the root directory run
 npm run frontend

## That's It! 🎉

The application should now be running:
- Backend: http://localhost:3000
- Frontend: Open in your browser

## First Time Use

1. Click "Register" to create an account
2. Login with your credentials
3. Upload your first document!

## Common Issues

**MongoDB not running?**
```bash
# Windows: MongoDB should start automatically with installation
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

**Port 3000 in use?**
- Edit `backend/.env` and change PORT to 3001

**Can't access from other devices?**
- This is a local development setup
- Use localhost or 127.0.0.1

## Need Help?

Check the full README.md for detailed documentation.
