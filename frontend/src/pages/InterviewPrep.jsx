import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';

export default function InterviewPrep() {
  const [searchParams] = useSearchParams();
  const [companyName, setCompanyName] = useState(searchParams.get('company') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCompany = async e => {
    e?.preventDefault();
    if (!companyName.trim()) return;
    setLoading(true);
    setError('');
    try {
      const { data: res } = await api.get(`/companies/${encodeURIComponent(companyName)}`, {
        params: { role }
      });
      setData(res);
    } catch (err) {
      setError('Could not load company data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyName) fetchCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fade-in">
      <h1>Interview Preparation</h1>
      <p className="muted">Enter a company name to see tailored technical &amp; HR interview questions.</p>

      <form className="card search-form" onSubmit={fetchCompany}>
        <div className="search-form__row">
          <div>
            <label>Company Name</label>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Google, Amazon, TCS..." />
          </div>
          <div>
            <label>Job Role (optional)</label>
            <input value={role} onChange={e => setRole(e.target.value)} placeholder="Frontend Developer" />
          </div>
        </div>
        <button className="btn btn--primary" disabled={loading}>
          {loading ? 'Loading...' : 'Get Interview Questions'}
        </button>
      </form>

      {error && <div className="alert alert--error">{error}</div>}

      {data && (
        <div className="interview-results">
          <div className="card">
            <h2>{data.name} {data.rating ? `⭐ ${data.rating}` : ''}</h2>
            <p>{data.about}</p>
            {data.requiredSkills?.length > 0 && (
              <div className="job-card__skills">
                {data.requiredSkills.map(s => <span key={s} className="chip">{s}</span>)}
              </div>
            )}
          </div>

          <div className="interview-grid">
            <div className="card">
              <h3>💻 Technical Questions</h3>
              <ol>
                {data.technicalQuestions?.map((q, i) => <li key={i}>{q}</li>)}
              </ol>
            </div>
            <div className="card">
              <h3>🧑‍💼 HR Questions</h3>
              <ol>
                {data.hrQuestions?.map((q, i) => <li key={i}>{q}</li>)}
              </ol>
            </div>
          </div>

          <div className="card">
            <h3>💡 Tips</h3>
            <ul>
              {data.tips?.map((t, i) => <li key={i}>{t}</li>)}
            </ul>
          </div>

          {data.sampleAnswer && (
            <div className="card">
              <h3>✅ Sample Answer Approach</h3>
              <p>{data.sampleAnswer}</p>
            </div>
          )}

          {data.openJobs?.length > 0 && (
            <div className="card">
              <h3>Open Roles at {data.name}</h3>
              <ul>
                {data.openJobs.map(job => (
                  <li key={job.id}>{job.title} — {job.location} ({job.salaryEstimate})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
