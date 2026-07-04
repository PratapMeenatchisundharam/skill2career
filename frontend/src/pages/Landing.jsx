import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

export default function Landing() {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="fade-in landing">
      <div className="landing__glow" />
      <h1 className="landing__title">
        Turn Your Skills Into Your <span className="gradient-text">Dream Career</span>
      </h1>
      <p className="landing__subtitle">
        Skill2Career is your AI-powered guide — find matching jobs, generate ATS-friendly resumes
        tailored to any company, and walk into interviews fully prepared.
      </p>
      <div className="landing__actions">
        <Link to="/register" className="btn btn--primary btn--large">Get Started Free</Link>
        <Link to="/login" className="btn btn--ghost btn--large">I already have an account</Link>
      </div>

      <div className="landing__features">
        {[
          { icon: '🎯', title: 'Skill-Based Job Matching', desc: 'Find real openings that match what you already know.' },
          { icon: '📄', title: 'Company-Tailored Resumes', desc: 'Generate ATS-ready resumes for any target company.' },
          { icon: '🎤', title: 'Interview Preparation', desc: 'Practice technical & HR questions per company.' },
          { icon: '📈', title: 'AI Career Guidance', desc: 'Get personalized advice on closing your skill gaps.' }
        ].map(f => (
          <div className="card feature-card" key={f.title}>
            <div className="feature-card__icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
