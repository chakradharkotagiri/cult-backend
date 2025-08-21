const express = require('express');
const router = express.Router();
const { createPost, getUserPostsByUsername,updateProfile,getUserPosts } = require('../controllers/postController');
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');
const multer = require('multer');
// Add this line near the top
const { getAllPosts } = require('../controllers/postController');

const upload = multer({ storage: multer.memoryStorage() });
const uploadS3 = require('../middlewares/uploadS3');

router.post(
  '/',
  auth,
  (req, res, next) => {
    console.log("🧠 req.user in middleware:", req.user);

    req.cultId = req.user.cultId;
    next();
  },
  uploadS3('posts').single('image'),
  createPost // now handled in the controller
);




// Create a new post

router.put('/update-profile/:userId', upload.single("profileImage"), updateProfile);
// routes/postRoutes.js
router.put('/like/:postId', auth, postController.toggleLike);


router.get('/username/:username', getUserPostsByUsername);
router.get('/user/:userId', getUserPosts);

router.get('/:postId', async (req, res) => {
    try {
      const post = await require('../models/Post').findById(req.params.postId);
      if (!post) return res.status(404).json({ error: "Post not found" });
  
      res.status(200).json({ post });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.get('/', getAllPosts);
  

// Get posts for a specific user


module.exports = router;
