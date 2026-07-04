require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const jobRoutes = require('./routes/jobs');
const companyRoutes = require('./routes/companies');
const resumeRoutes = require('./routes/resume');
const bookmarkRoutes = require('./routes/bookmarks');
const appliedRoutes = require('./routes/applied');
const courseRoutes = require('./routes/courses');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// In production, set FRONTEND_URL to your deployed frontend's URL (e.g. https://skill2career.onrender.com)
// so only your frontend can call the API. Falls back to allowing all origins for local dev.
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/applied', appliedRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Skill2Career API is running' });
});

// If a built frontend exists (frontend/dist), serve it — this is what makes the
// single-service Render deployment work: one server serves both the API and the React app.
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Skill2Career backend running on http://localhost:${PORT}`);
});
