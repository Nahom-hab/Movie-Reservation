const { sendToTelegram } = require("../config/sendTelegramMessage");
const Ticket = require("../models/Recipt");


const sendMessage = async (req, res) => {
    const { ticket_id, username, total, totalTicket, imageUrl } = req.body;
    console.log(req.body);


    const text = `You have succsusfully purchased ${totalTicket} ticket from Fikat cinema
with total money of ${total}ETB with username @${username} and dont forget to come to the cinema on Thursday
for more information contact telegram: @nahom_hab or with phone number: 0907702898
`

    try {
        await sendToTelegram(text, imageUrl);
        const ticket = await Ticket.findById(ticket_id);
        ticket.ticketStatus = 'Approved'
        ticket.save()
        res.status(200).send({ message: 'Message sent successfully' });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    sendMessage
};
