import React, { useState, useEffect, useCallback } from 'react';
import API from '../api';
import MovieGrid from './MovieGrid';

const Discover = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [years, setYears] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const languages = [ { code: 'en', name: 'English' }, { code: 'es', name: 'Spanish' }, { code: 'fr', name: 'French' }, { code: 'de', name: 'German' }, { code: 'ja', name: 'Japanese' }, { code: 'ko', name: 'Korean' }, { code: 'hi', name: 'Hindi' }, { code: 'te', name: 'Telugu' } ];

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let i = currentYear; i >= 1950; i--) { yearList.push(i); }
        setYears(yearList);

        API.get('/api/tmdb/genres')
            .then(response => {
                if (Array.isArray(response.data)) {
                    setGenres(response.data);
                }
            })
            .catch(err => console.error("Error fetching genres:", err));
    }, []);

    const fetchDiscoverMovies = useCallback(() => {
        setLoading(true);
        setError(null);
        API.get(`/api/tmdb/discover`, { params: { with_genres: selectedGenre, primary_release_year: selectedYear, with_original_language: selectedLanguage } })
            .then(response => setMovies(response.data))
            .catch(err => setError("Could not load movies. Please try again."))
            .finally(() => setLoading(false));
    }, [selectedGenre, selectedYear, selectedLanguage]);

    const handleDiscoverSearch = (e) => {
        e.preventDefault();
        fetchDiscoverMovies();
    };

    return (
        <div className="fade-in">
            <h2 className="mb-4">Discover New Movies</h2>
            <form onSubmit={handleDiscoverSearch} className="p-4 rounded mb-4" style={{backgroundColor: 'var(--surface)'}}>
                <div className="row g-3 align-items-end">
                    <div className="col-md-4"><label className="form-label">Genre</label><select className="form-select" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}><option value="">Any Genre</option>{genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
                    <div className="col-md-3"><label className="form-label">Year</label><select className="form-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}><option value="">Any Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                    <div className="col-md-3"><label className="form-label">Language</label><select className="form-select" value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}><option value="">Any Language</option>{languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}</select></div>
                    <div className="col-md-2"><button type="submit" className="btn btn-primary w-100">Discover</button></div>
                </div>
            </form>
            {loading ? <div className="text-center">Loading...</div> : error ? <div className="text-center text-danger">{error}</div> : <MovieGrid movies={movies} />}
        </div>
    );
};
export default Discover;