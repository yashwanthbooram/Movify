import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react'; // We'll use these icons

const SignUp = ({ setUsername }) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // --- NEW STATE FOR PASSWORD FEATURES ---
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: 'Too Weak', color: 'danger' });

    // --- NEW: PASSWORD STRENGTH LOGIC ---
    useEffect(() => {
        const checkPasswordStrength = (pass) => {
            let score = 0;
            let label = 'Too Weak';
            let color = 'danger';

            if (pass.length >= 8) score++;
            if (/[A-Z]/.test(pass)) score++;
            if (/[0-9]/.test(pass)) score++;
            if (/[^A-Za-z0-9]/.test(pass)) score++;

            if (score === 4) {
                label = 'Strong';
                color = 'success';
            } else if (score === 3) {
                label = 'Medium';
                color = 'warning';
            } else if (score >= 1) {
                label = 'Weak';
                color = 'danger';
            }
            
            setPasswordStrength({ score, label, color });
        };
        checkPasswordStrength(password);
    }, [password]);


    // --- UPDATED: HANDLE SUBMIT WITH BETTER ERROR HANDLING ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }
        if (passwordStrength.score < 2) { // Require at least a "Medium" strength password
            return setError("Password is too weak. Please include uppercase letters, numbers, and symbols.");
        }
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUser = {
                username: usernameInput,
                email: user.email,
                firebaseUid: user.uid
            };
            await axios.post('http://localhost:5000/users/register', newUser);
            setUsername(usernameInput);
            navigate('/');
        } catch (err) {
            // Provide more specific error messages from Firebase
            if (err.code === 'auth/email-already-in-use') {
                setError("This email address is already in use by another account.");
            } else if (err.code === 'auth/weak-password') {
                setError("Password should be at least 6 characters long.");
            } else {
                setError("Failed to create an account. Please try again.");
            }
            console.error(err);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card text-dark">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Sign Up</h2>
                        <p className="text-center text-secondary mb-3">
                            Your email is used for login purposes only and will not be shared.
                        </p>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Username</label>
                                <input type="text" className="form-control" required onChange={(e) => setUsernameInput(e.target.value)} />
                            </div>
                            <div className="form-group mb-3">
                                <label>Email</label>
                                <input type="email" className="form-control" required onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            
                            {/* --- NEW: PASSWORD FIELD WITH STRENGTH METER AND TOGGLE --- */}
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
                                {password.length > 0 && (
                                    <div className="progress mt-2" style={{ height: '5px' }}>
                                        <div
                                            className={`progress-bar bg-${passwordStrength.color}`}
                                            role="progressbar"
                                            style={{ width: `${passwordStrength.score * 25}%` }}
                                            aria-valuenow={passwordStrength.score * 25}
                                            aria-valuemin="0"
                                            aria-valuemax="100"
                                        ></div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="form-group mb-3">
                                <label>Confirm Password</label>
                                <input type="password" required className="form-control" onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                            <button className="w-100 btn btn-primary" type="submit">Sign Up</button>
                        </form>
                        <div className="w-100 text-center mt-3">
                           <Link to="/">Continue as Guest</Link>
                        </div>
                    </div>
                </div>
                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to="/login">Log In</Link>
                </div>
            </div>
        </div>
    );
};

export default SignUp;