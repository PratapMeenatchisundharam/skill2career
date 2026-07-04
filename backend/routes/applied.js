const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const jobs = require('../data/jobs.json');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const db = readDB();
  const applied = db.appliedJobs.filter(a => a.userId === req.user.id);
  const enriched = applied.map(a => ({ ...a, job: jobs.find(j => j.id === a.jobId) }));
  res.json({ count: enriched.length, applied: enriched });
});

router.post('/', auth, (req, res) => {
  const { jobId, status } = req.body;
  if (!jobId) return res.status(400).json({ message: 'jobId is required.' });
  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ message: 'Job not found.' });

  const db = readDB();
  const exists = db.appliedJobs.find(a => a.userId === req.user.id && a.jobId === jobId);
  if (exists) return res.status(409).json({ message: 'Already tracked as applied.' });

  const entry = {
    id: uuidv4(),
    userId: req.user.id,
    jobId,
    status: status || 'Applied',
    appliedAt: new Date().toISOString()
  };
  db.appliedJobs.push(entry);
  writeDB(db);
  res.status(201).json({ message: 'Job marked as applied.', entry });
});

router.put('/:id', auth, (req, res) => {
  const { status } = req.body;
  const db = readDB();
  const index = db.appliedJobs.findIndex(a => a.id === req.params.id && a.userId === req.user.id);
  if (index === -1) return res.status(404).json({ message: 'Entry not found.' });
  db.appliedJobs[index].status = status || db.appliedJobs[index].status;
  writeDB(db);
  res.json({ message: 'Status updated.', entry: db.appliedJobs[index] });
});

router.delete('/:id', auth, (req, res) => {
  const db = readDB();
  const before = db.appliedJobs.length;
  db.appliedJobs = db.appliedJobs.filter(a => !(a.id === req.params.id && a.userId === req.user.id));
  writeDB(db);
  if (db.appliedJobs.length === before) return res.status(404).json({ message: 'Entry not found.' });
  res.json({ message: 'Entry removed.' });
});

module.exports = router;
