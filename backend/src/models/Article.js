const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title:{type:String, required:true, index:true},
    content:{type:String, required:true},
    tags:[{type:String, index:true}],
    createdBy:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    revisions:[{ type: mongoose.Schema.Types.ObjectId, ref:'Revision' }],
    summary:{type:String}
},{timestamps:true});

module.exports = mongoose.model('Article', ArticleSchema);
