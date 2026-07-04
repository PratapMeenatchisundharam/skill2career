import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await api.get('/bookmarks');
    setBookmarks(data.bookmarks);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async jobId => {
    await api.delete(`/bookmarks/${jobId}`);
    load();
  };

  return (
    <div className="fade-in">
      <h1>Bookmarked Jobs</h1>
      <p className="muted">Jobs you've saved to revisit later.</p>
      {loading && <p>Loading...</p>}
      {!loading && bookmarks.length === 0 && <p className="muted">No bookmarks yet. Go bookmark some jobs from the Job Search page!</p>}
      <div className="job-grid">
        {bookmarks.map(b => b.job && (
          <div className="card job-card" key={b.id}>
            <h3>{b.job.title}</h3>
            <p className="job-card__company">{b.job.company}</p>
            <p className="job-card__location">📍 {b.job.location}</p>
            <p className="job-card__salary">💰 {b.job.salaryEstimate}</p>
            <button className="btn btn--small btn--ghost" onClick={() => remove(b.jobId)}>Remove Bookmark</button>
          </div>
        ))}
      </div>
    </div>
  );
}
