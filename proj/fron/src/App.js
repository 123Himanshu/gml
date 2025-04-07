import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/Login';
import Inbox from './components/Inbox';
import MailList from './components/MailList';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Navigation Bar component
const Navbar = () => {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#1a73e8', boxShadow: '0 1px 3px rgba(0,0,0,0.12)' }}>
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="bi bi-envelope-fill me-2"></i>
          <span style={{ fontWeight: 500 }}>Simple Gmail</span>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {userId ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" to="/mails">
                    <i className="bi bi-inbox-fill me-1"></i>
                    Inbox
                  </Link>
                </li>
                <li className="nav-item">
                  <div className="nav-link d-flex align-items-center">
                    <i className="bi bi-person-circle me-1"></i>
                    {userName}
                  </div>
                </li>
                <li className="nav-item">
                  <a 
                    className="nav-link d-flex align-items-center" 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.removeItem('userId');
                      localStorage.removeItem('userName');
                      window.location.href = '/login';
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" to="/signup">
                    <i className="bi bi-person-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Simple Home component
const Home = () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    return <Navigate to="/mails" replace />;
  }
  
  return (
    <div className="container mt-5">
      <div className="card shadow-lg border-0" style={{ borderRadius: '12px' }}>
        <div className="card-body text-center p-5">
          <div className="mb-4">
            <i className="bi bi-envelope-fill" style={{ fontSize: '3rem', color: '#1a73e8' }}></i>
          </div>
          <h1 className="display-4 mb-4" style={{ fontWeight: 500 }}>Welcome to Simple Gmail</h1>
          <p className="lead mb-4 text-muted">A simple email application to manage your messages.</p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary btn-lg px-4 py-2" style={{ borderRadius: '8px' }}>
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline-primary btn-lg px-4 py-2" style={{ borderRadius: '8px' }}>
              <i className="bi bi-person-plus me-2"></i>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/mails"
          element={
            <ProtectedRoute>
              <MailList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox/:userId"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
