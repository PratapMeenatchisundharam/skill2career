require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

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
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/applied', appliedRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/ai', aiRoutes);

app.use(express.static(frontendDistPath));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Skill2Career API is running' });
});

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Skill2Career backend running on http://localhost:${PORT}`);
});
