import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        <span className="navbar__logo">S2C</span> Skill2Career
      </Link>
      {isAuthenticated && (
        <div className="navbar__links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/jobs">Job Search</Link>
          <Link to="/resume-builder">Resume Builder</Link>
          <Link to="/interview-prep">Interview Prep</Link>
          <Link to="/bookmarks">Bookmarks</Link>
          <Link to="/applied">Applied</Link>
          <div className="navbar__user">
            <span>Hi, {user?.fullName?.split(' ')[0]}</span>
            <button className="btn btn--ghost" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
}
