import React, { useEffect, useState } from "react";
import "./noticeBoard.css";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const fetchNotices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notices");
      const data = await res.json();
      setNotices(data);
      
      // Extract unique categories
      const uniqueCategories = ["all", ...new Set(data.map(notice => notice.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const filteredNotices = selectedCategory === "all" 
    ? notices 
    : notices.filter(notice => notice.category === selectedCategory);

  if (loading) {
    return (
      <div className="notice-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>বিজ্ঞপ্তি লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="notice-wrapper">
      <div className="notice-header">
        <div className="notice-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </div>
        <h1 className="notice-title">সরকারি বিজ্ঞপ্তি বোর্ড</h1>
        <p className="notice-subtitle">
          সকল সরকারি বিজ্ঞপ্তি ও ঘোষণা এখানে দেখুন
        </p>
      </div>

      {/* Category Filter */}
      <div className="notice-category-filter">
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category === "all" ? "সব ক্যাটাগরি" : category}
            </button>
          ))}
        </div>
      </div>

      <div className="notices-grid-container">
        {filteredNotices.length === 0 ? (
          <div className="no-notices">
            <div className="no-notices-icon">📢</div>
            <h3>কোনো বিজ্ঞপ্তি পাওয়া যায়নি</h3>
            <p>এই ক্যাটাগরিতে কোনো বিজ্ঞপ্তি নেই।</p>
          </div>
        ) : (
          <div className="notices-grid">
            {filteredNotices.map((notice) => (
              <div className="notice-card" key={notice._id}>
                <div className="notice-card-header">
                  <div className="notice-category-badge">{notice.category}</div>
                  <div className="notice-date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {new Date(notice.publishedAt).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                <h3 className="notice-title-text">{notice.title}</h3>
                <p className="notice-content">{notice.content}</p>
                
                <div className="notice-footer">
                  <div className="notice-publisher">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    {notice.publishedBy}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeBoard;