const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    content:{type:String, required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    articleId:{type:mongoose.Schema.Types.ObjectId, ref:'Article'}
},{timestamps:true});

module.exports = mongoose.model('Comment', CommentSchema);
