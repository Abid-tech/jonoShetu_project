import React from "react";
import { Link } from "react-router-dom";
import "./header.css"


function Header() {

  return (
    <>
       <section id="header">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <Link className="navbar-brand" to="/">
            জনসেতু
          </Link>

          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <Link className="nav-link" to="/referendrum">
                  গনভোট
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/complaint">
                  অভিযোগ দায়ের
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/registration">
                  রেজিস্ট্রেশন
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  লগইন
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    </section>
    </>
  )
}

export default Header

