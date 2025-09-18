// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { getProfile, updateProfile, deleteProfile } = require('../controllers/user');

router.get('/me', auth, getProfile);
router.put('/me', auth, updateProfile);
router.delete('/me', auth, deleteProfile);

module.exports = router;
