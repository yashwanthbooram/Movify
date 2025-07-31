import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { LogOut, Edit, Sun, Moon } from 'lucide-react';

const Navbar = ({ user, username, setUsername, theme, toggleTheme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(username);

  const handleSave = () => {
    if (nameInput.trim()) {
      setUsername(nameInput.trim());
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      localStorage.removeItem('movify-username');
      setUsername('');
      console.log("User signed out");
    }).catch(error => console.error("Sign out error", error));
  };

  const renderUserSection = () => {
    if (!user) return null;

    if (user.isAnonymous) {
      if (isEditing) {
        return (
          <div className="d-flex align-items-center">
            <input type="text" className="form-control form-control-sm" value={nameInput} onChange={(e) => setNameInput(e.target.value)} style={{ marginRight: '10px' }} placeholder="Your guest name"/>
            <button className="btn btn-sm btn-success" onClick={handleSave}>Save</button>
          </div>
        );
      }
      return (
        <div className="d-flex align-items-center">
          <span className="navbar-text me-2">Welcome, {username || 'Guest'}</span>
          <button className="btn btn-sm btn-link text-secondary p-0" onClick={() => { setIsEditing(true); setNameInput(username); }}>
            <Edit size={16} />
          </button>
          <span className="mx-2 text-secondary">|</span>
          <NavLink to="/signup" className="btn btn-primary btn-sm">Sign Up to Save</NavLink>
        </div>
      );
    } else {
      return (
        <div className="d-flex align-items-center">
          <span className="navbar-text me-3">
            Welcome, <strong className="text-white">{username}</strong>
          </span>
          <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
            <LogOut size={16} className="me-1"/> Logout
          </button>
        </div>
      );
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand fw-bold me-4">Movify</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar"><span className="navbar-toggler-icon"></span></button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><NavLink to="/" className="nav-link" end>Journal</NavLink></li>
            <li className="nav-item"><NavLink to="/stats" className="nav-link">Stats</NavLink></li>
            <li className="nav-item"><NavLink to="/trending" className="nav-link">Trending</NavLink></li>
            <li className="nav-item"><NavLink to="/upcoming" className="nav-link">Upcoming</NavLink></li>
            <li className="nav-item"><NavLink to="/discover" className="nav-link">Discover</NavLink></li>
            <li className="nav-item"><NavLink to="/foryou" className="nav-link">For You</NavLink></li>
            <li className="nav-item"><NavLink to="/add" className="nav-link">Add Movie</NavLink></li>
          </ul>
          <div className="d-flex align-items-center">
            <button onClick={toggleTheme} className="btn btn-link text-secondary me-3" title="Toggle Theme">
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            {renderUserSection()}
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;

