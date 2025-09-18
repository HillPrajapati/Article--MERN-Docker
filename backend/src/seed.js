const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Article = require('./models/Article');
const Comment = require('./models/Comment');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();
        console.log('DB connected for seeding');

        // Clear existing data
        await User.deleteMany();
        await Article.deleteMany();
        await Comment.deleteMany();

        // Create users
        const admin = new User({name:'Admin User', email:'admin@example.com', password:await bcrypt.hash('admin123',10), role:'admin'});
        const user1 = new User({name:'Normal User', email:'user@example.com', password:await bcrypt.hash('user1234',10), role:'user'});
        await admin.save();
        await user1.save();

        // Create articles
        const article1 = new Article({title:'First Article', content:'This is the first article content', tags:['sample','first'], createdBy:admin._id});
        const article2 = new Article({title:'Second Article', content:'Second article content goes here', tags:['sample','second'], createdBy:user1._id});
        await article1.save();
        await article2.save();

        // Create comments
        const comment1 = new Comment({content:'Great article!', articleId:article1._id, createdBy:user1._id});
        const comment2 = new Comment({content:'Thanks for sharing.', articleId:article2._id, createdBy:admin._id});
        await comment1.save();
        await comment2.save();

        console.log('Seeding completed');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
