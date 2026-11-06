const express = require('express');
const router = express.Router();
const { createPost, getUserPostsByUsername,updateProfile,getUserPosts } = require('../controllers/postController');
const postController = require('../controllers/postController');
const auth = require('../middlewares/auth');
const multer = require('multer');

const { getAllPosts } = require('../controllers/postController');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  auth,
  (req, res, next) => {
    console.log("🧠 req.user in middleware:", req.user);

    req.cultId = req.user.cultId;
    next();
  },
  upload.single('image'),
  createPost 
);





router.put(
  '/update-profile/:userId',
  auth,
  // Runs before multer so a rejected request never buffers its upload.
  (req, res, next) => {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ error: "You can only update your own profile." });
    }
    next();
  },
  upload.single("profileImage"),
  updateProfile
);

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
  




module.exports = router;
