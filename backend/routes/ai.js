const express = require('express');
const auth = require('../middleware/auth');
const { readDB } = require('../utils/db');
const { getCareerGuidance } = require('../utils/aiService');

const router = express.Router();

router.post('/career-guidance', auth, async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).json({ message: 'question is required.' });

  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  const answer = await getCareerGuidance(question, user?.profile || {});
  res.json({ question, answer });
});

module.exports = router;
