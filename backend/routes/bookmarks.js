const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/auth');
const { readDB, writeDB } = require('../utils/db');
const jobs = require('../data/jobs.json');

const router = express.Router();

router.get('/', auth, (req, res) => {
  const db = readDB();
  const bookmarks = db.bookmarks.filter(b => b.userId === req.user.id);
  const enriched = bookmarks.map(b => ({ ...b, job: jobs.find(j => j.id === b.jobId) }));
  res.json({ count: enriched.length, bookmarks: enriched });
});

router.post('/', auth, (req, res) => {
  const { jobId } = req.body;
  if (!jobId) return res.status(400).json({ message: 'jobId is required.' });
  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ message: 'Job not found.' });

  const db = readDB();
  const exists = db.bookmarks.find(b => b.userId === req.user.id && b.jobId === jobId);
  if (exists) return res.status(409).json({ message: 'Job already bookmarked.' });

  const bookmark = { id: uuidv4(), userId: req.user.id, jobId, createdAt: new Date().toISOString() };
  db.bookmarks.push(bookmark);
  writeDB(db);
  res.status(201).json({ message: 'Job bookmarked.', bookmark });
});

router.delete('/:jobId', auth, (req, res) => {
  const db = readDB();
  const before = db.bookmarks.length;
  db.bookmarks = db.bookmarks.filter(b => !(b.userId === req.user.id && b.jobId === req.params.jobId));
  writeDB(db);
  if (db.bookmarks.length === before) return res.status(404).json({ message: 'Bookmark not found.' });
  res.json({ message: 'Bookmark removed.' });
});

module.exports = router;
