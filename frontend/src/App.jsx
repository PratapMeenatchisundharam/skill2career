import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import CursorEffect from './components/CursorEffect.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import JobSearch from './pages/JobSearch.jsx';
import InterviewPrep from './pages/InterviewPrep.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import Bookmarks from './pages/Bookmarks.jsx';
import AppliedJobs from './pages/AppliedJobs.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <CursorEffect />
      <Navbar />
      <div className="page-transition-wrapper">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/jobs" element={<PrivateRoute><JobSearch /></PrivateRoute>} />
          <Route path="/interview-prep" element={<PrivateRoute><InterviewPrep /></PrivateRoute>} />
          <Route path="/resume-builder" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
          <Route path="/bookmarks" element={<PrivateRoute><Bookmarks /></PrivateRoute>} />
          <Route path="/applied" element={<PrivateRoute><AppliedJobs /></PrivateRoute>} />
        </Routes>
      </div>
    </div>
  );
}
