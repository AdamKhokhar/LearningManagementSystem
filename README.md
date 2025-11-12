# LMS

Simple Learning Management System

## Quick Start

### Backend (Terminal 1)
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

### Access
- Website: http://localhost:3000
- Admin Panel: http://localhost:8000/admin

## First Time Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py create_users
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Default Users

All accounts use password: **password**

- **admin** / password (admin panel access)
- **teacher** / password (frontend only)
- **student1** / password (frontend only)
- **student2** / password (frontend only)

## How to Use

1. Start both servers (backend and frontend)
2. Open http://localhost:3000
3. Select your role (Student or Instructor) from the dropdown
4. **Student**: View available courses, join courses, read public chapters
5. **Instructor**: Create courses, create/edit chapters with rich text editor, set chapter visibility (public/private)
6. **Admin**: Go to http://localhost:8000/admin (login: admin / password) to manage courses and chapters

## Features

### Instructor Capabilities
- Create and manage courses
- Create chapters within a course
- Use rich text editor (React Quill) for creating and editing chapter content
- Set chapter visibility (public or private)

### Student Capabilities
- View list of available courses
- Join courses created by instructors
- Access and read chapters marked as public by instructors
