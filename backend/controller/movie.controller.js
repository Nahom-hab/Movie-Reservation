const Movie = require('../models/movie.js');



const createMovie = async (req, res) => {
    try {
        const { Movie_batch, movie } = req.body;

        const newMovie = new Movie({
            Movie_batch,
            name: movie.name,
            description: movie.description,
            img: movie.img,
            releaseYear: movie.releaseYear,
            genre: movie.genre,
            duration: movie.duration,
            rating: movie.rating,
            cast: movie.cast,
            director: movie.director,
            votes: movie.votes,
        });
        const savedMovie = await newMovie.save();

        res.status(201).json({
            message: 'Movie created successfully.',
            movie: savedMovie
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating movie.' });
    }
};

// Controller to create three movies with the same Movie_batch number
const createMovieBatch = async (req, res) => {
    try {
        // const movies = req.body.movies
        // const Movie_batch = req.body.Movie_batch
        const Movie_batch = 4
        const movies = [
            {
                "name": "Violent Nights",
                "description": "A team of mercenaries breaks into a wealthy family's estate on Christmas Eve, and Santa Claus must step in to save the day and the holiday.",
                "img": "https://i.pinimg.com/736x/66/53/f1/6653f151cdd47cdb99be19025930805c.jpg",
                "releaseYear": 2022,
                "genre": ["Action", "Comedy", "Thriller"],
                "duration": "1h 52m",
                "youtube_url": "https://www.youtube.com/embed/a53e4HHnx_s?si=OEfN-oBOBuQ2YfSA",
                "rating": {
                    "tom": 72,
                    "imdb": 6.8
                },
                "director": "Tommy Wirkola",
                "votes": 10,
                "voters": []
            },
            {
                "name": "Red One",
                "description": "An upcoming holiday action-comedy that brings together a team of operatives on a mission to save Christmas from a mysterious threat.",
                "img": "https://i.pinimg.com/736x/70/7b/c5/707bc5dd7e2ada21e78a154243c95275.jpg",
                "releaseYear": 2024,
                "genre": ["Action", "Comedy", "Adventure"],
                "duration": "1h 55m",
                "youtube_url": "https://www.youtube.com/embed/7l3hfD74X-4?si=dWmKfxZs2BtggRbn",
                "rating": {
                    "tom": 85,
                    "imdb": 7.8
                },
                "director": "Jake Kasdan",
                "votes": 10,
                "voters": []
            },
            {
                "name": "The Christmas Chronicles",
                "description": "Siblings Kate and Teddy team up with Santa Claus to save Christmas after accidentally crashing his sleigh.",
                "img": "https://i.pinimg.com/736x/84/f1/b1/84f1b107e5cfdd6011f4c4661d9b7ede.jpg",
                "releaseYear": 2018,
                "genre": ["Adventure", "Comedy", "Family"],
                "duration": "1h 44m",
                "youtube_url": "https://www.youtube.com/embed/YaeDa_Uempk?si=IhVp1xgbKUC2Lr8j",
                "rating": {
                    "tom": 67,
                    "imdb": 7.0
                },
                "director": "Clay Kaytis",
                "votes": 10,
                "voters": []
            }
        ];




        // Ensure we are receiving exactly three movies
        if (movies.length !== 3) {
            return res.status(400).json({ message: 'You must provide exactly three movies.' });
        }

        // Create an array to store the saved movie documents
        const moviePromises = movies.map((movie) => {
            const newMovie = new Movie({
                Movie_batch,
                name: movie.name,
                description: movie.description,
                img: movie.img,
                releaseYear: movie.releaseYear,
                genre: movie.genre,
                duration: movie.duration,
                youtube_url: movie.youtube_url,
                rating: movie.rating,
                cast: movie.cast,
                director: movie.director,
                votes: movie.votes,
            });
            return newMovie.save();
        });

        // Wait for all movies to be saved
        const savedMovies = await Promise.all(moviePromises);

        res.status(201).json({
            message: 'Three movies created successfully with the same Movie batch.',
            movies: savedMovies
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating movies batch.' });
    }
};


// READ - Get all movies
const getMoviesBatch = async (req, res) => {

    try {
        const movies = await Movie.find({ Movie_batch: req.params.id });
        res.status(200).json(movies);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching movies' });
    }
};

const getMovieVoteWinner = async (req, res) => {
    try {
        const movies = await Movie.find({ Movie_batch: req.params.Movie_batch });
        let winner = movies[0]
        movies.forEach(movie => {
            if (winner.votes < movie.votes) {
                winner = movie
            }
        });
        res.status(200).json(winner);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching movies' });
    }
};

// READ - Get a single movie by ID
const getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching movie' });
    }
};

// UPDATE - Update a movie by ID
const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json(movie);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating movie' });
    }
};

// DELETE - Delete a movie by ID
const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.status(200).json({ message: 'Movie deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting movie' });
    }
};

module.exports = {
    getMovieVoteWinner,
    createMovie,
    createMovieBatch,
    getMoviesBatch,
    getMovieById,
    updateMovie,
    deleteMovie
};
