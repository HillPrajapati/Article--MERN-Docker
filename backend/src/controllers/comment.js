const Comment = require('../models/Comment');
const { success, error } = require('../utils/response');

exports.addComment = async (req,res)=>{
    try{
        const {content} = req.body;
        const articleId = req.params.id;
        const comment = await Comment.create({content,articleId,createdBy:req.user._id});
        return success(res,comment,'Comment added');
    }catch(e){ return error(res,e.message); }
}

exports.getComments = async (req,res)=>{
    try{
        const articleId = req.params.id;
        const comments = await Comment.find({articleId})
        .populate('createdBy','name')
        .sort({ _id: -1 })
        return success(res,comments,'Comments fetched');
    }catch(e){ return error(res,e.message); }
}
