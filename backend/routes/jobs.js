const express = require('express');
const jobs = require('../data/jobs.json');
const auth = require('../middleware/auth');
const { readDB } = require('../utils/db');

const router = express.Router();

// GET /api/jobs/search?skills=react,node&role=developer&location=bengaluru
router.get('/search', (req, res) => {
  const { skills = '', role = '', location = '' } = req.query;
  const skillList = skills
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  const roleQuery = role.trim().toLowerCase();
  const locationQuery = location.trim().toLowerCase();

  let results = jobs;

  if (skillList.length) {
    results = results
      .map(job => {
        const jobSkills = job.skills.map(s => s.toLowerCase());
        const matchCount = skillList.filter(s => jobSkills.includes(s)).length;
        return { ...job, matchCount, matchPercent: Math.round((matchCount / job.skills.length) * 100) };
      })
      .filter(job => job.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount);
  }

  if (roleQuery) {
    results = results.filter(job => job.title.toLowerCase().includes(roleQuery));
  }

  if (locationQuery) {
    results = results.filter(job => job.location.toLowerCase().includes(locationQuery));
  }

  res.json({ count: results.length, jobs: results });
});

router.get('/', (req, res) => {
  res.json({ count: jobs.length, jobs });
});

router.get('/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found.' });
  res.json(job);
});

// Recommend jobs based on saved profile skills + previous searches (simple relevance ranking)
router.get('/recommend/for-me', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  const skills = (user?.profile?.skills || []).map(s => s.toLowerCase());

  if (!skills.length) {
    return res.json({ count: 0, jobs: [], message: 'Add skills to your profile to get personalized recommendations.' });
  }

  const results = jobs
    .map(job => {
      const jobSkills = job.skills.map(s => s.toLowerCase());
      const matchCount = skills.filter(s => jobSkills.includes(s)).length;
      return { ...job, matchCount };
    })
    .filter(job => job.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 6);

  res.json({ count: results.length, jobs: results });
});

module.exports = router;
