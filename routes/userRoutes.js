const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const userController = require('../controllers/userController')

router.get('/search',userController.getSearchUsersSuggestions);

router.get('/users' ,auth ,userController.getAllOtherUsers);

module.exports = router;