import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./header.css"

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUserName(user.fullName || "ব্যবহারকারী");
        setUserRole(user.role || "citizen");
        setIsAdmin(user.role === "admin" || user.isAdmin || false);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    setIsAdmin(false);
    navigate("/");
  };

  // ADMIN HEADER - Only shows brand and logout (no other navigation)
  if (isAdmin) {
    return (
      <section id="header">
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <Link className="navbar-brand" to="/admin">
              জনসেতু - অ্যাডমিন প্যানেল
            </Link>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <button 
                    className="nav-link dropdown-toggle user-dropdown-btn" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                     {userName.length > 15 ? userName.substring(0, 15) + '...' : userName}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li className="dropdown-item-text">
                      <small className="text-muted">সিস্টেম অ্যাডমিন</small>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                         লগআউট
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section>
    );
  }

  // REGULAR USER HEADER (Citizen & Authority)
  return (
    <>
       <section id="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            জনসেতু
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <Link className="nav-link" to="/referendum">
                  গনভোট
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/legal-chat">
                  আইনি সহায়তা
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/complaint">
                  অভিযোগ দায়ের
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/notice-board">
                   বিজ্ঞপ্তি বোর্ড
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/govt-links">
                   সেবা পোর্টাল
                </Link>
              </li>

             


              {!isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link" to="/registration">
                    রেজিস্ট্রেশন
                  </Link>
                </li>
              )}

              {isLoggedIn ? (
                <>
                  {userRole === "authority" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/authority">
                        ড্যাশবোর্ড
                      </Link>
                    </li>
                  )}
                  
                  {userRole === "citizen" && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/track">
                        ট্র্যাক করুন
                      </Link>
                    </li>
                  )}
                  
                  <li className="nav-item dropdown">
                    <button 
                      className="nav-link dropdown-toggle user-dropdown-btn" 
                      data-bs-toggle="dropdown" 
                      aria-expanded="false"
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                       {userName.length > 15 ? userName.substring(0, 15) + '...' : userName}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li className="dropdown-item-text">
                        <small className="text-muted">রোল: {userRole === "authority" ? "কর্তৃপক্ষ" : "নাগরিক"}</small>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger" 
                          onClick={handleLogout}
                        >
                           লগআউট
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link login-btn" to="/login">
                    লগইন
                  </Link>
                </li>
              )}

            </ul>
          </div>
        </div>
      </nav>
    </section>
    </>
  )
}

export default Header;