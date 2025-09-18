const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createArticle,getArticles,getArticleById,updateArticle,deleteArticle,summarizeArticle, getRevisions } = require('../controllers/article');

router.post('/', auth, createArticle);
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.put('/:id', auth, updateArticle);
router.delete('/:id', auth, deleteArticle);
router.post('/:id/summary', auth, summarizeArticle);
router.get('/:id/revisions', auth, getRevisions);

module.exports = router;
