const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/article');
const commentRoutes = require('./routes/comment');
const userRoutes =  require('./routes/user');
const errorHandler = require('./middlewares/errorHandler');

connectDB();
const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // your React app URL
    credentials: true, // allow cookies
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`));
