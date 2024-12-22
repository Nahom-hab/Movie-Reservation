const uploadImageToCloudinary = require('../config/cloudinary.js');
const Ticket = require('../models/Recipt.js');

const createTicket = async (req, res) => {
    try {
        const {
            phone,
            selectedBank,
            movie_batch,
            TelegramUsername,
            selectedService,
            total,
            totalTicket,
            chatID
        } = req.body;

        const receipt = req.files[0]

        const imageUrl = await uploadImageToCloudinary(receipt)
        console.log(imageUrl);


        const newTicket = new Ticket({
            phone,
            selectedBank: selectedBank,
            receiptImage: imageUrl,
            movieBatch: movie_batch,
            TelegramUsername,
            selectedService,
            total,
            totalTicket,
            chatID
        });


        await newTicket.save();
        sendToTelegram(`New Ticket Have Been Puchased for Total money:${total}ETB with username:${TelegramUsername}`)
        res.status(201).json({ message: 'Ticket created successfully.', ticket: newTicket });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong.' });
    }
};

const getTicketBatch = async (req, res) => {
    try {
        // Fetch tickets based on the movie batch ID
        const tickets = await Ticket.find({ movieBatch: req.params.id });
        res.status(200).json(tickets); // Send the actual ticket data
        console.log(tickets);

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
};

module.exports = {
    createTicket,
    getTicketBatch
};
