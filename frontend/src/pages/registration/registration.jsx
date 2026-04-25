import React, { useState, useRef } from "react";
import "./registration.css";

const SLOTS = [
  { key: "frontImage", label: "সামনের অংশ", hint: "এনআইডির সামনের ছবি" },
  { key: "backImage",  label: "পেছনের অংশ", hint: "এনআইডির পেছনের ছবি" },
];

export default function Registration() {
  const [nidNumber,       setNidNumber]       = useState("");
  const [fullName,        setFullName]        = useState("");
  const [dob,             setDob]             = useState("");
  const [fatherName,      setFatherName]      = useState("");
  const [motherName,      setMotherName]      = useState("");
  const [address,         setAddress]         = useState("");
  const [bloodGroup,      setBloodGroup]      = useState("");
  const [phone,           setPhone]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [photos,          setPhotos]          = useState([null, null]);
  const [fieldErrors,     setFieldErrors]     = useState({});
  const [status,          setStatus]          = useState(null);
  const [lightbox,        setLightbox]        = useState(null);
  const fileRefs = [useRef(), useRef()];

  const handleSlotSelect = (index, file) => {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotos(prev => {
      const next = [...prev];
      next[index] = { file, preview, name: file.name };
      return next;
    });
    setFieldErrors(prev => ({ ...prev, images: undefined }));
  };

  const handleDeletePhoto = (index) => {
    setPhotos(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    if (fileRefs[index].current) fileRefs[index].current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!nidNumber.trim())                    errors.nidNumber       = "এনআইডি নম্বর দিন।";
    if (!fullName.trim())                     errors.fullName        = "পূর্ণ নাম দিন।";
    if (!phone.trim())                        errors.phone           = "মোবাইল নম্বর দিন।";
    else if (!/^01[3-9]\d{8}$/.test(phone.trim())) errors.phone     = "সঠিক বাংলাদেশি নম্বর দিন (যেমন: 01XXXXXXXXX)।";
    if (!password || password.length < 6)    errors.password        = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।";
    if (password !== confirmPassword)         errors.confirmPassword = "পাসওয়ার্ড মিলছে না।";
    if (!photos[0] || !photos[1])             errors.images          = "উভয় ছবি সংযুক্ত করুন।";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setStatus({ type: "loading", message: "তথ্য সংরক্ষণ করা হচ্ছে…" });

    try {
      const payload = new FormData();
      payload.append("nidNumber",   nidNumber.trim());
      payload.append("fullName",    fullName.trim());
      payload.append("dateOfBirth", dob);
      payload.append("fatherName",  fatherName);
      payload.append("motherName",  motherName);
      payload.append("address",     address);
      payload.append("bloodGroup",  bloodGroup);
      payload.append("phone",       phone.trim());
      payload.append("password",    password);
      payload.append("frontImage",  photos[0].file);
      payload.append("backImage",   photos[1].file);

      const res  = await fetch("http://localhost:5000/register", { method: "POST", body: payload });
      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "রেজিস্ট্রেশন সফল হয়েছে!" });
        setTimeout(() => { window.location.href = "/login"; }, 2000);
      } else if (data.error === "ALREADY_REGISTERED") {
        setStatus({ type: "duplicate", message: data.message });
      } else {
        setStatus({ type: "error", message: data.message || "সমস্যা হয়েছে।" });
      }
    } catch {
      setStatus({ type: "error", message: "সার্ভার ত্রুটি। আবার চেষ্টা করুন।" });
    }
  };

  const loading = status?.type === "loading";

  return (
    <div
      className="jonosetu-wrapper d-flex flex-column align-items-center justify-content-center py-5 px-3"
      
    >
      <div className="registration-card">
        <div className="card-body-inner">

          {/* Header */}
          <div className="text-center mb-4">
            <div className="reg-icon-wrap mb-3">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h1 className="reg-title">নিবন্ধন করুন</h1>
            <p className="reg-subtitle">আপনার তথ্য পূরণ করুন এবং এনআইডির ছবি দিন</p>
          </div>

          {/* Status banner */}
          {status && status.type !== "loading" && (
            <div className={`status-banner status-banner--${status.type}`}>
              <span className="status-banner__icon">
                {status.type === "success" ? "✓" : status.type === "duplicate" ? "⚠" : "✕"}
              </span>
              {status.message}
              {status.type === "duplicate" && (
                <a href="/login" className="status-banner__link">লগইন করুন →</a>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* NID Number */}
            <div className="mb-3">
              <label className="form-label-custom">এনআইডি নম্বর *</label>
              <input
                className={`form-control-custom${fieldErrors.nidNumber ? " input-error" : ""}`}
                placeholder="১৭ সংখ্যার এনআইডি নম্বর"
                value={nidNumber}
                disabled={loading}
                onChange={e => { setNidNumber(e.target.value); setFieldErrors(p => ({ ...p, nidNumber: undefined })); }}
              />
              {fieldErrors.nidNumber && <p className="field-error">{fieldErrors.nidNumber}</p>}
            </div>

            {/* Full Name */}
            <div className="mb-3">
              <label className="form-label-custom">পূর্ণ নাম *</label>
              <input
                className={`form-control-custom${fieldErrors.fullName ? " input-error" : ""}`}
                placeholder="এনআইডি অনুযায়ী পূর্ণ নাম"
                value={fullName}
                disabled={loading}
                onChange={e => { setFullName(e.target.value); setFieldErrors(p => ({ ...p, fullName: undefined })); }}
              />
              {fieldErrors.fullName && <p className="field-error">{fieldErrors.fullName}</p>}
            </div>

            {/* DOB + Blood Group */}
            <div className="row g-2 mb-3">
              <div className="col-7">
                <label className="form-label-custom">জন্ম তারিখ</label>
                <input
                  type="date"
                  className="form-control-custom"
                  value={dob}
                  disabled={loading}
                  onChange={e => setDob(e.target.value)}
                />
              </div>
              <div className="col-5">
                <label className="form-label-custom">রক্তের গ্রুপ</label>
                <select
                  className="form-control-custom"
                  value={bloodGroup}
                  disabled={loading}
                  onChange={e => setBloodGroup(e.target.value)}
                >
                  <option value="">বেছে নিন</option>
                  {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Father Name */}
            <div className="mb-3">
              <label className="form-label-custom">পিতার নাম</label>
              <input
                className="form-control-custom"
                placeholder="পিতার নাম"
                value={fatherName}
                disabled={loading}
                onChange={e => setFatherName(e.target.value)}
              />
            </div>

            {/* Mother Name */}
            <div className="mb-3">
              <label className="form-label-custom">মাতার নাম</label>
              <input
                className="form-control-custom"
                placeholder="মাতার নাম"
                value={motherName}
                disabled={loading}
                onChange={e => setMotherName(e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label-custom">ঠিকানা</label>
              <textarea
                className="form-control-custom"
                placeholder="বর্তমান ঠিকানা"
                rows={3}
                value={address}
                disabled={loading}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label-custom">মোবাইল নম্বর *</label>
              <input
                className={`form-control-custom${fieldErrors.phone ? " input-error" : ""}`}
                placeholder="01XXXXXXXXX"
                value={phone}
                maxLength={11}
                disabled={loading}
                onChange={e => { setPhone(e.target.value); setFieldErrors(p => ({ ...p, phone: undefined })); }}
              />
              {fieldErrors.phone
                ? <p className="field-error">{fieldErrors.phone}</p>
                : <p style={{ fontSize: "0.78rem", color: "var(--text-light)", margin: "4px 0 0" }}>
                    লগইনের সময় OTP এই নম্বরে যাবে
                  </p>
              }
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label-custom">পাসওয়ার্ড *</label>
              <input
                type="password"
                className={`form-control-custom${fieldErrors.password ? " input-error" : ""}`}
                placeholder="কমপক্ষে ৬ অক্ষর"
                value={password}
                disabled={loading}
                onChange={e => { setPassword(e.target.value); setFieldErrors(p => ({ ...p, password: undefined })); }}
              />
              {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label-custom">পাসওয়ার্ড নিশ্চিত করুন *</label>
              <input
                type="password"
                className={`form-control-custom${fieldErrors.confirmPassword ? " input-error" : ""}`}
                placeholder="পাসওয়ার্ড আবার লিখুন"
                value={confirmPassword}
                disabled={loading}
                onChange={e => { setConfirmPassword(e.target.value); setFieldErrors(p => ({ ...p, confirmPassword: undefined })); }}
              />
              {fieldErrors.confirmPassword && <p className="field-error">{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Photo Upload */}
            <div className="mb-3">
              <label className="form-label-custom">এনআইডির ছবি *</label>
              <p className="upload-hint">সামনের ও পেছনের ছবি আলাদাভাবে দিন (JPG/PNG, সর্বোচ্চ ৫MB)</p>
              {fieldErrors.images && <p className="field-error">{fieldErrors.images}</p>}
              <div className="row g-2">
                {SLOTS.map((slot, i) => (
                  <div className="col-6" key={slot.key}>
                    <input
                      ref={fileRefs[i]}
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={e => handleSlotSelect(i, e.target.files[0])}
                    />
                    <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-mid)", marginBottom: 6 }}>
                      {slot.label}
                    </p>
                    {!photos[i] ? (
                      <button
                        type="button"
                        className="slot-empty w-100"
                        disabled={loading}
                        onClick={() => fileRefs[i].current.click()}
                      >
                        <span className="slot-empty-icon">
                          <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="3"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                          </svg>
                        </span>
                        <span className="slot-empty-label">{slot.hint}</span>
                        <span className="slot-empty-hint">ক্লিক করুন</span>
                      </button>
                    ) : (
                      <div className="slot-filled">
                        <div className="slot-preview" onClick={() => setLightbox(photos[i].preview)}>
                          <img src={photos[i].preview} alt={slot.label} />
                          <div className="slot-zoom-hint">
                            <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="11" cy="11" r="8"/>
                              <path d="M21 21l-4.35-4.35"/>
                            </svg>
                          </div>
                        </div>
                        <p className="slot-filename">{photos[i].name}</p>
                        <div className="slot-actions">
                          <button type="button" className="slot-btn slot-btn-reselect" disabled={loading}
                                  onClick={() => fileRefs[i].current.click()}>পরিবর্তন</button>
                          <button type="button" className="slot-btn slot-btn-delete" disabled={loading}
                                  onClick={() => handleDeletePhoto(i)}>মুছুন</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="btn-register w-100 mt-2" disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? status.message : "নিবন্ধন করুন"}
            </button>

          </form>

          <p className="text-center mt-3 login-hint">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <a href="/login" className="login-hint__link">লগইন করুন</a>
          </p>

        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightbox} alt="preview" />
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
