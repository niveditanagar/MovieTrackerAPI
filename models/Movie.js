const mongoose = require('mongoose');

const movieSchema = new mongooose.movieSchema({
    title: { type: String, required: true },
    year: { type: String },
    genre: { type: String },
    director: { type: String }
});

module.exports = mongoose.model('Movie', movieSchema, 'movies');