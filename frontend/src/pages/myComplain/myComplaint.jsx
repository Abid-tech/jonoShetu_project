import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./myComplaints.css";

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
    } else {
      setUser(JSON.parse(userData));
      fetchMyComplaints(JSON.parse(userData));
    }
  }, [navigate]);

  const fetchMyComplaints = async (userData) => {
    try {
      const response = await fetch(`http://localhost:5000/complaints/user/${userData.id}`);
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
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
      day: 'numeric'
    });
  };

  const viewDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="my-complaints-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>আপনার অভিযোগ লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="my-complaints-container">
      <div className="container">
        <div className="my-complaints-header">
          <h2>📋 আমার অভিযোগসমূহ</h2>
          <p>আপনার জমা দেওয়া সকল অভিযোগের তালিকা</p>
        </div>

        {complaints.length === 0 ? (
          <div className="no-complaints">
            <div className="no-complaints-icon">📭</div>
            <h3>কোনো অভিযোগ নেই</h3>
            <p>আপনি এখনও কোনো অভিযোগ জমা দেননি।</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/complaint")}
            >
              নতুন অভিযোগ দায়ের করুন
            </button>
          </div>
        ) : (
          <div className="complaints-list">
            {complaints.map((complaint, index) => (
              <div key={complaint._id} className="complaint-card-item">
                <div className="complaint-card-header">
                  <span className="complaint-number">#{index + 1}</span>
                  <div className="complaint-badges">
                    {getPriorityBadge(complaint.priority)}
                    {getStatusBadge(complaint.status)}
                  </div>
                </div>
                <div className="complaint-card-body">
                  <div className="complaint-info">
                    <div className="info-row">
                      <span className="info-label">ট্র্যাকিং আইডি:</span>
                      <code className="tracking-code">{complaint._id}</code>
                    </div>
                    <div className="info-row">
                      <span className="info-label">বিভাগ:</span>
                      <span>{complaint.department}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">জেলা:</span>
                      <span>{complaint.district}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">তারিখ:</span>
                      <span>{formatDate(complaint.createdAt)}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">বিবরণ:</span>
                      <span className="description-preview">
                        {complaint.description.length > 100 
                          ? complaint.description.substring(0, 100) + "..." 
                          : complaint.description}
                      </span>
                    </div>
                  </div>
                  <button 
                    className="view-details-btn"
                    onClick={() => viewDetails(complaint)}
                  >
                    বিস্তারিত দেখুন →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Complaint Details Modal */}
        {showDetails && selectedComplaint && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5>অভিযোগের বিস্তারিত</h5>
                <button className="modal-close" onClick={() => setShowDetails(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <label>ট্র্যাকিং আইডি:</label>
                  <code>{selectedComplaint._id}</code>
                </div>
                <div className="detail-section">
                  <label>বিভাগ:</label>
                  <p>{selectedComplaint.department}</p>
                </div>
                <div className="detail-section">
                  <label>জেলা:</label>
                  <p>{selectedComplaint.district}</p>
                </div>
                <div className="detail-section">
                  <label>অগ্রাধিকার:</label>
                  {getPriorityBadge(selectedComplaint.priority)}
                </div>
                <div className="detail-section">
                  <label>বর্তমান অবস্থা:</label>
                  {getStatusBadge(selectedComplaint.status)}
                </div>
                <div className="detail-section">
                  <label>বিবরণ:</label>
                  <p>{selectedComplaint.description}</p>
                </div>
                {selectedComplaint.assignedTo && (
                  <div className="detail-section assigned-info">
                    <label>দায়িত্বপ্রাপ্ত কর্মকর্তা:</label>
                    <p><strong>{selectedComplaint.assignedTo.name}</strong> - {selectedComplaint.assignedTo.role}</p>
                  </div>
                )}
                {selectedComplaint.remarks && (
                  <div className="detail-section remarks-info">
                    <label>কর্তৃপক্ষের মন্তব্য:</label>
                    <p>{selectedComplaint.remarks}</p>
                  </div>
                )}
                <div className="detail-section">
                  <label>জমার তারিখ:</label>
                  <p>{formatDate(selectedComplaint.createdAt)}</p>
                </div>
                {selectedComplaint.lastUpdated && (
                  <div className="detail-section">
                    <label>শেষ আপডেট:</label>
                    <p>{formatDate(selectedComplaint.lastUpdated)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComplaints;