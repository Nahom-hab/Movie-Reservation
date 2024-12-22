const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    Movie_batch: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    releaseYear: {
        type: Number,
        required: true,
    },
    genre: {
        type: [String], // Array of strings, e.g., ['Action', 'Crime']
    },
    duration: {
        type: String, // Format: '2h 32m'
    },
    youtube_url: {
        type: String,
        required: true,
    },
    rating: {
        tom: {
            type: Number,
            default: 0, // percentage rating
        },
        imdb: {
            type: Number,
            default: 0, // IMDb rating
        },
    },
    cast: [{
        name: {
            type: String,
            required: true,
        },
        img: {
            type: String,
        },
    }],
    director: {
        type: String,
        required: true,
    },
    votes: {
        type: Number,
        default: 0,
    },
    voters: [{
        type: String,
        required: false,
    }],
}, {
    timestamps: true,
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
