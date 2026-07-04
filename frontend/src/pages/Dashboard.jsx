import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [roleInput, setRoleInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  const loadProfile = async () => {
    const { data } = await api.get('/auth/profile');
    setProfile(data);
    setSkillsInput((data.profile.skills || []).join(', '));
    setRoleInput(data.profile.preferredRole || '');
  };

  const loadRecommended = async () => {
    const { data } = await api.get('/jobs/recommend/for-me');
    setRecommended(data.jobs || []);
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) loadRecommended();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const saveSkills = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      await api.put('/auth/profile', { skills, preferredRole: roleInput });
      await loadProfile();
    } finally {
      setSaving(false);
    }
  };

  const askAI = async e => {
    e.preventDefault();
    if (!question.trim()) return;
    setAsking(true);
    setAnswer('');
    try {
      const { data } = await api.post('/ai/career-guidance', { question });
      setAnswer(data.answer);
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="fade-in dashboard">
      <header className="dashboard__hero card">
        <h1>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h1>
        <p>Here's your personalized career command center.</p>
      </header>

      <div className="dashboard__grid">
        <div className="card">
          <h3>Your Skills &amp; Preferred Role</h3>
          <form onSubmit={saveSkills} className="stacked-form">
            <label>Skills (comma-separated)</label>
            <input
              value={skillsInput}
              onChange={e => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, SQL"
            />
            <label>Preferred Job Role</label>
            <input
              value={roleInput}
              onChange={e => setRoleInput(e.target.value)}
              placeholder="Frontend Developer"
            />
            <button className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <Link className="btn btn--ghost" to="/jobs">🔍 Search Jobs</Link>
            <Link className="btn btn--ghost" to="/resume-builder">📄 Build Resume</Link>
            <Link className="btn btn--ghost" to="/interview-prep">🎤 Interview Prep</Link>
            <Link className="btn btn--ghost" to="/bookmarks">🔖 Bookmarks</Link>
            <Link className="btn btn--ghost" to="/applied">📋 Applied Jobs</Link>
          </div>
        </div>

        <div className="card dashboard__ai">
          <h3>Ask the AI Career Guide</h3>
          <form onSubmit={askAI} className="stacked-form">
            <textarea
              rows={3}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="e.g. What skills should I learn to become a Data Analyst?"
            />
            <button className="btn btn--primary" disabled={asking}>
              {asking ? 'Thinking...' : 'Get Guidance'}
            </button>
          </form>
          {answer && <div className="ai-answer">{answer}</div>}
        </div>
      </div>

      <section className="dashboard__recommended">
        <h2>Recommended For You</h2>
        {recommended.length === 0 && (
          <p className="muted">Add your skills above to see personalized job recommendations here.</p>
        )}
        <div className="job-grid">
          {recommended.map(job => (
            <div key={job.id} className="card job-card job-card--compact">
              <h4>{job.title}</h4>
              <p>{job.company} — {job.location}</p>
              <p className="job-card__salary">{job.salaryEstimate}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
