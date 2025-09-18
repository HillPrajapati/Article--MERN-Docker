const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { addComment,getComments } = require('../controllers/comment');

router.post('/:id', auth, addComment);
router.get('/:id', getComments);

module.exports = router;
