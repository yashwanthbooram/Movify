import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';

const TmdbMovieDetails = () => {
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const { tmdbId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5000/api/tmdb/movie/${tmdbId}`)
            .then(response => {
                setMovie(response.data);
            })
            .catch(error => console.error("Error fetching TMDB details:", error))
            .finally(() => setLoading(false));
    }, [tmdbId]);

    const handleAddMovie = () => {
        setIsAdding(true);
        axios.post('http://localhost:5000/movies/add', { tmdbId: movie.id })
            .then(res => {
                // If the movie already exists, the backend sends the existing movie object.
                // We navigate to its detail page.
                navigate(`/movie/${res.data.movie._id}`);
            })
            .catch(err => {
                alert(err.response?.data?.message || 'Could not add this movie.');
                setIsAdding(false);
            });
    };
    
    if (loading) {
        return <div className="text-center">Loading Details...</div>;
    }

    if (!movie) {
        return <div className="text-center text-danger">Could not load movie details.</div>;
    }
    
    const formatRuntime = (minutes) => {
        if (!minutes) return 'N/A';
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    return (
        <div>
            <div className="backdrop-container" style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`, opacity: movie.backdrop_path ? 1 : 0 }}></div>
            <div className="backdrop-overlay"></div>
            <div className="container py-5 fade-in">
                <div className="row mb-5">
                    <div className="col-md-4 text-center text-md-start">
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="img-fluid rounded shadow-lg" style={{border: '3px solid var(--border)', maxWidth: '300px'}}/>
                    </div>
                    <div className="col-md-8 d-flex flex-column justify-content-center">
                        <h1 className="display-4 fw-bold">{movie.title}</h1>
                        <div className="d-flex align-items-center text-secondary mb-3">
                            <span>{new Date(movie.release_date).getFullYear()}</span>
                            <span className="mx-2">•</span>
                            <Clock size={16} className="me-1" />
                            <span>{formatRuntime(movie.runtime)}</span>
                        </div>
                        <div className="mb-3">
                            {movie.genres?.map(genre => (
                                <span key={genre.id} className="badge bg-secondary me-2">{genre.name}</span>
                            ))}
                        </div>
                        <p className="lead">{movie.overview}</p>
                        <div className="mt-4">
                            <button onClick={handleAddMovie} className="btn btn-primary btn-lg" disabled={isAdding}>
                                {isAdding ? 'Adding...' : 'Add to Journal to Review'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TmdbMovieDetails;