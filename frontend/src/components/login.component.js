import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import API from '../api';

const Login = ({ setUsername }) => {
    const [loginInput, setLoginInput] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let emailToLogin;
        let usernameToSet;
        try {
            if (loginInput.includes('@')) {
                emailToLogin = loginInput;
                usernameToSet = loginInput.split('@')[0];
            } else {
                const response = await API.get(`/users/find-by-username/${loginInput}`);
                emailToLogin = response.data.email;
                usernameToSet = response.data.username;
            }
            await signInWithEmailAndPassword(auth, emailToLogin, password);
            setUsername(usernameToSet);
            navigate('/');
        } catch (err) {
            setError("Failed to log in. Please check your credentials and try again.");
            console.error("Login error:", err);
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
                            <div className="form-group mb-3"><label>Username or Email</label><input type="text" className="form-control" required onChange={(e) => setLoginInput(e.target.value)} /></div>
                            <div className="form-group mb-3"><label>Password</label><input type="password" required className="form-control" onChange={(e) => setPassword(e.target.value)} /></div>
                            <button className="w-100 btn btn-primary" type="submit">Log In</button>
                        </form>
                        <div className="w-100 text-center mt-3"><Link to="/">Continue as Guest</Link></div>
                    </div>
                </div>
                <div className="w-100 text-center mt-2">Need an account? <Link to="/signup">Sign Up</Link></div>
            </div>
        </div>
    );
};
export default Login;