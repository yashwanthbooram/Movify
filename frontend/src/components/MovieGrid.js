import React from 'react';
import { Link } from 'react-router-dom';

const MovieGrid = ({ movies }) => {
    return (
        <div className="row">
            {movies.map(movie => {
                const linkTo = movie._id ? `/movie/${movie._id}` : `/tmdb/movie/${movie.id}`;
                const posterUrl = movie.poster || (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://placehold.co/500x750?text=No+Image');
                const year = movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A');

                return (
                    <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={movie.id || movie._id}>
                        <Link to={linkTo} className="text-decoration-none">
                            <div className="card h-100 text-white">
                                <img src={posterUrl} className="card-img-top" alt={movie.title} style={{ objectFit: 'cover', height: '400px' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text text-secondary">{year}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
};
export default MovieGrid;

