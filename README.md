# Task Management MERN

A full-stack Task Management application built using the MERN stack — MongoDB, Express.js, React.js, and Node.js.

The application allows users to create an account, securely log in, and manage their tasks through a simple and responsive interface.

## Demo :

The application includes:

* 🔐 User Registration & Login
* 🔑 Secure JWT Authentication
* 📝 Create, Update & Delete Tasks
* ✅ Mark Tasks as Completed
* 📋 View and Manage Tasks
* 🗄️ MongoDB Database Integration
* ⚙️ Backend REST APIs
* 🌐 React Frontend
* 📱 Responsive User Interface
* 🛡️ Password Hashing & Protected Routes

## Tech Stack

### Frontend

* React.js
* Vite
* JavaScript
* HTML
* CSS
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* REST APIs

### Tools

* Git & GitHub
* MongoDB Atlas
* Postman
* VS Code

## Project Structure

```text
task-management-mern/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── utils/
│   ├── validators/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── package.json
└── README.md
```

## Architecture

```text
React Frontend
       │
       │ HTTP Requests
       ▼
Express.js / Node.js API
       │
       │ Mongoose
       ▼
MongoDB Atlas
```

The React frontend communicates with the Express.js backend through REST APIs. The backend handles authentication, task operations, validation, error handling, and communication with MongoDB.

## Features

### User Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Secure password hashing using bcrypt

### Task Management

* Create new tasks
* View tasks
* Update tasks
* Delete tasks
* Mark tasks as completed
* Manage user-specific tasks

### Security

* Passwords are hashed before being stored
* JWT authentication for protected APIs
* CORS configuration
* Helmet security middleware
* Environment variables for sensitive information
* Request validation
* Centralized error handling

## Authentication Flow

```text
User
 │
 ▼
Register / Login
 │
 ▼
Express API
 │
 ├── Validate User
 │
 ├── Hash Password
 │
 └── Generate JWT
 │
 ▼
MongoDB
 │
 ▼
Authenticated User
 │
 ▼
Protected Task APIs
```

Passwords are never stored as plain text.

Example user document:

```json
{
  "name": "Sumanth",
  "email": "user@example.com",
  "password": "$2a$10$hashedPassword..."
}
```

## API

Backend:

```text
http://localhost:5000
```

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "success": true,
  "status": "ok"
}
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Protected task routes require a valid JWT token.

## Environment Variables

Create a `.env` file inside the `backend` folder.

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret
```

Never commit your `.env` file or database credentials to GitHub.

## Installation

Clone the repository:

```bash
git clone https://github.com/Sumanth8913/task-management-mern.git
```

Navigate to the project:

```bash
cd task-management-mern
```

## Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm start
```

Backend will run at:

```text
http://localhost:5000
```

## Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

## Running the Application

Start the backend:

```bash
cd backend
npm start
```

Then start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the application in your browser:

```text
http://localhost:5173
```

## Database

The application uses MongoDB Atlas for data storage.

Mongoose is used in the backend to connect the Node.js application with MongoDB.

The database stores application data such as:

* Users
* Tasks

User passwords are stored securely in hashed form using bcrypt.

## Error Handling

The backend includes centralized error handling for:

* Invalid requests
* Authentication errors
* Unauthorized access
* Missing routes
* Database errors
* Validation errors

Example health response:

```json
{
  "success": true,
  "status": "ok"
}
```

## Screenshots


Recommended screenshots:

* Login page
* Registration page
* Dashboard
* Task creation
* Task list
* Completed tasks

## Future Improvements

* 📅 Task due dates
* 🔔 Task reminders
* 🔎 Task search and filtering
* 🏷️ Task categories and priorities
* 📊 Task statistics
* 🌙 Dark mode
* 👥 Team task management
* 🐳 Docker support
* ☁️ Cloud deployment
* 📱 Improved mobile experience

## Author

**Sumanth Reddy**

B.Tech – Computer Science & Engineering


This project is created for learning and development purposes.
