import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="auth-card__subtitle">Log in to continue your career journey.</p>
        {error && <div className="alert alert--error">{error}</div>}
        <label>Email Address</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="you@example.com"
        />
        <label>Password</label>
        <input
          type="password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
        />
        <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="auth-card__footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
