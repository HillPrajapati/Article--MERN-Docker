// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { success, error } = require('../utils/response');
// require('dotenv').config();

// const generateToken = (id, secret, expires='15m')=>{
//     return jwt.sign({id}, secret, {expiresIn:expires});
// }

// exports.signup = async (req,res)=>{
//     try{
//         const {name,email,password} = req.body;
//         const exists = await User.findOne({email});
//         if(exists) return error(res,'User already exists',400);

//         const hashed = await bcrypt.hash(password,10);
//         const user = await User.create({name,email,password:hashed});
//         const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET);
//         const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET,'7d');
//         return success(res,{user,accessToken,refreshToken},'Signup successful');
//     }catch(e){ return error(res,e.message); }
// }

// exports.login = async (req,res)=>{
//     try{
//         const {email,password} = req.body;
//         const user = await User.findOne({email});
//         if(!user) return error(res,'Invalid credentials',400);
//         const match = await user.matchPassword(password);
//         if(!match) return error(res,'Invalid credentials',400);
//         const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET);
//         const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET,'7d');
//         return success(res,{user,accessToken,refreshToken},'Login successful');
//     }catch(e){ return error(res,e.message); }
// }

// backend/src/controllers/auth.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/response');
require('dotenv').config();

const generateToken = (id, secret, expires='15m') => jwt.sign({ id }, secret, { expiresIn: expires });

exports.signup = async (req,res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return error(res, 'Missing fields', 400);
    const exists = await User.findOne({ email });
    if (exists) return error(res, 'User already exists', 400);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET, '15m');
    const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET, '7d');

    user.refreshToken = refreshToken;
    await user.save();

    return success(res, { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken }, 'Signup successful');
  } catch (e) { return error(res, e.message); }
};

exports.login = async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Missing fields', 400);
    const user = await User.findOne({ email });
    if (!user) return error(res, 'Invalid credentials', 400);
    const match = await user.matchPassword(password);
    if (!match) return error(res, 'Invalid credentials', 400);

    const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET, '15m');
    const refreshToken = generateToken(user._id, process.env.JWT_REFRESH_SECRET, '7d');

    user.refreshToken = refreshToken;
    await user.save();

    return success(res, { user: { _id: user._id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken }, 'Login successful');
  } catch (e) { return error(res, e.message); }
};

// Refresh endpoint: client sends refreshToken (we also compare with DB saved)
exports.refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return error(res, 'No refresh token provided', 401);
    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); }
    catch (err) { return error(res, 'Invalid refresh token', 403); }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return error(res, 'Refresh token mismatch', 403);

    const accessToken = generateToken(user._id, process.env.JWT_ACCESS_SECRET, '15m');
    return success(res, { accessToken }, 'Access token refreshed');
  } catch (e) { return error(res, e.message); }
};

exports.logout = async (req, res) => {
  try {
    // Expect authenticated user (via auth middleware) or accept refresh token body
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      const user = await User.findById(decoded.id);
      if (user) { user.refreshToken = null; await user.save(); }
      return success(res, null, 'Logged out');
    }
    // fallback: accept refresh token in body
    const { token } = req.body;
    if (token) {
      let decoded;
      try { decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET); } catch(e){ }
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user && user.refreshToken === token) {
          user.refreshToken = null; await user.save();
        }
      }
      return success(res, null, 'Logged out');
    }
    return error(res, 'No token provided', 400);
  } catch (e) { return error(res, e.message); }
};
