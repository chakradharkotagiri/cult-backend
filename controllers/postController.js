const Post = require('../models/Post');
const User = require('../models/User'); // ✅ Add this

const { uploadToS3 } = require('../utils/s3Uploader');

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const cultId = req.user.cultId;
    const { caption } = req.body;

    if (!req.file || !caption) {
      return res.status(400).json({ error: "Image and caption are required" });
    }

    const imageUrl = await uploadToS3(req.file, `posts/${cultId}`);

    const post = await Post.create({
      userId,
      caption,
      imageUrl,
    });

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
};

  

exports.getUserPostsByUsername = async (req, res) => {
    try {
      const username = req.params.username;
  
      const user = await User.findOne({ username });
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
      res.status(200).json({ posts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  exports.updateProfile = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request File:", req.file);
    
      const { userId } = req.params;
      const { firstName, lastName, bio } = req.body;
  
      const existingUser = await User.findById(userId);
      if (!existingUser) return res.status(404).json({ error: "User not found" });
  
      const updateData = {
        firstName: firstName ?? existingUser.firstName,
        lastName: lastName ?? existingUser.lastName,
        cultId: existingUser.cultId,
        email: existingUser.email,
        bio: bio ?? existingUser.bio, // ✅ this correctly handles empty or present bio
      };
  
      // Handle profile image upload
      if (req.file) {
        const imageUrl = await uploadToS3(req.file, `profile/${userId}`);
        updateData.avatar = imageUrl;
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
  
      res.status(200).json({ updatedUser });
    } catch (err) {
      console.error("Update error:", err.message);
      res.status(500).json({ error: "Failed to update profile." });
    }
  };
  
  
  

  exports.toggleLike = async (req, res) => {
    try {
      const userId = req.user.id;
      const post = await Post.findById(req.params.postId);
      if (!post) return res.status(404).json({ error: 'Post not found' });
  
      const index = post.likes.indexOf(userId);
      if (index === -1) {
        post.likes.push(userId); // like
      } else {
        post.likes.splice(index, 1); // unlike
      }
  
      await post.save();
      res.status(200).json({ likes: post.likes.length, liked: index === -1 });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  // Add this in postController.js
  exports.getAllPosts = async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: -1 })
  .populate('userId', 'username firstName lastName avatar')

            
      res.status(200).json({ posts });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.getUserPosts = async (req, res) => {
    try {
      const { userId } = req.params; // Extract userId from URL parameter
      
      // Find all posts where the creator/author matches the userId
      // Adjust the field name based on your Post schema
      const posts = await Post.find({ 
        userId: userId  // or createdBy: userId, or author: userId - depends on your schema
      })
      .populate('userId', 'username firstName lastName avatar') 
      .sort({ createdAt: -1 }); 
      
   
      res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({ 
        message: 'Error fetching user posts', 
        error: error.message 
      });
    }
  };
  

  
  