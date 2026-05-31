import React, { useState } from 'react';
import './citizenTrack.css';

const CitizenTrack = () => {
  const [trackingId, setTrackingId] = useState('');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const trackComplaint = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      setError('অনুগ্রহ করে ট্র্যাকিং আইডি দিন');
      return;
    }

    setLoading(true);
    setError(null);
    setComplaint(null);

    try {
      const response = await fetch(`http://localhost:5000/complaints/${trackingId}`);
      if (response.ok) {
        const data = await response.json();
        setComplaint(data);
      } else if (response.status === 404) {
        setError('অভিযোগটি পাওয়া যায়নি। সঠিক ট্র্যাকিং আইডি দিন।');
      } else {
        setError('সার্ভার ত্রুটি। পরে আবার চেষ্টা করুন।');
      }
    } catch (err) {
      setError('নেটওয়ার্ক সংযোগ ব্যর্থ হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': { label: 'বিচারাধীন', color: '#ffc107', icon: '⏳' },
      'processing': { label: 'প্রক্রিয়াধীন', color: '#17a2b8', icon: '🔄' },
      'resolved': { label: 'সমাধানকৃত', color: '#28a745', icon: '✅' },
      'rejected': { label: 'নাকচ', color: '#dc3545', icon: '❌' }
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <span className="status-badge" style={{ backgroundColor: s.color }}>
        {s.icon} {s.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'urgent': { label: 'জরুরি', color: '#dc3545' },
      'high': { label: 'উচ্চ', color: '#fd7e14' },
      'medium': { label: 'মাঝারি', color: '#ffc107' },
      'low': { label: 'নিম্ন', color: '#28a745' }
    };
    const p = priorityMap[priority] || priorityMap.medium;
    return (
      <span className="priority-badge" style={{ backgroundColor: p.color }}>
        {p.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="citizen-track">
      <div className="container">
        <div className="track-card">
          <div className="track-header">
            <h2>অভিযোগের অবস্থা জানুন</h2>
            <p>আপনার অভিযোগের ট্র্যাকিং আইডি দিয়ে বর্তমান অবস্থা দেখুন</p>
          </div>

          <form onSubmit={trackComplaint} className="track-form">
            <div className="form-group">
              <label>ট্র্যাকিং আইডি *</label>
              <input
                type="text"
                className="track-input"
                placeholder="যেমন: 60f7a3b5c9d4a32e1c8e4a2b"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                disabled={loading}
              />
              <small className="form-text">
                আপনার অভিযোগ জমা দেওয়ার সময় প্রাপ্ত ট্র্যাকিং আইডি ব্যবহার করুন
              </small>
            </div>
            <button type="submit" className="track-btn" disabled={loading}>
              {loading ? 'অনুসন্ধান করা হচ্ছে...' : 'অভিযোগ ট্র্যাক করুন'}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {complaint && (
            <div className="complaint-details">
              <h3>অভিযোগের বিবরণ</h3>
              
              <div className="details-grid">
                <div className="detail-item">
                  <label>অভিযোগকারী:</label>
                  <span>{complaint.name}</span>
                </div>

                <div className="detail-item">
                  <label>জেলা:</label>
                  <span>{complaint.district}</span>
                </div>

                <div className="detail-item">
                  <label>বিভাগ:</label>
                  <span>{complaint.department}</span>
                </div>

                <div className="detail-item">
                  <label>অগ্রাধিকার:</label>
                  {getPriorityBadge(complaint.priority)}
                </div>

                <div className="detail-item">
                  <label>বর্তমান অবস্থা:</label>
                  {getStatusBadge(complaint.status)}
                </div>

                <div className="detail-item">
                  <label>জমা তারিখ:</label>
                  <span>{formatDate(complaint.createdAt)}</span>
                </div>

                {complaint.lastUpdated && (
                  <div className="detail-item">
                    <label>শেষ আপডেট:</label>
                    <span>{formatDate(complaint.lastUpdated)}</span>
                  </div>
                )}
              </div>

              <div className="detail-section">
                <label>অভিযোগের বিবরণ:</label>
                <p>{complaint.description}</p>
              </div>

              {complaint.assignedTo && complaint.assignedTo.name && (
                <div className="detail-section assigned-personnel">
                  <label>দায়িত্বপ্রাপ্ত কর্মকর্তা:</label>
                  <div className="personnel-info">
                    <div className="personnel-avatar">
                      {complaint.assignedTo.initials}
                    </div>
                    <div className="personnel-details">
                      <strong>{complaint.assignedTo.name}</strong>
                      <span>{complaint.assignedTo.role}</span>
                    </div>
                  </div>
                </div>
              )}

              {complaint.remarks && (
                <div className="detail-section remarks">
                  <label>কর্তৃপক্ষের মন্তব্য:</label>
                  <p>{complaint.remarks}</p>
                </div>
              )}

              {complaint.resolvedAt && (
                <div className="detail-section resolved-info">
                  <label>সমাধানের তারিখ:</label>
                  <p>{formatDate(complaint.resolvedAt)}</p>
                </div>
              )}

              {/* Status Timeline */}
              <div className="timeline">
                <h4>অভিযোগের অগ্রগতি</h4>
                <div className="timeline-steps">
                  <div className={`timeline-step ${complaint.status !== 'pending' ? 'completed' : 'active'}`}>
                    <div className="step-label">অভিযোগ জমা</div>
                    <div className="step-date">{formatDate(complaint.createdAt)}</div>
                  </div>
                  <div className={`timeline-step ${complaint.status === 'processing' || complaint.status === 'resolved' ? 'completed' : complaint.status === 'pending' ? 'active' : ''}`}>
                    <div className="step-label">প্রক্রিয়াধীন</div>
                    {complaint.status !== 'pending' && <div className="step-date">{formatDate(complaint.assignedAt || complaint.lastUpdated)}</div>}
                  </div>
                  <div className={`timeline-step ${complaint.status === 'resolved' ? 'completed' : complaint.status === 'processing' ? 'active' : ''}`}>
                    <div className="step-label">সমাধানকৃত</div>
                    {complaint.resolvedAt && <div className="step-date">{formatDate(complaint.resolvedAt)}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenTrack;