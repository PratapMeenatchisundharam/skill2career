import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'];

export default function AppliedJobs() {
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [missingSkills, setMissingSkills] = useState('');
  const [recommendations, setRecommendations] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/applied');
    setApplied(data.applied);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/applied/${id}`, { status });
    load();
  };

  const remove = async id => {
    await api.delete(`/applied/${id}`);
    load();
  };

  const getRecommendations = async e => {
    e.preventDefault();
    if (!missingSkills.trim()) return;
    const { data } = await api.get('/courses/recommend', { params: { missingSkills } });
    setRecommendations(data.recommendations);
  };

  return (
    <div className="fade-in">
      <h1>Applied Jobs Tracker</h1>
      <p className="muted">Track the status of every job you've applied to.</p>

      {loading && <p>Loading...</p>}
      {!loading && applied.length === 0 && <p className="muted">You haven't marked any jobs as applied yet.</p>}

      <div className="job-grid">
        {applied.map(a => a.job && (
          <div className="card job-card" key={a.id}>
            <h3>{a.job.title}</h3>
            <p className="job-card__company">{a.job.company}</p>
            <p className="job-card__location">📍 {a.job.location}</p>
            <label>Status</label>
            <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn--small btn--ghost" onClick={() => remove(a.id)}>Remove</button>
          </div>
        ))}
      </div>

      <section className="card" style={{ marginTop: '2rem' }}>
        <h3>Recommend Courses for Missing Skills</h3>
        <p className="muted">Enter skills you're missing for a role, and get course recommendations to close the gap.</p>
        <form onSubmit={getRecommendations} className="search-form__row">
          <input
            value={missingSkills}
            onChange={e => setMissingSkills(e.target.value)}
            placeholder="React, SQL, AWS"
          />
          <button className="btn btn--primary">Get Courses</button>
        </form>
        {recommendations && (
          <div className="course-recommendations">
            {Object.entries(recommendations).map(([skill, courses]) => (
              <div key={skill}>
                <h4>{skill}</h4>
                <ul>
                  {courses.map((c, i) => (
                    <li key={i}><a href={c.link} target="_blank" rel="noreferrer">{c.title}</a> — {c.provider}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
