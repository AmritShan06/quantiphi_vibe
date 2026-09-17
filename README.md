# Quantiphi - Task Management App (Microservices Architecture)

A full-stack Kanban Task Management Application built with a **Microservice Backend (MVC Pattern)** and a **React Frontend**, featuring a server-side **"Vibe Check" Workload Balancing Engine**.

---

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Folder Structure](#folder-structure)
- [Local Setup Guide (No Docker Required)](#local-setup-guide-no-docker-required)
- [API Endpoints](#api-endpoints)

---

## 🚀 Project Overview

The mission is to build a streamlined, responsive Kanban task management application designed for productivity:
- **Kanban Board**: 3 status columns (`To-Do`, `In Progress`, `Done`) with drag-and-drop capability.
- **Task Cards**: Priority badges (`High`, `Medium`, `Low`), due dates, assignee details, and task descriptions.
- **Workload Balancing ("Vibe Check")**: Column counters display task counts. The backend server automatically computes workload balance per user; if any team member has **more than 5 tasks in "In Progress"**, their avatar in the team list pulses red to warn of potential burnout.
- **Stable UI**: Clean, neutral color scheme designed for maximum readability and zero visual clutter.

---

## ⚙️ Architecture & Tech Stack

### Microservice Backend (MVC Format)
The backend is split into decoupled microservices using Node.js & Express:
1. **API Gateway (`Port 5000`)**: Single entry point that routes client requests to corresponding microservices.
2. **User Service (`Port 5001`)**: Manages User profiles and permissions (MVC).
3. **Project Service (`Port 5002`)**: Manages Projects and User-Project associations (MVC).
4. **Task Service (`Port 5003`)**: Manages Task CRUD operations, column movements, and executes the server-side Workload Balancing Engine (MVC).

### Database Layer
- **PostgreSQL** with automatic embedded **SQLite fallback mode**. No manual database server setup required to run locally out-of-the-box!

### Frontend UI
- **React + Vite + Tailwind CSS**: Responsive SPA with drag-and-drop support, column counters, and avatar burnout animations.

---

## 📁 Folder Structure

```
quantiphi/
├── README.md                         # Detailed project documentation and setup guide
├── package.json                      # Root scripts to start full stack
├── .env.example                      # Environment variables template
│
├── backend/                          # Backend Microservices Layer
│   ├── package.json                  # Backend launcher scripts
│   ├── api-gateway/                  # API Gateway Router (Port 5000)
│   │   ├── package.json
│   │   └── src/index.js
│   │
│   └── services/
│       ├── user-service/             # User Microservice (Port 5001) - MVC
│       │   ├── package.json
│       │   └── src/
│       │       ├── config/db.js      # Resilient PG / SQLite fallback driver
│       │       ├── models/userModel.js
│       │       ├── controllers/userController.js
│       │       ├── routes/userRoutes.js
│       │       └── app.js
│       │
│       ├── project-service/          # Project Microservice (Port 5002) - MVC
│       │   ├── package.json
│       │   └── src/
│       │       ├── config/db.js
│       │       ├── models/projectModel.js
│       │       ├── controllers/projectController.js
│       │       ├── routes/projectRoutes.js
│       │       └── app.js
│       │
│       └── task-service/             # Task Microservice (Port 5003) - MVC & Engine
│           ├── package.json
│           └── src/
│               ├── config/db.js
│               ├── models/taskModel.js
│               ├── services/workloadService.js # Workload Engine (>5 task burnout)
│               ├── controllers/taskController.js
│               ├── routes/taskRoutes.js
│               └── app.js
│
└── frontend/                         # React Frontend SPA (Port 3000)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── components/               # Navbar, TeamList, KanbanBoard, TaskCard, Modals
        ├── services/api.js           # API Client
        ├── App.jsx
        └── index.css                 # Styling & Red pulse avatar keyframes
```

---

## 💻 Local Setup Guide (No Docker Required)

### Prerequisites
- **Node.js**: v18 or higher installed on your system.

### Step 1: Navigate to Project Directory
```bash
cd C:\Users\amrit\OneDrive\Desktop\quantiphi
```

### Step 2: Install All Dependencies
Run the command below from the root directory to automatically install dependencies for the root, backend microservices, and frontend:
```bash
npm run install:all
```

*(Alternatively, you can install individually:)*
```bash
cd backend/api-gateway && npm install
cd ../services/user-service && npm install
cd ../project-service && npm install
cd ../task-service && npm install
cd ../../../frontend && npm install
```

### Step 3: Run the Application Locally

#### Option A: Run Full Stack (Backend + Frontend) together
From the root `quantiphi/` directory:
```bash
npm start
```

#### Option B: Run Backend and Frontend separately

1. **Start Backend Microservices**:
```bash
cd backend
npm start
```
*This launches API Gateway (`5000`), User Service (`5001`), Project Service (`5002`), and Task Service (`5003`).*

2. **Start Frontend App**:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🔌 API Endpoints Summary

All frontend requests pass through the **API Gateway** on `http://localhost:5000/api`:

### User Service (`/api/users`)
- `GET /api/users` - List all team members
- `POST /api/users` - Create a new team member

### Project Service (`/api/projects`)
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a new project
- `POST /api/projects/:id/members` - Add a user to a project

### Task Service (`/api/tasks`)
- `GET /api/tasks?projectId=:id&priority=:priority` - List project tasks
- `POST /api/tasks` - Create a task
- `PUT /api/tasks/:id` - Update task details
- `PATCH /api/tasks/:id/status` - Move task between columns (`To-Do`, `In Progress`, `Done`)
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/workload?projectId=:id` - Server-side column counts & burnout evaluation
