const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    movie_batch: {
        type: Number,
        required: true,
    },
    buyingTicket: {
        type: Boolean,
        required: true,
    },
    Movie_Day: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const Setting = mongoose.model('Setting', SettingSchema);

module.exports = Setting;
