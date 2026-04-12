import { useState, useRef, useEffect } from "react";
import "./verify-otp.css";

export default function VerifyOtp() {
  const [digits,    setDigits]    = useState(["", "", "", "", "", ""]);
  const [error,     setError]     = useState("");
  const [success,   setSuccess]   = useState("");
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const maskedPhone = sessionStorage.getItem("otp_phone")    || "";
  const nidNumber   = sessionStorage.getItem("otp_phone_raw") || "";

  const inputRefs = Array.from({ length: 6 }, () => useRef(null));

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDigitChange = (index, value) => {
    // Allow only digits
    const digit = value.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");

    // Auto-advance focus
    if (digit && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { if (i < 6) next[i] = ch; });
    setDigits(next);
    inputRefs[Math.min(pasted.length, 5)].current?.focus();
  };

  const handleVerify = async () => {
    const otp = digits.join("");
    if (otp.length < 6) { setError("৬ সংখ্যার OTP সম্পূর্ণ করুন।"); return; }

    // We need the real phone — ask backend using nidNumber
    setLoading(true);
    setError("");
    try {
      const res  = await fetch("http://localhost:5000/login/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nidNumber, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccess("লগইন সফল হয়েছে! রিডাইরেক্ট হচ্ছে…");
        // Save user to sessionStorage/localStorage as needed
        sessionStorage.setItem("user", JSON.stringify(data.data));
        sessionStorage.removeItem("otp_phone");
        sessionStorage.removeItem("otp_phone_raw");
        setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
      } else {
        setError(data.message || "OTP সঠিক নয়।");
        if (data.error === "OTP_EXPIRED") {
          setDigits(["","","","","",""]);
          setCanResend(true);
          setCountdown(0);
        }
      }
    } catch {
      setError("সার্ভার ত্রুটি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const res  = await fetch("http://localhost:5000/login/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nidNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        setDigits(["","","","","",""]);
        setCountdown(60);
        setCanResend(false);
        inputRefs[0].current?.focus();
      } else {
        setError(data.message || "পুনরায় পাঠানো যায়নি।");
      }
    } catch {
      setError("সার্ভার ত্রুটি।");
    } finally {
      setResending(false);
    }
  };

  const allFilled = digits.every(d => d !== "");

  return (
    <div className="otp-wrapper">
      <div className="otp-card">

        {/* Icon */}
        <div className="otp-icon-wrap">
          <svg width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <line x1="12" y1="18" x2="12" y2="18" strokeLinecap="round" strokeWidth="3"/>
          </svg>
        </div>

        <h2 className="otp-title">OTP যাচাই করুন</h2>
        <p className="otp-subtitle">
          আপনার মোবাইল নম্বরে{" "}
          <strong>{maskedPhone || "নিবন্ধিত নম্বরে"}</strong>{" "}
          একটি ৬ সংখ্যার কোড পাঠানো হয়েছে
        </p>

        {/* Status messages */}
        {error && (
          <div className="otp-banner otp-banner--error">✕ {error}</div>
        )}
        {success && (
          <div className="otp-banner otp-banner--success">✓ {success}</div>
        )}

        {/* 6-digit input boxes */}
        <div className="otp-inputs" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={inputRefs[i]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className={`otp-box${d ? " otp-box--filled" : ""}${error ? " otp-box--error" : ""}`}
              value={d}
              disabled={loading || !!success}
              onChange={e => handleDigitChange(i, e.target.value)}
              onKeyDown={e => handleKeyDown(i, e)}
            />
          ))}
        </div>

        {/* Verify button */}
        <button
          className="otp-btn"
          onClick={handleVerify}
          disabled={loading || !allFilled || !!success}
        >
          {loading ? (
            <span className="otp-spinner" />
          ) : null}
          {loading ? "যাচাই হচ্ছে…" : "নিশ্চিত করুন"}
        </button>

        {/* Resend */}
        <div className="otp-resend">
          {canResend ? (
            <button className="otp-resend-btn" onClick={handleResend} disabled={resending}>
              {resending ? "পাঠানো হচ্ছে…" : "নতুন OTP পাঠান"}
            </button>
          ) : (
            <span className="otp-countdown">
              {countdown} সেকেন্ড পর পুনরায় পাঠাতে পারবেন
            </span>
          )}
        </div>

        {/* Back to login */}
        <div className="otp-back">
          <a href="/login">← লগইন পেজে ফিরুন</a>
        </div>

      </div>
    </div>
  );
}
