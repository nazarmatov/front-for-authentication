import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import './auth.css';

export default function Login() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [form, setForm] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setIsLoading(true);

        try {
            const response = await login(form);
            const token =
                response?.data?.token ||
                response?.data?.accessToken ||
                response?.data?.jwt;

            if (!token) {
                setErrorMessage('Login succeeded but no token was returned by the auth service.');
                return;
            }

            localStorage.setItem('token', token);
            navigate('/dashboard');
        } catch (error) {
            if (error?.code === 'ERR_NETWORK') {
                setErrorMessage('Cannot reach auth service. Check that backend is running and CORS allows http://localhost:5173.');
                return;
            }

            const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
            setErrorMessage(serverMessage || 'Login failed. Please check your credentials and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-ambient auth-ambient--left" aria-hidden="true" />
            <div className="auth-ambient auth-ambient--right" aria-hidden="true" />

            <section className="auth-card" aria-label="Login form">
                <p className="auth-eyebrow">Welcome Back</p>
                <h1 className="auth-title">Sign in to your account</h1>
                <p className="auth-subtitle">Securely continue to your dashboard.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="login-username">Username</label>
                    <input
                        id="login-username"
                        type="text"
                        placeholder="johndoe"
                        autoComplete="username"
                        value={form.username}
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />

                    <label className="auth-label" htmlFor="login-password">Password</label>
                    <input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    {errorMessage && <p className="auth-feedback auth-feedback--error">{errorMessage}</p>}

                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        {isLoading ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <p className="auth-footer">
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </section>
        </div>
    );
}