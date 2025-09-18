const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Revision = require('../models/Revision');
const { success, error } = require('../utils/response');
const pagination = require('../utils/pagination');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


exports.summarizeArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return error(res, 'Article not found', 404);

    // Return cached summary if available
    if (article.summary) return success(res, article.summary, 'Cached summary');

    let summary = '';

    if (process.env.AI_PROVIDER === 'openai') {
      // OpenAI GPT summary
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'user', content: `Summarize this article in a few sentences:\n\n${article.content}` }
        ]
      });
      summary = response.choices[0].message.content;

    } else if (process.env.AI_PROVIDER === 'gemini') {
      // Gemini AI (Google Generative) summary
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
      const geminiRes = await axios.post(endpoint, {
        contents: [
          {
            parts: [{ text: `Summarize this article in a few sentences:\n\n${article.content}` }]
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GEMINI_API_KEY
        }
      });
      summary = geminiRes.data?.candidates?.[0]?.content?.parts?.map(c => c.text).join(' ') || 'No summary generated';

    } else {
      return error(res, 'No AI provider configured', 500);
    }

    // Save summary in DB
    article.summary = summary;
    await article.save();

    return success(res, summary, 'AI summary generated');

  } catch (e) {
    console.error(e.response?.data || e.message);
    return error(res, e.message || 'Error generating summary');
  }
};


exports.createArticle = async (req,res)=>{
    try{
        const {title,content,tags} = req.body;
        const article = await Article.create({title,content,tags,createdBy:req.user._id});
        return success(res, article,'Article created');
    }catch(e){ return error(res,e.message); }
}

exports.getArticles = async (req, res) => {
  try {
    const { skip, limit } = pagination(req);

    const match = {};

    //  Case-insensitive global search
    if (req.query.q) {
      const searchRegex = new RegExp(req.query.q, "i");                      
      match.$or = [
        { title: searchRegex },
        // { content: searchRegex },
        { tags: searchRegex },
        // { summary: searchRegex }
      ];
    }

    //  Filter by tag
    if (req.query.tag) {
      match.tags = { $regex: new RegExp(req.query.tag, "i") };
    }

    //  Filter by creator
    if (req.query.createdBy) {
      match.createdBy = new mongoose.Types.ObjectId(req.query.createdBy);
    }

    const pipeline = [
      { $match: Object.keys(match).length ? match : {} },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
        }
      },
      {
        $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true }
      },

      {
        $facet: {
          items: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
          ],
          total: [
            { $count: "count" }
          ]
        }
      }
    ];

    const result = await Article.aggregate(pipeline);
    const items = result[0]?.items || [];
    const total = result[0]?.total[0]?.count || 0;

    return success(res, { items, total }, "Articles fetched");
  } catch (e) {
    return error(res, e.message);
  }
};

// Get article revision history
exports.getRevisions = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return error(res, 'Article not found', 404);

        // Only author or admin can view
        if (article.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin')
            return error(res, 'Forbidden', 403);

        const revisions = await Revision.find({ articleId: article._id }).sort({ createdAt: -1 });
        return success(res, revisions, 'Article revision history fetched');
    } catch (e) {
        return error(res, e.message);
    }
};


exports.getArticleById = async (req,res)=>{
    try{
        const article = await Article.findById(req.params.id).populate('createdBy','name').populate({path:'revisions'});
        if(!article) return error(res,'Not found',404);
        const comments = await Comment.find({articleId:req.params.id}).populate('createdBy','name');
        return success(res,{article,comments},'Article detail fetched');
    }catch(e){ return error(res,e.message); }
}

exports.updateArticle = async (req,res)=>{
    try{
        const {title,content,tags} = req.body;
        const article = await Article.findById(req.params.id);
        if(!article) return error(res,'Not found',404);
        if(article.createdBy.toString()!==req.user._id.toString() && req.user.role!=='admin')
            return error(res,'Forbidden',403);

        // Save revision
        const rev = await Revision.create({articleId:article._id,title:article.title,content:article.content,tags:article.tags});
        article.revisions.push(rev._id);
        article.title = title;
        article.content = content;
        article.tags = tags;
        await article.save();
        return success(res, article,'Article updated');
    }catch(e){ return error(res,e.message); }
}

exports.deleteArticle = async (req,res)=>{
    try{
        const article = await Article.findById(req.params.id);
        if(!article) return error(res,'Not found',404);
        if(article.createdBy.toString()!==req.user._id.toString() && req.user.role!=='admin')
            return error(res,'Forbidden',403);
        await article.remove();
        return success(res,null,'Article deleted');
    }catch(e){ return error(res,e.message); }
}




