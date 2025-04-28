# Task Management Application

A modern task management application built with React, TypeScript, and Node.js, featuring user authentication, drag-and-drop task organization, and real-time updates.

## Features

- User authentication (signup/login)
- Create, read, update, and delete tasks
- Drag-and-drop task organization
- Task prioritization (Low, Medium, High)
- Task status tracking (To Do/Completed)
- Responsive design with Material-UI
- Smooth animations with Framer Motion

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI for UI components
- React Beautiful DND for drag-and-drop
- Framer Motion for animations
- Axios for API requests
- React Router for navigation

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment variables

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas URI)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file in the backend directory:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd task-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Database Schema

### User Schema
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String (required),
  description: String,
  priority: String (enum: ['Low', 'Medium', 'High']),
  completed: Boolean (default: false),
  userId: ObjectId (reference to User),
  createdAt: Date,
  updatedAt: Date
}
```

## Architecture

### Frontend Architecture
- **Components**: Modular React components using TypeScript
- **State Management**: React hooks for local state, Context for auth state
- **API Integration**: Axios instances with interceptors for auth
- **Routing**: Protected and public routes using React Router
- **Styling**: Material-UI with custom theme and styled components

### Backend Architecture
- **MVC Pattern**: Models, Controllers, and Routes separation
- **Middleware**: Authentication, error handling, and request validation
- **Database**: MongoDB with Mongoose for data modeling
- **Security**: JWT tokens, password hashing, and environment variables

## Development Choices

1. **TypeScript**: Chosen for type safety and better developer experience
2. **Material-UI**: Provides consistent design and responsive components
3. **React Beautiful DND**: Smooth drag-and-drop with good accessibility
4. **Framer Motion**: High-performance animations with simple API
5. **MongoDB**: Flexible schema and good scalability for task management

## Running Locally

1. Start MongoDB service (if using local database)
2. Start the backend server:
   ```bash
   cd backend
   npm start
   ```
3. Start the frontend development server:
   ```bash
   cd task-management
   npm start
   ```
4. Access the application at `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user

### Tasks
- GET /api/tasks - Get all tasks for user
- POST /api/tasks - Create new task
- PUT /api/tasks/:id - Update task
- DELETE /api/tasks/:id - Delete task

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
