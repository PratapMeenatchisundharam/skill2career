import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.fullName, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        <p className="auth-card__subtitle">Start matching your skills to real opportunities.</p>
        {error && <div className="alert alert--error">{error}</div>}
        <label>Full Name</label>
        <input
          required
          value={form.fullName}
          onChange={e => setForm({ ...form, fullName: e.target.value })}
          placeholder="Jane Doe"
        />
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
          minLength={6}
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="At least 6 characters"
        />
        <button className="btn btn--primary btn--full" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="auth-card__footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
