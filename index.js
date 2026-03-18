require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('./models/Movie');

// Middleware to parse JSON
const app = express();
app.use(express.json());

// Connectiion to MongoDB
mongoose.connect('mongodb://localhost:27017/movieTracker')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/movies', async (req, res) =>{
    res.status(200).json({ message: 'Welcome to the Movie Tracker API!' });
})