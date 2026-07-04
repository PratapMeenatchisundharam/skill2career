const express = require('express');
const courses = require('../data/courses.json');

const router = express.Router();

// GET /api/courses/recommend?missingSkills=React,SQL
router.get('/recommend', (req, res) => {
  const { missingSkills = '' } = req.query;
  const skillList = missingSkills.split(',').map(s => s.trim()).filter(Boolean);

  if (!skillList.length) {
    return res.json({ recommendations: {} });
  }

  const recommendations = {};
  skillList.forEach(skill => {
    const match = Object.keys(courses).find(k => k.toLowerCase() === skill.toLowerCase());
    recommendations[skill] = match ? courses[match] : [
      { title: `Learn ${skill} - Beginner to Advanced`, provider: 'Coursera / Udemy (search)', link: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}` }
    ];
  });

  res.json({ recommendations });
});

module.exports = router;
