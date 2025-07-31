import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import Navbar from './components/navbar.component';
import Journal from './components/journal.component';
import Trending from './components/trending.component';
import Upcoming from './components/upcoming.component';
import Discover from './components/discover.component';
import ForYou from './components/foryou.component';
import AddMovie from './components/add-movie.component';
import MovieDetails from './components/movie-details.component';
import TmdbMovieDetails from './components/tmdb-movie-details.component';
import Login from './components/login.component';
import SignUp from './components/signup.component';
import Stats from './components/stats.component';

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const savedUsername = localStorage.getItem('movify-username');
        if (savedUsername) {
          setUsername(savedUsername);
        } else if (!currentUser.isAnonymous) {
          setUsername(currentUser.email.split('@')[0]);
        }
      } else {
        signInAnonymously(auth).catch((error) => console.error("Anonymous sign-in failed:", error));
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSetUsername = (name) => {
    localStorage.setItem('movify-username', name);
    setUsername(name);
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>Loading Movify...</div>;
  }

  return (
    <Router>
      <Navbar user={user} username={username} setUsername={handleSetUsername} theme={theme} toggleTheme={toggleTheme} />
      <main className="container my-4">
        <Routes>
          <Route path="/" element={<Journal />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/foryou" element={<ForYou />} />
          <Route path="/add" element={<AddMovie />} />
          <Route path="/stats" element={<Stats user={user} />} />
          <Route path="/login" element={<Login setUsername={handleSetUsername} />} />
          <Route path="/signup" element={<SignUp setUsername={handleSetUsername} />} />
          <Route path="/movie/:id" element={<MovieDetails user={user} username={username} />} />
          <Route path="/tmdb/movie/:tmdbId" element={<TmdbMovieDetails />} />
        </Routes>
      </main>
    </Router>
  );
}
export default App;

