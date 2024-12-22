const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
    },
    selectedBank: {
        type: String,
        required: true,
    },
    receiptImage: {
        type: String, // Cloudinary URL for the uploaded receipt
        required: true,
    },
    movieBatch: {
        type: String,
        required: true,
    },
    TelegramUsername: {
        type: String,
        default: '',
    },
    selectedService: {
        type: Array,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    totalTicket: {
        type: Number,
        required: true,
    },
    ticketStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected'],
    },
    chatID: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;


