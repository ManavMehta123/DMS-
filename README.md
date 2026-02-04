# Document Management System (DMS)

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

✅ **Version Control**
- Track document versions
- Upload new versions with comments
- View version history

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
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

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

### 7. Upload a New Version
- Click "View" on a document
- In the modal, use the "Upload New Version" form
- Select a new file and add a comment
- Click "Upload Version"

### 8. Delete a Document
- Click "Delete" on a document you own
- Confirm the deletion

## File Structure

```
dms-project/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Document.js      # Document schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── documents.js     # Document CRUD routes
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── uploads/             # Uploaded files storage
│   ├── .env                 # Environment variables
│   ├── server.js            # Main server file
│   └── package.json         # Dependencies
│
└── frontend/
    ├── css/
    │   └── style.css        # All styles
    ├── js/
    │   ├── config.js        # API configuration
    │   ├── auth.js          # Authentication logic
    │   ├── documents.js     # Document management
    │   └── app.js           # Main app initialization
    └── index.html           # Main HTML file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents` - Get all accessible documents
- `GET /api/documents/search` - Search documents
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document details
- `POST /api/documents/:id/version` - Upload new version
- `PUT /api/documents/:id/permissions` - Update permissions
- `DELETE /api/documents/:id` - Delete document

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

## Default Test Account

You can create a test account with these credentials:
- Email: test@example.com
- Password: test123
- Username: testuser

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

## License

MIT License - feel free to use this project for learning or personal use.

## Future Enhancements

Potential features to add:
- Email notifications
- Shared folders
- Advanced permissions (view-only, comment, etc.)
- Document preview
- Collaborative editing
- Activity logs
- File organization with folders
- Bulk operations
- Document templates
