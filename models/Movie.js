const { Schema, model } = require('mongoose');

const movieSchema = new Schema({
    imdbID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    year: { type: Number },
    genre: { type: String },
    rated: { type: String },
    director: { type: String },
    actors: { type: String },
    language: { type: String },
    imdbRating: { type: String },
    runtime: { type: String }
});

module.exports = model('Movie', movieSchema, 'movies');
