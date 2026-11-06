const mongoose = require('mongoose');
const User = require('../models/User');

// Matches the input literally. NUL needs its own escape: MongoDB rejects a raw
// NUL in a pattern.
const escapeRegex = (text) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\0/g, "\\x00");

exports.getSearchUsersSuggestions = async (req, res) => {
    try {
      const searchQuery = req.query.query;
      // A repeated param (?query=a&query=b) arrives as an array.
      if (!searchQuery || typeof searchQuery !== "string") return res.json([]);
  
      const matchingUsers = await User.find({
        username: { $regex: escapeRegex(searchQuery), $options: "i" },
      })
        .limit(10)
        .select("username avatar");
  
      const suggestions = matchingUsers.map((user) => ({
        _id: user._id,
        username: user.username,
        avatar: user.avatar ?? null,
      }));
  
      res.json(suggestions);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  };
  

exports.getAllOtherUsers = async(req,res) => {
    try{
        const currentUserId = req.user.id;
        const users = await User.find ({_id: {$ne:currentUserId}}).select('username avatar');

        res.status(200).json(users);

    }catch(error){
        res.status(500).json({ message: "Can't find all other users", error: error.message });

    }

}

exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!mongoose.isValidObjectId(userId)) {
            return res.status(404).json({ message: "User not found" });
        }

        // Public fields only: this is readable by any logged-in user.
        const user = await User.findById(userId)
            .select('username firstName lastName avatar bio followers following');
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Can't fetch user", error: error.message });
    }
};
