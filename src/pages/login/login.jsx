import { useState } from "react";
import "./login.css";

const LoginPage = () => {
  const [nidNumber, setNidNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nidNumber, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save masked phone + raw nid for OTP page
        sessionStorage.setItem("otp_phone", data.phone);
        sessionStorage.setItem("otp_phone_raw", nidNumber);

        // 🔥 Redirect to OTP page
        window.location.href = "/verify-otp";
      } else {
        setError(data.message || "লগইন ব্যর্থ");
      }
    } catch (err) {
      setError("সার্ভার ত্রুটি, আবার চেষ্টা করুন");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper d-flex align-items-center justify-content-center">
      <div className="card loginCard">

        <div className="text-center mb-4">
          <div className="iconCircle mb-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="green"
              strokeWidth="2"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h3 className="title">জনসেবা লগইন</h3>
          <p className="subtitle">
            আপনার তথ্য দিয়ে লগইন সম্পন্ন করুন
          </p>
        </div>

        {/* 🔥 FORM */}
        <form onSubmit={handleLogin}>

          {/* Error Message */}
          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          {/* NID */}
          <div className="mb-3">
            <label className="form-label fw-bold">এনআইডি *</label>
            <input
              type="text"
              className="form-control input"
              placeholder="আপনার এনআইডি নম্বর"
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label fw-bold">পাসওয়ার্ড *</label>
            <input
              type="password"
              className="form-control input"
              placeholder="আপনার পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="btn w-100 loginBtn"
            disabled={loading}
          >
            {loading ? "লোড হচ্ছে..." : "লগইন করুন"}
          </button>

          <div className="text-center mt-3">
            <small className="forgot">পাসওয়ার্ড ভুলে গেছেন?</small>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;