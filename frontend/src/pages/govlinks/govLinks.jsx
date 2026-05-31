import React, { useEffect, useState } from "react";
import "./govLinks.css";

const GovLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLinks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gov-links");
      const data = await res.json();
      setLinks(data);
    } catch (err) {
      console.error("Error fetching links:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  if (loading) {
    return (
      <div className="gov-links-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>গভর্নমেন্ট লিংক লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="gov-links-wrapper">
      <div className="gov-links-header">
        <div className="gov-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <h1 className="gov-links-title">সরকারি সেবা পোর্টাল</h1>
        <p className="gov-links-subtitle">
          দেশের বিভিন্ন সরকারি সেবার লিংক সহজেই খুঁজুন
        </p>
      </div>

      <div className="links-grid-container">
        <div className="links-grid">
          {links.map((link) => (
            <a
              key={link._id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="link-card"
            >
              
              <div className="link-card-content">
                <h3>{link.name}</h3>
                <p>{link.description}</p>
                <span className="category-badge">{link.category}</span>
              </div>
              <div className="link-card-arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>

      {links.length === 0 && (
        <div className="no-links">
          <div className="no-links-icon">📭</div>
          <h3>কোনো লিংক পাওয়া যায়নি</h3>
          <p>বর্তমানে কোনো সরকারি লিংক উপলব্ধ নেই।</p>
        </div>
      )}
    </div>
  );
};

export default GovLinks;