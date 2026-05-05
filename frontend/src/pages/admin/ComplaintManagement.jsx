import React, { useState, useEffect } from 'react';
import './ComplaintManagement.css';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', remarks: '' });
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);

  // Departments list (auto-assigned থেকে আসা)
  const departments = [
    'ঢাকা সিটি কর্পোরেশন',
    'চট্টগ্রাম সিটি কর্পোরেশন',
    'গাজীপুর সিটি কর্পোরেশন',
    'নারায়ণগঞ্জ সিটি কর্পোরেশন',
    'খুলনা সিটি কর্পোরেশন',
    'রাজশাহী সিটি কর্পোরেশন',
    'সিলেট সিটি কর্পোরেশন',
    'বরিশাল সিটি কর্পোরেশন',
    'রংপুর সিটি কর্পোরেশন',
    'ময়মনসিংহ সিটি কর্পোরেশন',
    'সাধারণ প্রশাসন বিভাগ'
  ];

  const priorities = [
    { value: 'urgent', label: 'জরুরি', color: '#dc3545' },
    { value: 'high', label: 'উচ্চ', color: '#fd7e14' },
    { value: 'medium', label: 'মাঝারি', color: '#ffc107' },
    { value: 'low', label: 'নিম্ন', color: '#28a745' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'বিচারাধীন', color: '#ffc107', icon: '⏳' },
    { value: 'processing', label: 'প্রক্রিয়াধীন', color: '#17a2b8', icon: '🔄' },
    { value: 'resolved', label: 'সমাধানকৃত', color: '#28a745', icon: '✅' },
    { value: 'rejected', label: 'নাকচ', color: '#dc3545', icon: '❌' }
  ];

  // Fetch complaints
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/complaints');
      const data = await response.json();
      setComplaints(data);
      setFilteredComplaints(data);
      
      // Calculate stats
      const total = data.length;
      const pending = data.filter(c => c.status === 'pending').length;
      const processing = data.filter(c => c.status === 'processing').length;
      const resolved = data.filter(c => c.status === 'resolved').length;
      const urgent = data.filter(c => c.priority === 'urgent').length;
      setStats({ total, pending, processing, resolved, urgent });
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = [...complaints];
    
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(c => c.department === selectedDepartment);
    }
    
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(c => c.priority === selectedPriority);
    }
    
    // Sort by priority score (highest first) and then by date
    filtered.sort((a, b) => {
      if (a.priorityScore !== b.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    setFilteredComplaints(filtered);
  }, [complaints, selectedDepartment, selectedPriority]);

  // Update complaint status
  const updateStatus = async (id, status, remarks) => {
    try {
      const response = await fetch(`http://localhost:5000/complaints/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, remarks })
      });
      
      if (response.ok) {
        // Refresh complaints list
        fetchComplaints();
        setShowModal(false);
        setSelectedComplaint(null);
        setStatusUpdate({ status: '', remarks: '' });
        alert('স্ট্যাটাস আপডেট করা হয়েছে!');
      } else {
        alert('স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে।');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('সার্ভার ত্রুটি।');
    }
  };

  const openStatusModal = (complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate({ status: complaint.status, remarks: complaint.remarks || '' });
    setShowModal(true);
  };

  const getPriorityBadge = (priority) => {
    const p = priorities.find(p => p.value === priority);
    return (
      <span className="badge" style={{ backgroundColor: p?.color, color: 'white' }}>
        {p?.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const s = statusOptions.find(s => s.value === status);
    return (
      <span className="badge" style={{ backgroundColor: s?.color, color: 'white' }}>
        {s?.icon} {s?.label}
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

  if (loading) {
    return (
      <div className="complaint-management-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>অভিযোগ লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="complaint-management">
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="cm-title">📋 অভিযোগ ব্যবস্থাপনা</h2>
            <p className="cm-subtitle">সকল অভিযোগ দেখুন এবং স্ট্যাটাস আপডেট করুন</p>
          </div>
          <button className="btn btn-success" onClick={fetchComplaints}>
            🔄 রিফ্রেশ
          </button>
        </div>

        {/* Statistics Cards - FEATURE 12 Dashboard */}
        <div className="row mb-4">
          <div className="col-md-2">
            <div className="stat-card bg-white">
              <div className="stat-value">{stats?.total || 0}</div>
              <div className="stat-label">মোট অভিযোগ</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card bg-warning bg-opacity-10">
              <div className="stat-value text-warning">{stats?.pending || 0}</div>
              <div className="stat-label">বিচারাধীন</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card bg-info bg-opacity-10">
              <div className="stat-value text-info">{stats?.processing || 0}</div>
              <div className="stat-label">প্রক্রিয়াধীন</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card bg-success bg-opacity-10">
              <div className="stat-value text-success">{stats?.resolved || 0}</div>
              <div className="stat-label">সমাধানকৃত</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card bg-danger bg-opacity-10">
              <div className="stat-value text-danger">{stats?.urgent || 0}</div>
              <div className="stat-label">জরুরি</div>
            </div>
          </div>
          <div className="col-md-2">
            <div className="stat-card bg-primary bg-opacity-10">
              <div className="stat-value">{departments.length}</div>
              <div className="stat-label">সক্রিয় বিভাগ</div>
            </div>
          </div>
        </div>

        {/* Filters - FEATURE 12 Department Filter */}
        <div className="filters-card mb-4">
          <div className="row">
            <div className="col-md-5">
              <label className="filter-label">বিভাগ ফিল্টার:</label>
              <select 
                className="form-select" 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                <option value="all">সব বিভাগ</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div className="col-md-5">
              <label className="filter-label">অগ্রাধিকার ফিল্টার:</label>
              <select 
                className="form-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="all">সব প্রাইওরিটি</option>
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSelectedDepartment('all');
                  setSelectedPriority('all');
                }}
              >
                রিসেট ফিল্টার
              </button>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="table-card">
          <div className="table-responsive">
            <table className="cm-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>নাম</th>
                  <th>বিভাগ (Auto-assigned)</th>
                  <th>জেলা</th>
                  <th>অগ্রাধিকার</th>
                  <th>স্ট্যাটাস</th>
                  <th>তারিখ</th>
                  <th>অ্যাকশন</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-5">
                      কোন অভিযোগ পাওয়া যায়নি
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint, index) => (
                    <tr key={complaint._id}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{complaint.name}</strong>
                        {complaint.originalDepartment && (
                          <div className="small text-muted">
                            মূল: {complaint.originalDepartment}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="dept-badge">
                          {complaint.department}
                        </span>
                      </td>
                      <td>{complaint.district}</td>
                      <td>{getPriorityBadge(complaint.priority)}</td>
                      <td>{getStatusBadge(complaint.status)}</td>
                      <td className="small">{formatDate(complaint.createdAt)}</td>
                      <td>
                        <button 
                          className="btn-action"
                          onClick={() => openStatusModal(complaint)}
                        >
                          ✏️ স্ট্যাটাস পরিবর্তন
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showModal && selectedComplaint && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>স্ট্যাটাস আপডেট করুন</h5>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">অভিযোগকারী: <strong>{selectedComplaint.name}</strong></label>
              </div>
              <div className="mb-3">
                <label className="form-label">বিভাগ: <strong>{selectedComplaint.department}</strong></label>
              </div>
              <div className="mb-3">
                <label className="form-label">অগ্রাধিকার: <strong>{getPriorityBadge(selectedComplaint.priority)}</strong></label>
              </div>
              <div className="mb-3">
                <label className="form-label">বিবরণ:</label>
                <p className="border p-2 rounded bg-light">{selectedComplaint.description}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">স্ট্যাটাস *</label>
                <select 
                  className="form-select"
                  value={statusUpdate.status}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.icon} {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">মন্তব্য (Remarks)</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  placeholder="কেন এই স্ট্যাটাস দেওয়া হচ্ছে? বিস্তারিত লিখুন..."
                  value={statusUpdate.remarks}
                  onChange={(e) => setStatusUpdate({ ...statusUpdate, remarks: e.target.value })}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                বাতিল
              </button>
              <button 
                className="btn btn-primary"
                onClick={() => updateStatus(selectedComplaint._id, statusUpdate.status, statusUpdate.remarks)}
              >
                আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintManagement;