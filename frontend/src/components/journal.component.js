import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieGrid from './MovieGrid';

const Journal = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/movies/')
            .then(response => setMovies(response.data))
            .catch((error) => console.log(error))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center">Loading Journal...</div>;

    return (
        <div className="fade-in">
            <h2 className="mb-4">Your Journal</h2>
            {movies.length > 0 ? (
                <MovieGrid movies={movies} />
            ) : (
                <div className="text-center p-5 rounded" style={{backgroundColor: 'var(--surface)'}}>
                    <p className="lead">Your movie journal is empty.</p>
                    <p className="text-secondary">Search for movies and add them to get started.</p>
                    <Link to="/add" className="btn btn-primary mt-2">Add a Movie</Link>
                </div>
            )}
        </div>
    );
};
export default Journal;

