# Task Management System

A full-stack task management application built with Spring Boot, React, and MySQL.

## Features

- User Authentication & Authorization (JWT)
- Role-based access control (Admin/User)
- Task CRUD operations with filtering, sorting, pagination
- Category management
- Dashboard with statistics
- Responsive Material UI design
- RESTful API with OpenAPI documentation

## Tech Stack

**Backend:**
- Spring Boot 3.2+
- Spring Security 6 (JWT)
- Spring Data JPA
- MySQL 8.0
- Maven

**Frontend:**
- React 18
- TypeScript
- Material-UI (MUI)
- Vite
- Axios

## Quick Start

### Using Docker Compose (Recommended)

```bash
docker-compose up -d
```

This will start:
- MySQL on port 3306
- Backend on port 8080
- Frontend on port 5173

### Manual Setup

1. **Database Setup**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE taskmanager;
   ```

2. **Backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## API Documentation

Once the backend is running, visit: http://localhost:8080/swagger-ui.html

## Postman Testing

Import the included Postman collection:
- `Task_Management_API.postman_collection.json`
- `Task_Management.postman_environment.json`

## Default Credentials

Admin user will be created automatically:
- Username: admin
- Password: admin123

## Project Structure

- `backend/` - Spring Boot REST API
- `frontend/` - React TypeScript UI  
- `docker-compose.yml` - Container orchestration
- Postman collections for API testing