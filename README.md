# Knowledge Sharing Platform with AI Summarization (Vite + MERN)

## Project Description
Full MERN stack with React (Vite) + MUI frontend, Node + Express backend, MongoDB, Docker, AI summarization using OpenAI free API.

##.env.example for backend
PORT=5000
MONGO_URI=mongodb://mongo:27017/knowledge # for docker 
# MONGO_URI=mongodb://localhost:27017/knowledge # for local  
JWT_ACCESS_SECRET=accesssecret
JWT_REFRESH_SECRET=refreshsecret
RESET_PASSWORD_SECRET=resetsecret
OPENAI_API_KEY=YOUR_OPENAI_FREE_KEY
AI_PROVIDER=gemini
GEMINI_API_KEY=

##.env.example for fronetend
VITE_API_URL=http://localhost:5000/api

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



