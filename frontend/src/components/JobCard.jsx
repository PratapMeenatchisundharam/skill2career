import React from 'react';

export default function JobCard({ job, onBookmark, onApply, onViewInterview }) {
  return (
    <div className="card job-card">
      <div className="job-card__top">
        <div>
          <h3>{job.title}</h3>
          <p className="job-card__company">{job.company}</p>
        </div>
        {job.matchPercent !== undefined && (
          <div className="job-card__match">{job.matchPercent}% match</div>
        )}
      </div>
      <p className="job-card__location">📍 {job.location}</p>
      <p className="job-card__salary">💰 {job.salaryEstimate}</p>
      <div className="job-card__skills">
        {job.skills.map(s => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>
      <div className="job-card__rating">⭐ {job.rating} company rating</div>
      <div className="job-card__actions">
        <button className="btn btn--small" onClick={() => onBookmark?.(job)}>🔖 Bookmark</button>
        <button className="btn btn--small btn--primary" onClick={() => onApply?.(job)}>Mark Applied</button>
        <button className="btn btn--small btn--ghost" onClick={() => onViewInterview?.(job)}>Interview Prep</button>
      </div>
    </div>
  );
}
