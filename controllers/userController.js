const User = require('../models/User');


exports.getSearchUsersSuggestions = async (req,res) => {

    try {
        const searchQuery = req.query.query;

        if( !searchQuery ) return res.json([]);


        const matchingUsers = await User.find({
            username : {$regex : '.*' + searchQuery , $options: 'i'} ,
        })
        .limit(10).select('username -_id');

        const suggestions = matchingUsers.map(user => user.username);

        res.json(suggestions);
    }catch (err){
        console.log(err);
        res.status(500).json({error:"Server error"})
    }
};

exports.getAllOtherUsers = async(req,res) => {
    console.log('Current User ID:', req.user?.id, typeof req.user?.id);

    try{
        const currentUserId = req.user.id;
        const users = await User.find ({_id: {$ne:currentUserId}}).select('username avatar').limit(5);

        res.status(200).json(users);

    }catch(error){
        res.status(500).json({ message: "Can't find all other users", error: error.message });

    }

}

