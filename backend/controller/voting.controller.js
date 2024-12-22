const Movie = require('../models/movie.js');

// VOTE: Vote for a movie (increment the vote and rating)
const voteMovie = async (req, res) => {
    try {
        const { movie_id, Telegram_UserName } = req.body;

        // Check if input is valid
        if (!movie_id || !Telegram_UserName) {
            return res.status(400).json({ message: 'Movie ID and Telegram UserName are required.' });
        }

        // Find the movie and update the vote and rating
        const voted_movie = await Movie.findById(movie_id);

        if (!voted_movie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }

        // Check if the user has already voted
        if (voted_movie.voters.includes(Telegram_UserName)) {
            return res.status(400).json({ message: 'You have already voted for this movie.' });
        }

        // Get the movies from the same batch
        let batchMovies = await Movie.find({ Movie_batch: voted_movie.Movie_batch });

        // Increment the vote for the voted movie
        voted_movie.votes += 1;
        voted_movie.voters.push(Telegram_UserName);
        const updatedMovie = await voted_movie.save();

        // Update the batch movies if the user had voted previously
        await Promise.all(batchMovies.map(async (movie) => {
            if (movie.voters.includes(Telegram_UserName)) {
                movie.votes -= 1;
                movie.voters = movie.voters.filter(voter => voter !== Telegram_UserName);
                await movie.save();
            }
        }));

        const batchMoviesUpdated = await Movie.find({ Movie_batch: voted_movie.Movie_batch });

        res.status(200).json({
            message: 'Vote recorded successfully',
            data: batchMoviesUpdated
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error voting for the movie.' });
    }
};

// UNVOTE: Unvote for a movie (decrement the vote and reset the rating)
const unvoteMovie = async (req, res) => {
    try {
        const { movie_id, Telegram_UserName } = req.body;

        // Check if input is valid
        if (!movie_id || !Telegram_UserName) {
            return res.status(400).json({ message: 'Movie ID and Telegram UserName are required.' });
        }

        // Find the movie and update the vote and rating
        const voted_movie = await Movie.findById(movie_id);

        if (!voted_movie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }

        // Check if the user has voted
        if (!voted_movie.voters.includes(Telegram_UserName)) {
            return res.status(400).json({ message: 'You have not voted for this movie.' });
        }

        // Decrement the vote
        voted_movie.votes -= 1;
        voted_movie.voters = voted_movie.voters.filter(voter => voter !== Telegram_UserName);

        const updatedMovie = await voted_movie.save();

        res.status(200).json({
            message: 'Vote removed successfully',
            movie: updatedMovie
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error unvoting the movie.' });
    }
};


const checkVote = async (req, res) => {
    const { movieId, username } = req.params;

    try {
        const movie = await Movie.findById(movieId);

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        // Check if the user has voted
        const hasVoted = movie.voters.includes(username);

        return res.json({ voted: hasVoted });
    } catch (error) {
        console.error('Error checking vote:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};




module.exports = {
    voteMovie,
    unvoteMovie,
    checkVote
};
