const express = require('express');
const companies = require('../data/companies.json');
const jobs = require('../data/jobs.json');
const { generateGenericInterviewSet } = require('../utils/aiService');

const router = express.Router();

function findCompany(name) {
  const key = name.trim().toLowerCase();
  return companies[key] || null;
}

router.get('/:name', (req, res) => {
  const { name } = req.params;
  const company = findCompany(name);
  const relatedJobs = jobs.filter(j => j.company.toLowerCase() === name.trim().toLowerCase());

  if (company) {
    return res.json({ ...company, openJobs: relatedJobs, found: true });
  }

  // Fallback: not in curated dataset, generate a generic but useful response
  const role = req.query.role || (relatedJobs[0]?.title ?? '');
  const generic = generateGenericInterviewSet(name, role);
  res.json({ ...generic, openJobs: relatedJobs, found: false });
});

router.get('/', (req, res) => {
  res.json(Object.values(companies));
});

module.exports = router;
