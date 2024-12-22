const express = require('express');
const router = express.Router();
const movieController = require('../controller/movie.controller.js');

// CREATE - Add a new movie
router.post('/', movieController.createMovie);
router.post('/batch', movieController.createMovieBatch);

// READ - Get all moviess
router.get('/batch/:id', movieController.getMoviesBatch);

// READ - Get a single movie by ID
router.get('/:id', movieController.getMovieById);
router.get('/getWinner/:Movie_batch', movieController.getMovieVoteWinner);


// UPDATE - Update a movie by ID
router.put('/:id', movieController.updateMovie);

// DELETE - Delete a movie by ID
router.delete('/:id', movieController.deleteMovie);

module.exports = router;
