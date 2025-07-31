import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import API from '../api';

const SignUp = ({ setUsername }) => {
    const [usernameInput, setUsernameInput] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return setError("Passwords do not match");
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const newUser = { username: usernameInput, email: user.email, firebaseUid: user.uid };
            await API.post('/users/register', newUser);
            setUsername(usernameInput);
            navigate('/');
        } catch (err) {
            setError("Failed to create an account. The email may already be in use.");
            console.error(err);
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6">
                <div className="card text-dark">
                    <div className="card-body">
                        <h2 className="text-center mb-4">Sign Up</h2>
                        <p className="text-center text-secondary mb-3">Your email is used for login purposes only and will not be shared.</p>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3"><label>Username</label><input type="text" className="form-control" required onChange={(e) => setUsernameInput(e.target.value)} /></div>
                            <div className="form-group mb-3"><label>Email</label><input type="email" className="form-control" required onChange={(e) => setEmail(e.target.value)} /></div>
                            <div className="form-group mb-3"><label>Password</label><input type="password" required className="form-control" onChange={(e) => setPassword(e.target.value)} /></div>
                            <div className="form-group mb-3"><label>Confirm Password</label><input type="password" required className="form-control" onChange={(e) => setConfirmPassword(e.target.value)} /></div>
                            <button className="w-100 btn btn-primary" type="submit">Sign Up</button>
                        </form>
                        <div className="w-100 text-center mt-3"><Link to="/">Continue as Guest</Link></div>
                    </div>
                </div>
                <div className="w-100 text-center mt-2">Already have an account? <Link to="/login">Log In</Link></div>
            </div>
        </div>
    );
};
export default SignUp;