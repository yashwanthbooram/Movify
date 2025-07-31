const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// --- 1. INITIAL SETUP ---
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// --- 2. DATABASE CONNECTION ---
const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.error("MongoDB connection error:", err));

// --- 3. DATABASE MODELS (SCHEMAS) ---
const movieSchema = new mongoose.Schema({ tmdbId: { type: String, required: true, unique: true }, title: { type: String, required: true }, year: { type: Number, required: true }, runtime: { type: Number }, genres: [{ type: String }], poster: { type: String, required: true }, backdrop: { type: String }, synopsis: { type: String, required: true }, reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] }, { timestamps: true });
const Movie = mongoose.model('Movie', movieSchema);
const reviewSchema = new mongoose.Schema({ movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true }, userId: { type: String, required: true }, username: { type: String, required: true }, rating: { type: Number, required: true }, comment: { type: String, required: true }, }, { timestamps: true });
const Review = mongoose.model('Review', reviewSchema);
const userSchema = new mongoose.Schema({ username: { type: String, required: true, unique: true, trim: true, minlength: 3 }, email: { type: String, required: true, unique: true, trim: true }, firebaseUid: { type: String, required: true, unique: true } }, { timestamps: true });
const User = mongoose.model('User', userSchema);

// --- 4. API ROUTES ---

// --- A. ROUTES FOR OUR OWN DATABASE ---
app.get('/movies', (req, res) => { Movie.find().sort({ createdAt: -1 }).populate('reviews').then(m => res.json(m)).catch(e => res.status(400).json(e)); });
app.get('/movies/:id', (req, res) => { Movie.findById(req.params.id).populate('reviews').then(m => res.json(m)).catch(e => res.status(400).json(e)); });
app.post('/movies/add', async (req, res) => {
    const { tmdbId } = req.body;
    if (!tmdbId) return res.status(400).json({ message: 'TMDB ID is required.' });
    try {
        let movie = await Movie.findOne({ tmdbId });
        if (movie) return res.status(200).json({ message: 'Movie already in journal.', movie });
        const movieData = (await axios.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${process.env.TMDB_API_KEY}`)).data;
        const newMovie = new Movie({ tmdbId: movieData.id, title: movieData.title, year: movieData.release_date ? new Date(movieData.release_date).getFullYear() : 0, runtime: movieData.runtime || 0, genres: movieData.genres ? movieData.genres.map(g => g.name) : [], poster: movieData.poster_path ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}` : '', backdrop: movieData.backdrop_path ? `https://image.tmdb.org/t/p/original${movieData.backdrop_path}` : '', synopsis: movieData.overview || 'No synopsis available.' });
        const savedMovie = await newMovie.save();
        res.status(201).json({ message: 'Movie added successfully!', movie: savedMovie });
    } catch (error) { res.status(500).json({ message: 'Server error while adding movie.' }); }
});
app.delete('/movies/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json({ message: "Movie not found" });
        await Review.deleteMany({ _id: { $in: movie.reviews } });
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ message: "Movie deleted successfully." });
    } catch (error) { res.status(500).json({ message: "Server error while deleting movie." }); }
});

app.post('/reviews/add', (req, res) => { const { movieId, userId, username, rating, comment } = req.body; const newReview = new Review({ movieId, userId, username, rating: Number(rating), comment }); newReview.save().then(s => Movie.findByIdAndUpdate(movieId, { $push: { reviews: s._id } })).then(() => res.json('Review added!')).catch(e => res.status(400).json(e)); });
app.get('/reviews/:movieId', (req, res) => { Review.find({ movieId: req.params.movieId }).then(r => res.json(r)).catch(e => res.status(400).json(e)); });

app.post('/users/register', (req, res) => { const { username, email, firebaseUid } = req.body; const newUser = new User({ username, email, firebaseUid }); newUser.save().then(() => res.json('User registered!')).catch(err => res.status(400).json('Error: ' + err)); });

// --- NEW ROUTE TO FIND USER BY USERNAME ---
app.get('/users/find-by-username/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (user) {
            res.json({ email: user.email, username: user.username });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// --- B. ROUTES FOR TALKING TO THE TMDB API ---
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

app.get('/api/tmdb/genres', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data.genres);
    } catch (error) { res.status(500).json({ message: `Failed to fetch genres: ${error.message}` }); }
});
app.get('/api/tmdb/trending', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (error) { res.status(500).json({ message: `Failed to fetch trending: ${error.message}` }); }
});
app.get('/api/tmdb/upcoming', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (error) { res.status(500).json({ message: `Failed to fetch upcoming: ${error.message}` }); }
});
app.get('/api/tmdb/discover', async (req, res) => {
    try {
        const url = new URL(`${TMDB_BASE_URL}/discover/movie`);
        url.searchParams.append('api_key', TMDB_API_KEY);
        Object.keys(req.query).forEach(key => { if (req.query[key]) url.searchParams.append(key, req.query[key]); });
        const response = await axios.get(url.toString());
        res.json(response.data.results);
    } catch (error) { res.status(500).json({ message: `Failed to fetch discover: ${error.message}` }); }
});
app.get('/api/tmdb/search', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${req.query.query}`;
        const response = await axios.get(url);
        res.json(response.data.results);
    } catch (error) { res.status(500).json({ message: `Failed to fetch search: ${error.message}` }); }
});
app.get('/api/tmdb/movie/:id', async (req, res) => {
    try {
        const url = `${TMDB_BASE_URL}/movie/${req.params.id}?api_key=${TMDB_API_KEY}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) { res.status(500).json({ message: `Failed to fetch movie details: ${error.message}` }); }
});

// --- 5. START SERVER ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
