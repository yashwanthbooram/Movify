import React, { useState, useEffect } from 'react';
import API from '../api';
import MovieGrid from './MovieGrid';

const Upcoming = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        API.get('/api/tmdb/upcoming')
            .then(response => {
                setMovies(response.data);
                setError(null);
            })
            .catch(error => {
                setError("Could not load upcoming movies. Please try again later.");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center">Loading Upcoming Movies...</div>;
    if (error) return <div className="text-center text-danger">{error}</div>;

    return (
        <div className="fade-in">
            <h2 className="mb-4">Coming Soon</h2>
            <MovieGrid movies={movies} />
        </div>
    );
};
export default Upcoming;