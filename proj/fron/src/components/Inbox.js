import React, { useEffect, useState, useCallback } from 'react';
import { getUserMails } from '../api';
import { useNavigate } from 'react-router-dom';

function Inbox() {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMail, setSelectedMail] = useState(null);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        {/* Email List */}
        <div className="col-md-4 bg-white border-end" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          <div className="p-3 border-bottom">
            <div className="input-group">
              <span className="input-group-text bg-light border-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0"
                placeholder="Search in emails"
              />
            </div>
          </div>
          
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
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {mails.map((mail) => (
                <div
                  key={mail._id}
                  className={`list-group-item list-group-item-action ${
                    selectedMail?._id === mail._id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedMail(mail)}
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

        {/* Email Detail */}
        <div className="col-md-8 bg-white" style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}>
          {selectedMail ? (
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Inbox;
