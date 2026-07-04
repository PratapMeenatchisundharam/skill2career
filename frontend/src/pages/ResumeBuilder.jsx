import React, { useEffect, useState } from 'react';
import api from '../api/axios.js';

const emptyEducation = { degree: '', institution: '', year: '' };
const emptyExperience = { role: '', company: '', duration: '', description: '' };
const emptyProject = { title: '', description: '' };

export default function ResumeBuilder() {
  const [form, setForm] = useState({
    companyName: '',
    targetRole: '',
    phone: '',
    skills: '',
    certifications: '',
    education: [emptyEducation],
    experience: [emptyExperience],
    projects: [emptyProject]
  });
  const [generating, setGenerating] = useState(false);
  const [resume, setResume] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);
  const [error, setError] = useState('');

  const loadSaved = async () => {
    const { data } = await api.get('/resume');
    setSavedResumes(data.resumes);
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const updateListItem = (listKey, index, field, value) => {
    setForm(prev => {
      const list = [...prev[listKey]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [listKey]: list };
    });
  };

  const addListItem = (listKey, empty) => {
    setForm(prev => ({ ...prev, [listKey]: [...prev[listKey], empty] }));
  };

  const removeListItem = (listKey, index) => {
    setForm(prev => ({ ...prev, [listKey]: prev[listKey].filter((_, i) => i !== index) }));
  };

  const generate = async e => {
    e.preventDefault();
    setError('');
    if (!form.companyName.trim()) {
      setError('Please enter a target company name.');
      return;
    }
    setGenerating(true);
    try {
      const payload = {
        companyName: form.companyName,
        targetRole: form.targetRole,
        phone: form.phone,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        certifications: form.certifications.split(',').map(s => s.trim()).filter(Boolean),
        education: form.education.filter(e => e.degree || e.institution),
        experience: form.experience.filter(e => e.role || e.company),
        projects: form.projects.filter(p => p.title)
      };
      const { data } = await api.post('/resume/generate', payload);
      setResume(data.resume);
      await loadSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate resume.');
    } finally {
      setGenerating(false);
    }
  };

  const download = async (id, type) => {
    const response = await api.get(`/resume/${id}/${type}`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume.${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="fade-in">
      <h1>Company-Specific Resume Generator</h1>
      <p className="muted">Fill in your details once, then generate a tailored, ATS-friendly resume for any target company.</p>

      <form className="card resume-form" onSubmit={generate}>
        <div className="search-form__row">
          <div>
            <label>Target Company *</label>
            <input value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} placeholder="Google" required />
          </div>
          <div>
            <label>Target Role</label>
            <input value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })} placeholder="Frontend Developer" />
          </div>
          <div>
            <label>Phone</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9xxxxxxxxx" />
          </div>
        </div>

        <label>Skills (comma-separated)</label>
        <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="React, Node.js, SQL" />

        <label>Certifications (comma-separated)</label>
        <input value={form.certifications} onChange={e => setForm({ ...form, certifications: e.target.value })} placeholder="AWS Certified Developer" />

        <fieldset>
          <legend>Education</legend>
          {form.education.map((ed, i) => (
            <div className="dynamic-row" key={i}>
              <input placeholder="Degree" value={ed.degree} onChange={e => updateListItem('education', i, 'degree', e.target.value)} />
              <input placeholder="Institution" value={ed.institution} onChange={e => updateListItem('education', i, 'institution', e.target.value)} />
              <input placeholder="Year" value={ed.year} onChange={e => updateListItem('education', i, 'year', e.target.value)} />
              <button type="button" className="btn btn--small btn--ghost" onClick={() => removeListItem('education', i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn--small" onClick={() => addListItem('education', emptyEducation)}>+ Add Education</button>
        </fieldset>

        <fieldset>
          <legend>Experience</legend>
          {form.experience.map((exp, i) => (
            <div className="dynamic-row dynamic-row--wide" key={i}>
              <input placeholder="Role" value={exp.role} onChange={e => updateListItem('experience', i, 'role', e.target.value)} />
              <input placeholder="Company" value={exp.company} onChange={e => updateListItem('experience', i, 'company', e.target.value)} />
              <input placeholder="Duration" value={exp.duration} onChange={e => updateListItem('experience', i, 'duration', e.target.value)} />
              <input placeholder="Description" value={exp.description} onChange={e => updateListItem('experience', i, 'description', e.target.value)} />
              <button type="button" className="btn btn--small btn--ghost" onClick={() => removeListItem('experience', i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn--small" onClick={() => addListItem('experience', emptyExperience)}>+ Add Experience</button>
        </fieldset>

        <fieldset>
          <legend>Projects</legend>
          {form.projects.map((p, i) => (
            <div className="dynamic-row" key={i}>
              <input placeholder="Project Title" value={p.title} onChange={e => updateListItem('projects', i, 'title', e.target.value)} />
              <input placeholder="Description" value={p.description} onChange={e => updateListItem('projects', i, 'description', e.target.value)} />
              <button type="button" className="btn btn--small btn--ghost" onClick={() => removeListItem('projects', i)}>✕</button>
            </div>
          ))}
          <button type="button" className="btn btn--small" onClick={() => addListItem('projects', emptyProject)}>+ Add Project</button>
        </fieldset>

        {error && <div className="alert alert--error">{error}</div>}
        <button className="btn btn--primary btn--full" disabled={generating}>
          {generating ? 'Generating...' : 'Generate Tailored Resume'}
        </button>
      </form>

      {resume && (
        <div className="card resume-preview">
          <h2>Resume Preview — {resume.targetCompany}</h2>
          <p><strong>{resume.fullName}</strong> | {resume.email} {resume.phone && `| ${resume.phone}`}</p>
          <p className="muted">{resume.summary}</p>
          {resume.matchedSkills?.length > 0 && (
            <p><strong>Matched skills:</strong> {resume.matchedSkills.join(', ')}</p>
          )}
          {resume.missingSkills?.length > 0 && (
            <p><strong>Consider learning:</strong> {resume.missingSkills.join(', ')}</p>
          )}
          <div className="resume-preview__actions">
            <button className="btn btn--primary" onClick={() => download(resume.id, 'pdf')}>⬇ Download PDF</button>
            <button className="btn btn--ghost" onClick={() => download(resume.id, 'docx')}>⬇ Download Word</button>
          </div>
        </div>
      )}

      <section>
        <h2>Your Saved Resumes</h2>
        {savedResumes.length === 0 && <p className="muted">No resumes saved yet.</p>}
        <div className="job-grid">
          {savedResumes.map(r => (
            <div className="card" key={r.id}>
              <h4>{r.targetCompany}</h4>
              <p className="muted">{r.targetRole || 'General role'}</p>
              <div className="resume-preview__actions">
                <button className="btn btn--small btn--primary" onClick={() => download(r.id, 'pdf')}>PDF</button>
                <button className="btn btn--small btn--ghost" onClick={() => download(r.id, 'docx')}>Word</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
