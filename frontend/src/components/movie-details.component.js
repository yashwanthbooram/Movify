import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Star, Trash2 } from 'lucide-react';

const MovieDetails = ({ user, username }) => {
    const [movie, setMovie] = useState(null);
    // We no longer need a separate 'reviews' state, as it will be part of the 'movie' object.
    const { id } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // This function now only needs to fetch the movie, as reviews are included by the backend.
    const fetchMovie = () => {
        axios.get(`http://localhost:5000/movies/${id}`)
            .then(res => {
                setMovie(res.data);
            })
            .catch(err => {
                console.error("Error fetching movie, it may have been deleted.", err);
                navigate('/'); // If movie not found, redirect to home
            });
    };

    useEffect(() => {
        fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, navigate]); // Rerun when the ID in the URL changes

    const onReviewSubmit = (e) => {
        e.preventDefault();
        if (!user) return;
        const newReview = { movieId: id, userId: user.uid, username: username || 'Guest', rating, comment };
        axios.post('http://localhost:5000/reviews/add', newReview).then(() => {
            setRating(5);
            setComment('');
            fetchMovie(); // Refetch the movie to get the updated review list
        });
    };

    const handleDeleteMovie = () => {
        if (window.confirm("Are you sure you want to delete this movie from your journal?")) {
            axios.delete(`http://localhost:5000/movies/${id}`)
                .then(response => {
                    console.log(response.data.message);
                    navigate('/');
                })
                .catch(error => {
                    alert("Failed to delete movie. Please try again.");
                });
        }
    };
    
    if (!movie) return <div className="text-center">Loading...</div>;

    const formatRuntime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs}h ${mins}m`;
    };

    return (
        <div>
            <div className="backdrop-container" style={{ backgroundImage: `url(${movie.backdrop})`, opacity: movie.backdrop ? 1 : 0 }}></div>
            <div className="backdrop-overlay"></div>
            <div className="container py-5 fade-in">
                <div className="row mb-5">
                    <div className="col-md-4 text-center text-md-start">
                        <img src={movie.poster} alt={movie.title} className="img-fluid rounded shadow-lg" style={{border: '3px solid var(--border)', maxWidth: '300px'}}/>
                    </div>
                    <div className="col-md-8 d-flex flex-column justify-content-center">
                        <h1 className="display-4 fw-bold">{movie.title}</h1>
                        <div className="d-flex align-items-center text-secondary mb-3">
                            <span>{movie.year}</span>
                            <span className="mx-2">•</span>
                            <Clock size={16} className="me-1" />
                            <span>{formatRuntime(movie.runtime)}</span>
                        </div>
                        <div className="mb-3">
                            {movie.genres.map(genre => (
                                <span key={genre} className="badge bg-secondary me-2">{genre}</span>
                            ))}
                        </div>
                        <p className="lead">{movie.synopsis}</p>
                        <div className="mt-4">
                            <button onClick={handleDeleteMovie} className="btn btn-outline-danger">
                                <Trash2 size={16} className="me-2" />
                                Delete from Journal
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="row">
                    <div className="col-lg-7">
                        <h4 className="mb-3">Reviews</h4>
                        {/* We now map over movie.reviews directly */}
                        {movie.reviews && movie.reviews.length > 0 ? (
                            movie.reviews.map((review, index) => (
                                <div className="card mb-3 slide-up" key={review._id} style={{animationDelay: `${index * 0.05}s`}}>
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between">
                                            <h5 className="card-title mb-1">{review.username}</h5>
                                            <div className="d-flex align-items-center text-warning">
                                                <Star size={16} className="me-1" fill="currentColor" />
                                                <span className="fw-bold">{review.rating}</span><span className="text-secondary">/10</span>
                                            </div>
                                        </div>
                                        <p className="card-text mt-2 mb-1">{review.comment}</p>
                                        <small className="text-secondary">{new Date(review.createdAt).toLocaleDateString()}</small>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-secondary">Be the first to review this movie!</p>
                        )}
                    </div>
                    <div className="col-lg-5">
                        <h4 className="mb-3">Add Your Review</h4>
                        <div className="card">
                            <div className="card-body">
                                <form onSubmit={onReviewSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Rating</label>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <Star size={20} className="text-secondary"/>
                                            <input type="range" min="1" max="10" className="form-range mx-3" value={rating} onChange={(e) => setRating(e.target.value)} />
                                            <span className="fw-bold fs-4 text-primary">{rating}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Comment</label>
                                        <textarea className="form-control" rows="4" required value={comment} onChange={(e) => setComment(e.target.value)} placeholder={`What did you think of ${movie.title}?`}></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default MovieDetails;