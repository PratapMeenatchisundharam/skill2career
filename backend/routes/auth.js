const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { readDB, writeDB } = require('../utils/db');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Full name, email, and password are all required.' });
    }
    const db = readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: uuidv4(),
      fullName,
      email,
      password: hashed,
      profile: {
        skills: [],
        qualifications: '',
        preferredRole: '',
        education: [],
        experience: [],
        projects: [],
        certifications: []
      },
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDB(db);

    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET || 'skill2career_super_secret_change_me',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful.',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET || 'skill2career_super_secret_change_me',
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful.',
      token,
      user: { id: user.id, fullName: user.fullName, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed.' });
  }
});

// Get / update profile (skills, qualifications, preferred role, education, experience etc.)
router.get('/profile', auth, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  const { password, ...safeUser } = user;
  res.json(safeUser);
});

router.put('/profile', auth, (req, res) => {
  const db = readDB();
  const userIndex = db.users.findIndex(u => u.id === req.user.id);
  if (userIndex === -1) return res.status(404).json({ message: 'User not found.' });
  db.users[userIndex].profile = { ...db.users[userIndex].profile, ...req.body };
  writeDB(db);
  const { password, ...safeUser } = db.users[userIndex];
  res.json(safeUser);
});

module.exports = router;
