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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="links-container">
      <h2>Government Services</h2>

      <div className="links-grid">
        {links.map((link) => (
          <a
            key={link._id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-card"
          >
            <h3>{link.name}</h3>
            <p>{link.description}</p>
            <span className="category">{link.category}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default GovLinks;