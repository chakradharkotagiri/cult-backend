const User = require('../models/User');
const Counter = require('../models/Counter');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { uploadToS3 } = require('../utils/s3Uploader');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;
    const file = req.file;

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ error: 'Username is already taken' });

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ error: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    let counter = await Counter.findOneAndUpdate(
      { name: 'cultId' },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    const cultId = counter.value;

    let avatarUrl = null;
    if (req.file) {
      avatarUrl = await uploadToS3(req.file, `profile/${cultId}`);
    }
    console.log('req.file:', req.file);
console.log('req.body:', req.body);


    const newUser = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashed,
      cultId,
      avatar: avatarUrl,
      followers: 0,
      following: 0
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        cultId: newUser.cultId,
        username: newUser.username,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        avatar: newUser.avatar
      }
    });
    console.log('Signup request hit');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login existing user
exports.login = async (req, res) => {
  console.log("Login endpoint hit");
  console.log("Request body received:", req.body);

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.log("Missing username or password");
      return res.status(400).json({ error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User not found for username: ${username}`);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`Password mismatch for user: ${username}`);
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, cultId: user.cultId }, process.env.JWT_SECRET, { expiresIn: "1d" });

    console.log(`Login successful for user: ${username}`);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        followers: user.followers,
        following: user.following,
        avatar: user.avatar,
        bio: user.bio,
        cultId: user.cultId,
      },
    });
  } catch (error) {
    console.error("Error in login handler:", error);
    return res.status(500).json({ error: error.message });
  }
};

// ✅ GET /api/auth/me – get user from token
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
