const express = require('express');
const router = express.Router();
const {verifyAccessToken} = require ('../middleware')

const userController = require('../controllers/user');
const pollController = require('../controllers/pollController');

router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

router.get('/api/polls', verifyAccessToken,pollController.getAllPolls);
router.post('/api/polls',verifyAccessToken, pollController.createPoll);
router.get('/api/polls/:id',verifyAccessToken, pollController.getPollById);
router.post('/api/vote',verifyAccessToken, pollController.vote);


module.exports = router;
