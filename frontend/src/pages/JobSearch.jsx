import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import JobCard from '../components/JobCard.jsx';

export default function JobSearch() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState('');

  const search = async e => {
    e?.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get('/jobs/search', {
        params: { skills, role, location }
      });
      setJobs(data.jobs);
    } finally {
      setLoading(false);
    }
  };

  const bookmark = async job => {
    try {
      await api.post('/bookmarks', { jobId: job.id });
      setMessage(`Bookmarked "${job.title}" at ${job.company}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not bookmark job.');
    }
    setTimeout(() => setMessage(''), 2500);
  };

  const apply = async job => {
    try {
      await api.post('/applied', { jobId: job.id });
      setMessage(`Marked "${job.title}" as applied.`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not track application.');
    }
    setTimeout(() => setMessage(''), 2500);
  };

  const viewInterview = job => {
    navigate(`/interview-prep?company=${encodeURIComponent(job.company)}&role=${encodeURIComponent(job.title)}`);
  };

  return (
    <div className="fade-in">
      <h1>Skill-Based Job Search</h1>
      <p className="muted">Enter your skills, qualifications, and preferred role to find matching openings.</p>

      <form className="card search-form" onSubmit={search}>
        <div className="search-form__row">
          <div>
            <label>Skills (comma-separated)</label>
            <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="React, Node.js, SQL" />
          </div>
          <div>
            <label>Preferred Role</label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Frontend Developer" />
          </div>
          <div>
            <label>Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Bengaluru" />
          </div>
        </div>
        <button className="btn btn--primary" disabled={loading}>
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </form>

      {message && <div className="toast">{message}</div>}

      {searched && !loading && jobs.length === 0 && (
        <p className="muted">No matching jobs found. Try broadening your skills or role.</p>
      )}

      <div className="job-grid">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onBookmark={bookmark} onApply={apply} onViewInterview={viewInterview} />
        ))}
      </div>
    </div>
  );
}
