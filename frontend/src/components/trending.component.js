import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MovieGrid from './MovieGrid';

const Trending = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5000/api/tmdb/trending')
            .then(response => {
                setMovies(response.data);
                setError(null);
            })
            .catch(error => {
                console.error("Error fetching trending movies:", error);
                setError("Could not load trending movies. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center">Loading Trending Movies...</div>;
    if (error) return <div className="text-center text-danger">{error}</div>;

    return (
        <div className="fade-in">
            <h2 className="mb-4">Trending This Week</h2>
            <MovieGrid movies={movies} />
        </div>
    );
};
export default Trending;

