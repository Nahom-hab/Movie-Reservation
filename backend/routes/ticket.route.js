const express = require('express');
const { createTicket, getTicketBatch } = require('../controller/ticket.controller');
const multer = require('multer');
const upload = multer();

const router = express.Router();

// Route for creating a ticket
router.post('/BuyTicket', upload.any(), createTicket);
router.get('/getTicket/:id', getTicketBatch);


module.exports = router;
