const express = require('express');
const router = express.Router();
const votecontroller = require('../controller/voting.controller.js');

router.put('/', votecontroller.voteMovie);

router.put('/unvote', votecontroller.unvoteMovie);
router.get('/checkVote/:movieId/:username', votecontroller.checkVote);

module.exports = router;
