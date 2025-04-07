// src/components/MailList.js
import React, { useEffect, useState, useCallback } from 'react';
import { getUserMails, addEmail } from '../api';
import { useParams, useNavigate, Link } from 'react-router-dom';

function MailList() {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMail, setSelectedMail] = useState(null);
  const [showComposeForm, setShowComposeForm] = useState(false);
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    body: ''
  });
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const fetchMails = useCallback(async () => {
    try {
      const response = await getUserMails(userId);
      if (response.success) {
        setMails(response.mails || []);
      } else {
        setError('Failed to fetch emails');
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch emails');
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMails();
  }, [fetchMails]);

  const handleCompose = () => {
    setShowComposeForm(true);
    setSelectedMail(null);
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      await addEmail(userId, newEmail.to, newEmail.subject, newEmail.body);
      setShowComposeForm(false);
      setNewEmail({ to: '', subject: '', body: '' });
      fetchMails();
    } catch (err) {
      setError('Failed to send email');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2 bg-white border-end" style={{ height: 'calc(100vh - 56px)' }}>
          <div className="p-3">
            <button
              className="btn btn-primary w-100 mb-3 d-flex align-items-center justify-content-center"
              onClick={handleCompose}
              style={{ borderRadius: '8px' }}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Compose
            </button>
            <div className="list-group">
              <Link
                to="/mails"
                className="list-group-item list-group-item-action active d-flex align-items-center"
                style={{ borderRadius: '8px' }}
              >
                <i className="bi bi-inbox-fill me-2"></i>
                Inbox
              </Link>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="col-md-4 bg-white border-end" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {loading ? (
            <div className="p-5 text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading emails...</p>
            </div>
          ) : error ? (
            <div className="p-3 text-center text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          ) : mails.length === 0 ? (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-inbox" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">No emails found</p>
              <button 
                className="btn btn-outline-primary mt-2"
                onClick={handleCompose}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Compose Email
              </button>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {mails.map((mail) => (
                <div
                  key={mail._id}
                  className={`list-group-item list-group-item-action ${
                    selectedMail?._id === mail._id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedMail(mail);
                    setShowComposeForm(false);
                  }}
                  style={{ 
                    cursor: 'pointer',
                    borderLeft: selectedMail?._id === mail._id ? '4px solid #1a73e8' : 'none',
                    borderRadius: '0'
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="me-2">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <strong>{mail.sender}</strong>
                    </div>
                    <small className="text-muted">
                      {formatDate(mail.createdAt)}
                    </small>
                  </div>
                  <div className="text-truncate fw-bold">{mail.subject}</div>
                  <div className="text-truncate text-muted">{mail.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Email Detail or Compose Form */}
        <div className="col-md-6 bg-white" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {showComposeForm ? (
            <div className="p-4">
              <h3 className="mb-4 d-flex align-items-center">
                <i className="bi bi-pencil-square me-2"></i>
                New Message
              </h3>
              <form onSubmit={handleSendEmail}>
                <div className="mb-3">
                  <label htmlFor="to" className="form-label">To</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="to"
                      value={newEmail.to}
                      onChange={(e) =>
                        setNewEmail({ ...newEmail, to: e.target.value })
                      }
                      required
                      placeholder="Recipient email"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <i className="bi bi-type"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      value={newEmail.subject}
                      onChange={(e) =>
                        setNewEmail({ ...newEmail, subject: e.target.value })
                      }
                      required
                      placeholder="Email subject"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="body" className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    id="body"
                    rows="10"
                    value={newEmail.body}
                    onChange={(e) =>
                      setNewEmail({ ...newEmail, body: e.target.value })
                    }
                    required
                    placeholder="Write your message here..."
                  ></textarea>
                </div>
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    <i className="bi bi-send me-2"></i>
                    Send
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => setShowComposeForm(false)}
                  >
                    <i className="bi bi-x me-2"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : selectedMail ? (
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">{selectedMail.subject}</h3>
                <div className="btn-group">
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-reply"></i>
                  </button>
                  <button className="btn btn-outline-secondary btn-sm">
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <i className="bi bi-person-circle" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <strong>{selectedMail.sender}</strong>
                    <div className="text-muted small">To: {localStorage.getItem('userName')}</div>
                  </div>
                </div>
                <small className="text-muted">
                  {formatDate(selectedMail.createdAt)}
                </small>
              </div>
              <div className="border-top pt-3">{selectedMail.body}</div>
            </div>
          ) : (
            <div className="p-5 text-center text-muted">
              <i className="bi bi-envelope" style={{ fontSize: '3rem' }}></i>
              <p className="mt-3">Select an email to view</p>
              <button 
                className="btn btn-outline-primary mt-2"
                onClick={handleCompose}
              >
                <i className="bi bi-pencil-square me-2"></i>
                Compose Email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MailList;
