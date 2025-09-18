# Knowledge Sharing Platform with AI Summarization (Vite + MERN)

## Project Description
Full MERN stack with React (Vite) + MUI frontend, Node + Express backend, MongoDB, Docker, AI summarization using OpenAI free API.

## Features
- JWT authentication (access, refresh, reset tokens)
- Article CRUD with revision history
- Comment CRUD
- AI summarization cached in DB
- Aggregation with skip-limit pagination & filtering
- Global loading & error components
- Lazy loading for frontend
- Revised article with version

## Setup
1. Copy .env.example to .env in both backend & frontend and set Gemini key
2. Install dependencies:
   - Backend: cd backend && npm install
   - Frontend: cd frontend && npm install
3. Seed initial users: cd backend && npm run seed or node src/seed/seed.js
4. Run Docker Compose: docker-compose up --build
5. Frontend: http://localhost:3000
6. Backend API: http://localhost:5000/api

## Sample Users
- Admin: admin@example.com / password
- User: user@example.com / password
