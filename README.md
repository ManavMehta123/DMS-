<img width="1905" height="963" alt="Screenshot 2026-02-04 133619" src="https://github.com/user-attachments/assets/5cabb7e8-1a9d-4ccf-a657-abb0f7accc1d" /># Document Management System (DMS)

A simple and fully functional Document Management System built with the MongoDB, Express.js, Vanilla JavaScript frontend, Node.js.

## Features

✅ **User Authentication**
- User registration and login
- JWT-based authentication
- Secure password hashing

✅ **Document Management**
- Upload documents (PDFs, images, Word docs, Excel files)
- Categorize documents with tags
- Add title and description to documents
- View document details

✅ **Search & Filter**
- Search by title, description, or content
- Filter by tags
- View all documents or search results

✅ **Permissions**
- Owner-based permissions
- View and edit access control
- Only owners can delete documents

✅ **Responsive Design**
- Mobile-friendly interface
- Clean and modern UI
- Easy to use

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Frontend**: HTML5, CSS3, Vanilla JavaScript,Angular
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)

## Installation & Setup

### Step 1: Install MongoDB

**For Windows:**
1. Download MongoDB Community Server from the link above
2. Run the installer and follow the setup wizard
3. MongoDB will start automatically as a service

**For Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**For Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### Step 2: Verify MongoDB is Running

Open a terminal and run:
```bash
mongosh
```

If you see the MongoDB shell, it's working! Type `exit` to quit.

### Step 3: Install Backend Dependencies

Open a terminal in the `backend` folder and run:

```bash
cd backend
npm install
```

This will install all required packages:
- express
- mongoose
- cors
- bcryptjs
- jsonwebtoken
- multer
- dotenv

### Step 4: Configure Environment Variables

The `.env` file is already created in the backend folder. If you want to change settings:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dms
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### Step 5: Start the Backend Server

In the `backend` folder:

```bash
npm start
```

You should see:
```
Server running on port 3000
MongoDB connected successfully
```

### Step 6: Open the Frontend
After the backend is running, the user goes back to the root project folder in another terminal , create another terminal using '+' in corner and create another terminal , in another terminal go back to the root directory using the command :
cd ..

and then run the following command.

npm run frontend


This command uses a simple HTTP server to serve the frontend files.

The frontend runs on port 8080 and loads the HTML interface in the browser.
```

Then open `http://localhost:8080` in your browser.

**Option 3: Use VS Code Live Server**
- Install the Live Server extension in VS Code
- Right-click `index.html` and select "Open with Live Server"

## Usage Guide

### 1. Register a New Account
- Open the application
- Click "Register" link
- Enter username, email, and password
- Click "Register" button

### 2. Login
- Enter your email and password
- Click "Login" button

### 3. Upload a Document
- Fill in the title (required)
- Choose a file (required)
- Add description (optional)
- Add tags separated by commas (optional)
- Click "Upload Document"

### 4. Search Documents
- Use the search box to search by title or description
- Use the tags filter to filter by specific tags
- Click "Search" to apply filters
- Click "Show All" to reset and show all documents

### 5. View Document Details
- Click "View" on any document card
- See full details, version history, and metadata
- Download the current version

### 6. Edit a Document
- Click "Edit" on a document you own
- Update title, description, or tags
- Click "Update"


### 8. Delete a Document
- Click "Delete" on a document you own
- Confirm the deletion

### Technology Usage Clarification
Initially, the project was planned to be developed using the MEAN stack, including
Angular for the frontend. However, during implementation, Angular was not used
extensively. Instead, most of the frontend functionality was developed using HTML,
CSS, and JavaScript.
This approach was chosen to keep the project simple and to focus more on
understanding core web development concepts. HTML was used to structure the pages,
CSS was used for styling and responsiveness, and JavaScript was used to handle user
interactions.
Angular configuration files are present in the project structure, but the main user
interface and logic were implemented using plain frontend technologies rather than
Angular components. This allowed faster development and easier debugging.
The backend was fully implemented using Node.js and Express.js, and MongoDB was
used as the database for storing users and document information.


## Troubleshooting

### MongoDB Connection Error
**Problem:** `MongoDB connection error`
**Solution:** 
- Make sure MongoDB is running
- Check if the connection string in `.env` is correct
- Try `mongosh` in terminal to verify MongoDB is accessible

### CORS Error
**Problem:** `CORS policy blocked`
**Solution:** 
- The backend already has CORS enabled
- Make sure you're accessing the frontend from the same domain
- Use a local server instead of opening the file directly

### File Upload Error
**Problem:** `File upload failed`
**Solution:** 
- Check file size (limit is 10MB)
- Verify file type is allowed (pdf, jpg, jpeg, png, doc, docx, txt, xlsx, xls)
- Make sure the `uploads` folder exists in the backend directory

### Port Already in Use
**Problem:** `Port 3000 is already in use`
**Solution:** 
- Change the PORT in `.env` file to another number (e.g., 3001)
- Or kill the process using port 3000


## Security Notes

⚠️ **Important for Production:**
1. Change the `JWT_SECRET` in `.env` to a strong, random string
2. Use HTTPS for production deployment
3. Implement rate limiting on API endpoints
4. Add input validation and sanitization
5. Use environment-specific configurations
6. Set up proper MongoDB authentication

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Check the backend terminal for error messages
3. Verify MongoDB is running
4. Make sure all dependencies are installed

## Technology Usage Clarification

The project was initially planned to be developed using the **MEAN stack**, with **Angular** intended for the frontend. However, during implementation, Angular was not used extensively.
Instead, most of the frontend functionality was developed using **HTML, CSS, and JavaScript**. This decision was made to keep the project simple and to focus on understanding core web development concepts.
- **HTML** was used for structuring the web pages  
- **CSS** was used for styling and responsiveness  
- **JavaScript** was used to handle user interactions and client-side logic  
Although Angular configuration files exist in the project structure, the main user interface and application logic were implemented using plain frontend technologies rather than Angular components. This allowed faster development and easier debugging.
The backend of the project was fully implemented using **Node.js** and **Express.js**, while **MongoDB** was used as the database for storing user and document information.
