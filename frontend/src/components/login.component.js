import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const Login = ({ setUsername }) => {
    const [loginInput, setLoginInput] = useState(''); // Can be username or email
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        let emailToLogin;
        let usernameToSet;

        try {
            // Check if the input is an email or a username
            if (loginInput.includes('@')) {
                emailToLogin = loginInput;
                usernameToSet = loginInput.split('@')[0]; // Default username from email
            } else {
                // It's a username, so we need to fetch the corresponding email from our backend
                const response = await axios.get(`http://localhost:5000/users/find-by-username/${loginInput}`);
                emailToLogin = response.data.email;
                usernameToSet = response.data.username;
            }

            // Now, sign in to Firebase with the resolved email and the provided password
            await signInWithEmailAndPassword(auth, emailToLogin, password);
            
            // On success, set the username in the app state and navigate to the homepage
            setUsername(usernameToSet);
            navigate('/');

        } catch (err) {
            setError("Failed to log in. Please check your credentials and try again.");
            console.error("Login error:", err);
            setLoading(false);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card text-dark">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Log In</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Username or Email</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    required 
                                    onChange={(e) => setLoginInput(e.target.value)} 
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label>Password</label>
                                <div className="input-group">
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        className="form-control" 
                                        onChange={(e) => setPassword(e.target.value)} 
                                    />
                                    <button 
                                        className="btn btn-outline-secondary" 
                                        type="button"
                                        onMouseDown={() => setShowPassword(true)}
                                        onMouseUp={() => setShowPassword(false)}
                                        onTouchStart={() => setShowPassword(true)}
                                        onTouchEnd={() => setShowPassword(false)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button className="w-100 btn btn-primary" type="submit" disabled={loading}>
                                {loading ? 'Logging In...' : 'Log In'}
                            </button>
                        </form>
                        <div className="w-100 text-center mt-3">
                           <Link to="/">Continue as Guest</Link>
                        </div>
                    </div>
                </div>
                <div className="w-100 text-center mt-2">
                    Need an account? <Link to="/signup">Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
