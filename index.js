require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const Movie = require('./models/Movie');
const crypto = require('crypto');
const { watch } = require('fs');

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
    const movies = await Movie.find();
    res.status(200).json(movies);
    //res.status(200).json({ message: 'Welcome to the Movie Tracker API!' });
});

// app.post('/movies', async (req, res) => {
//     console.log('Received request to add movie:', req.body);
//     try {
//         const { imdbID, title, year, genre, rated, director, actors, language, imdbRating, runtime } = req.body;

//         // Check if the movie already exists in the database
//         const doesMovieExist = await Movie.findOne({ imdbID });
//         if (doesMovieExist) {
//             return res.status(400).json('Movie already exists in the database.');
//         }

//         // Adding movie to the database
//         const newMovie = new Movie({
//             imdbID: imdbID,
//             title: title,
//             year: year,
//             genre: genre,
//             rated: rated,
//             director: director,
//             actors: actors,
//             language: language,
//             imdbRating: imdbRating,
//             runtime: runtime
//         })

//         console.log('Added movie to the database:', newMovie);

//         await newMovie.save();
//         res.status(201).json({ message: 'Movie added successfully!' });

//     } catch (error) {
//         console.error('Error adding movie:', error);
//         res.status(500).json({ message: 'An error occurred while adding the movie.' });
//     }
// });

app.delete('/movies/:imdbID', async (req, res) => {
    
    try {
        const { imdbID } = req.params;
        const deleteMovie = await Movie.findOneAndDelete({ imdbID: imdbID });
        if (!deleteMovie) {
            return res.status(404).json({ message: 'Movie not found.' });
        }
        res.status(200).json({ message: 'Movie deleted successfully!' });

    } catch (error) {
        console.error('Error deleting movie:', error);
    }
});

app.get('/movies/search', async (req, res) => {
    const title = req.query.title;

    if (!title) {
        return res.status(400).json({ message: 'Title is required' });
    }

    try {
        const response = await axios.get('https://www.omdbapi.com', {
            params: {
                s: title,
                apiKey: process.env.OMDB_API_KEY
            }
        });

        res.status(200).json(response.data.Search);
    } catch (error) {
        console.error('Error when searching for a movie: ', error);
        res.status(400).json({ message: `An error occured while searching: ${error}`});
    }
});

app.post('/movies/watchlist', async (req, res) => {
    const imdbID = req.body.imdbID;
    console.log("imdbID: ", imdbID);

   try {
        const response = await axios.get('https://www.omdbapi.com/', {
            params: {
                i: imdbID,
                apiKey: process.env.OMDB_API_KEY
            }
        })
        
        // Getting the information of the movie from the response
        const { Title, Year, Genre, Rated, Director, Actors, Language, imdbRating, Runtime } = response.data;

        console.log('Movie details fetched from OMDB API:', { imdbID, Title, Year, Genre, Rated, Director, Actors, Language, imdbRating, Runtime, watched: false });

        // Adding movie to the database
        const newMovie = new Movie({
            imdbID: imdbID,
            title: Title,
            year: Year,
            genre: Genre,
            rated: Rated,
            director: Director,
            actors: Actors,
            language: Language, 
            imdbRating: imdbRating,
            runtime: Runtime,
            watched: false
        })

        await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully' });
   } catch (error) {
        console.error('Error when fetching movie details: ', error);
        res.status(400).json({ message: 'Error occured while fetching movie details.' });
   }
});

app.patch('/movies/watched/:imdbID', async (req, res) => {
    try {
        const { imdbID } = req.params;

        // find the movie and update it:
        const updatedMovie = await Movie.findOneAndUpdate(
            { imdbID: imdbID },
            { watched: true },
            { new: true }
        );

        console.log('Updated movie: ', updatedMovie);

        // if movie isn't found:
        if (!updatedMovie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.status(200).json({ updatedMovie });

    } catch (error) {
        console.error('Error when updating movie: ', error);
        res.status(400).json({ message: 'Error occured while updating movie.' });
    }
})