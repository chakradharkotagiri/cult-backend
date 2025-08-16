const express = require('express');
const router = express.Router();
const { register, login, getCurrentUser } = require('../controllers/authController');
const upload = require('../middlewares/multer');
const  verifyToken  = require('../middlewares/auth'); // ✅ Make sure you have this

router.post('/signup', upload.single('avatar'), register);
router.post('/login', login);

// ✅ New route to get current logged-in user
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
