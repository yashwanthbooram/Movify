import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MovieGrid from './MovieGrid';

const ForYou = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [selectedMood, setSelectedMood] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const moods = [ { key: 'happy', name: 'Happy & Uplifting' }, { key: 'sad', name: 'Sad & Dramatic' }, { key: 'adventurous', name: 'Action & Adventure' }, { key: 'thrilling', name: 'Thrilling & Suspenseful' }, { key: 'thoughtful', name: 'Thought-Provoking' } ];

    useEffect(() => {
        axios.get('http://localhost:5000/api/tmdb/genres')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setGenres(response.data);
                }
            })
            .catch(err => console.error("Error fetching genres:", err));
    }, []);

    const fetchForYouMovies = useCallback(() => {
        if (!selectedMood && !selectedGenre) { setMovies([]); return; }
        setLoading(true);
        setError(null);
        axios.get(`http://localhost:5000/api/tmdb/discover`, { params: { mood: selectedMood, with_genres: selectedGenre } })
            .then(response => setMovies(response.data))
            .catch(err => setError("Could not find recommendations. Please try different options."))
            .finally(() => setLoading(false));
    }, [selectedMood, selectedGenre]);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        fetchForYouMovies();
    };

    return (
        <div className="fade-in">
            <h2 className="mb-4">For You</h2>
            <p className="text-secondary mb-4">Get personalized recommendations based on your mood and taste.</p>
            <form onSubmit={handleFormSubmit} className="p-4 rounded mb-4" style={{backgroundColor: 'var(--surface)'}}>
                <div className="row g-3 align-items-end">
                    <div className="col-md-5"><label className="form-label">What's your mood?</label><select className="form-select" value={selectedMood} onChange={(e) => setSelectedMood(e.target.value)}><option value="">Select a mood...</option>{moods.map(m => <option key={m.key} value={m.key}>{m.name}</option>)}</select></div>
                    <div className="col-md-5"><label className="form-label">Pick a genre (optional)</label><select className="form-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}><option value="">Any Genre</option>{genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                    <div className="col-md-2"><button type="submit" className="btn btn-primary w-100">Find Movies</button></div>
                </div>
            </form>
            {loading ? <div className="text-center">Finding recommendations...</div> : error ? <div className="text-center text-danger">{error}</div> : movies.length > 0 && (
                <>
                    <h3 className="mb-4">Here's what we found for you...</h3>
                    <MovieGrid movies={movies} />
                </>
            )}
        </div>
    );
};
export default ForYou;

