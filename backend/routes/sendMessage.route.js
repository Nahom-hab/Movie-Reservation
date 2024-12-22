
const express = require('express');
const multer = require('multer');
const { sendMessage } = require('../controller/SendMessage');
const upload = multer();

const router = express.Router();

// Route for creating a ticket
router.post('/sendMessage', sendMessage);

module.exports = router;
