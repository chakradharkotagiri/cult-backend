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