const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

module.exports = async (req,res,next)=>{
    let token = req.headers.authorization;
    if(token && token.startsWith('Bearer ')){
        token = token.split(' ')[1];
        try{
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }catch(e){
            return res.status(401).json({success:false,message:'Unauthorized'});
        }
    }else{
        return res.status(401).json({success:false,message:'No token'});
    }
}
