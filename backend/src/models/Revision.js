const mongoose = require('mongoose');

const RevisionSchema = new mongoose.Schema({
    articleId:{type:mongoose.Schema.Types.ObjectId, ref:'Article'},
    title:String,
    content:String,
    tags:[String],
    createdAt:{type:Date, default:Date.now}
});

module.exports = mongoose.model('Revision', RevisionSchema);
