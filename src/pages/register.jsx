import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import "./auth.css";

export default function Register() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            await register(form);
            setSuccessMessage("Registration successful. Redirecting to login...");
            setTimeout(() => navigate('/login'), 1200);
        } catch {
            setErrorMessage("Registration failed. Please review your details and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-shell">
            <div className="auth-ambient auth-ambient--left" aria-hidden="true" />
            <div className="auth-ambient auth-ambient--right" aria-hidden="true" />

            <section className="auth-card" aria-label="Register form">
                <p className="auth-eyebrow">Create Account</p>
                <h1 className="auth-title">Join and get started</h1>
                <p className="auth-subtitle">Set up your credentials in less than a minute.</p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label className="auth-label" htmlFor="register-username">Username</label>
                    <input
                        id="register-username"
                        type="text"
                        placeholder="johndoe"
                        value={form.username}
                        autoComplete="username"
                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                        required
                    />

                    <label className="auth-label" htmlFor="register-email">Email</label>
                    <input
                        id="register-email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        autoComplete="email"
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                    />

                    <label className="auth-label" htmlFor="register-password">Password</label>
                    <input
                        id="register-password"
                        type="password"
                        placeholder="Choose a strong password"
                        value={form.password}
                        autoComplete="new-password"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                    />

                    {errorMessage && <p className="auth-feedback auth-feedback--error">{errorMessage}</p>}
                    {successMessage && <p className="auth-feedback auth-feedback--success">{successMessage}</p>}

                    <button type="submit" className="auth-submit" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Register'}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign in</Link>
                </p>
            </section>
        </div>
    );
}