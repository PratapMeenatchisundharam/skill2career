const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const companies = require('../data/companies.json');
const { generateGenericInterviewSet, generateTailoredSummary } = require('../utils/aiService');
const { buildResumePDF, buildResumeDocx } = require('../utils/resumeDocs');

const router = express.Router();

function getCompanyData(name, role) {
  const key = name.trim().toLowerCase();
  return companies[key] || generateGenericInterviewSet(name, role);
}

// Generate a tailored, ATS-friendly resume for a specific company + role
router.post('/generate', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const {
    companyName,
    targetRole,
    skills,
    education,
    experience,
    projects,
    certifications,
    phone
  } = req.body;

  if (!companyName) return res.status(400).json({ message: 'companyName is required.' });

  const profile = {
    skills: skills?.length ? skills : user.profile.skills,
    preferredRole: targetRole || user.profile.preferredRole
  };

  const company = getCompanyData(companyName, profile.preferredRole);
  const { summary, matchedSkills, missingSkills } = generateTailoredSummary(profile, company, profile.preferredRole);

  const resume = {
    id: uuidv4(),
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: phone || '',
    targetCompany: company.name,
    targetRole: profile.preferredRole,
    summary,
    skills: profile.skills,
    matchedSkills,
    missingSkills,
    education: education?.length ? education : user.profile.education,
    experience: experience?.length ? experience : user.profile.experience,
    projects: projects?.length ? projects : user.profile.projects,
    certifications: certifications?.length ? certifications : user.profile.certifications,
    createdAt: new Date().toISOString()
  };

  db.resumes.push(resume);
  writeDB(db);

  res.status(201).json({ message: 'Resume generated successfully.', resume });
});

// List all saved resumes for the logged-in user
router.get('/', auth, (req, res) => {
  const db = readDB();
  const resumes = db.resumes.filter(r => r.userId === req.user.id);
  res.json({ count: resumes.length, resumes });
});

router.get('/:id', auth, (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!resume) return res.status(404).json({ message: 'Resume not found.' });
  res.json(resume);
});

router.delete('/:id', auth, (req, res) => {
  const db = readDB();
  const before = db.resumes.length;
  db.resumes = db.resumes.filter(r => !(r.id === req.params.id && r.userId === req.user.id));
  writeDB(db);
  if (db.resumes.length === before) return res.status(404).json({ message: 'Resume not found.' });
  res.json({ message: 'Resume deleted.' });
});

router.get('/:id/pdf', auth, (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!resume) return res.status(404).json({ message: 'Resume not found.' });
  buildResumePDF(resume, res);
});

router.get('/:id/docx', auth, async (req, res) => {
  const db = readDB();
  const resume = db.resumes.find(r => r.id === req.params.id && r.userId === req.user.id);
  if (!resume) return res.status(404).json({ message: 'Resume not found.' });
  await buildResumeDocx(resume, res);
});

module.exports = router;
