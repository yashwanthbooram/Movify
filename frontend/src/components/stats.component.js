import React, { useState, useEffect, useMemo } from 'react';
import API from '../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Clock, Film, Star } from 'lucide-react';

const Stats = ({ user }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        API.get('/movies/')
            .then(response => {
                setMovies(response.data);
            })
            .catch(err => {
                setError("Could not load your movie data.");
            })
            .finally(() => setLoading(false));
    }, []);

    const calculatedStats = useMemo(() => {
        if (!user || movies.length === 0) {
            return { totalMovies: 0, totalRuntime: 0, genreData: [], ratingData: [] };
        }
        const userReviews = movies.flatMap(movie => movie.reviews).filter(review => review.userId === user.uid);
        const genreCounts = movies.reduce((acc, movie) => { movie.genres.forEach(genre => { acc[genre] = (acc[genre] || 0) + 1; }); return acc; }, {});
        const genreData = Object.keys(genreCounts).map(name => ({ name, value: genreCounts[name] })).sort((a, b) => b.value - a.value);
        const ratingCounts = userReviews.reduce((acc, review) => { acc[review.rating] = (acc[review.rating] || 0) + 1; return acc; }, {});
        const ratingData = Array.from({ length: 10 }, (_, i) => i + 1).map(rating => ({ name: `${rating} ★`, count: ratingCounts[rating] || 0 }));
        const totalRuntime = movies.reduce((sum, movie) => sum + (movie.runtime || 0), 0);
        return { totalMovies: movies.length, totalRuntime, genreData, ratingData };
    }, [movies, user]);

    const formatRuntime = (minutes) => {
        const days = Math.floor(minutes / (60 * 24));
        const hours = Math.floor((minutes % (60 * 24)) / 60);
        return `${days}d ${hours}h`;
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    if (loading) return <div className="text-center">Calculating stats...</div>;
    if (error) return <div className="text-center text-danger">{error}</div>;
    if (calculatedStats.totalMovies === 0) {
        return ( <div className="text-center p-5 rounded" style={{backgroundColor: 'var(--surface)'}}> <p className="lead">No stats to show yet.</p> <p className="text-secondary">Add some movies to your journal and review them to see your stats!</p> </div> );
    }

    return (
        <div className="fade-in">
            <h2 className="mb-4">Your Stats</h2>
            <div className="row mb-5 text-center">
                <div className="col-md-4"><div className="p-4 rounded" style={{backgroundColor: 'var(--surface)'}}><Film size={48} className="text-primary mb-2" /><h3>{calculatedStats.totalMovies}</h3><p className="text-secondary mb-0">Movies in Journal</p></div></div>
                <div className="col-md-4"><div className="p-4 rounded" style={{backgroundColor: 'var(--surface)'}}><Clock size={48} className="text-success mb-2" /><h3>{formatRuntime(calculatedStats.totalRuntime)}</h3><p className="text-secondary mb-0">Total Watch Time</p></div></div>
                <div className="col-md-4"><div className="p-4 rounded" style={{backgroundColor: 'var(--surface)'}}><Star size={48} className="text-warning mb-2" /><h3>{calculatedStats.ratingData.reduce((acc, cur) => acc + cur.count, 0)}</h3><p className="text-secondary mb-0">Total Reviews Written</p></div></div>
            </div>
            <div className="row">
                <div className="col-lg-8 mb-4"><h4 className="mb-3">Ratings Distribution</h4><div className="p-4 rounded" style={{backgroundColor: 'var(--surface)', height: '400px'}}><ResponsiveContainer width="100%" height="100%"><BarChart data={calculatedStats.ratingData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><XAxis dataKey="name" stroke="var(--text-secondary)" /><YAxis stroke="var(--text-secondary)" allowDecimals={false} /><Tooltip cursor={{fill: 'rgba(255, 255, 255, 0.1)'}} contentStyle={{backgroundColor: 'var(--background)', border: '1px solid var(--border)'}}/><Bar dataKey="count" fill="var(--accent)" /></BarChart></ResponsiveContainer></div></div>
                <div className="col-lg-4 mb-4"><h4 className="mb-3">Favorite Genres</h4><div className="p-4 rounded" style={{backgroundColor: 'var(--surface)', height: '400px'}}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={calculatedStats.genreData.slice(0, 5)} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>{calculatedStats.genreData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} /> ))}</Pie><Tooltip contentStyle={{backgroundColor: 'var(--background)', border: '1px solid var(--border)'}}/><Legend /></PieChart></ResponsiveContainer></div></div>
            </div>
        </div>
    );
};
export default Stats;
