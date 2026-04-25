import React, { useEffect, useState } from "react";
import "./noticeBoard.css";

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotices = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      console.error("Error fetching notices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="notice-container">
      <h2>Government Notices</h2>

      {notices.length === 0 ? (
        <p>No notices available</p>
      ) : (
        notices.map((notice) => (
          <div className="notice-card" key={notice._id}>
            <h3>{notice.title}</h3>
            <p className="notice-meta">
              {notice.category} | {new Date(notice.publishedAt).toLocaleDateString()}
            </p>
            <p>{notice.content}</p>
            <span className="publisher">{notice.publishedBy}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default NoticeBoard;