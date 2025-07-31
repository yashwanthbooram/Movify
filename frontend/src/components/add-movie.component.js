import React, { useState, useCallback } from 'react';
import API from '../api';
import MovieGrid from './MovieGrid';

const AddMovie = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeSearch = useCallback(() => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        API.get(`/api/tmdb/search?query=${query}`)
            .then(response => setResults(response.data))
            .catch(err => setError("Search failed. Please try again."))
            .finally(() => setLoading(false));
    }, [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        executeSearch();
    };

    return (
        <div className="fade-in">
            <h2 className="mb-4">Add a Movie to Your Journal</h2>
            <form onSubmit={handleSearchSubmit} className="mb-5">
                <div className="input-group">
                    <input type="text" className="form-control form-control-lg" placeholder="Search by title..." value={query} onChange={(e) => setQuery(e.target.value)} />
                    <button className="btn btn-primary" type="submit">Search</button>
                </div>
            </form>
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-center text-danger">{error}</div>}
            <MovieGrid movies={results} />
        </div>
    );
};
export default AddMovie;