import React, { useState, useRef } from "react";
import "./Registration.css";

const SLOTS = [
  { label: "সামনের অংশ", hint: "এনআইডির সামনের ছবি" },
  { label: "পেছনের অংশ", hint: "এনআইডির পেছনের ছবি" },
];

function Registration() {
  const [nidNumber, setNidNumber] = useState("");
  const [photos, setPhotos] = useState([null, null]);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const slotRefs = [useRef(null), useRef(null)];

  const handleSlotSelect = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    // Revoke old object URL to avoid memory leaks
    if (photos[index]) URL.revokeObjectURL(photos[index].url);
    const updated = [...photos];
    updated[index] = { url: URL.createObjectURL(file), name: file.name };
    setPhotos(updated);
    // Reset input so same file can be reselected if needed
    e.target.value = "";
  };

  const handleDeletePhoto = (index, e) => {
    e.stopPropagation();
    if (photos[index]) URL.revokeObjectURL(photos[index].url);
    const updated = [...photos];
    updated[index] = null;
    setPhotos(updated);
  };

  const handleReselectPhoto = (index, e) => {
    e.stopPropagation();
    slotRefs[index].current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("রেজিস্ট্রেশন সফল হয়েছে!");
  };

  const closeLightbox = () => setLightboxPhoto(null);

  return (
    <>

        <div className="jonosetu-wrapper">
      
          {/* Main Content */}
          <main className="jonosetu-main">
            <div className="container">
              <div className="row justify-content-center">
                  <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                      <div className="registration-card my-5">
                        {/* Card Top Accent */}
                        <div className="card-body-inner">
                          <div className="card-title-section text-center mb-4">
                            <div className="reg-icon-wrap mb-3">
                              <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                            </div>
                            <h2 className="reg-title">জনসেতু রেজিস্ট্রেশন</h2>
                            <p className="reg-subtitle">
                              আপনার তথ্য দিয়ে নিবন্ধন সম্পন্ন করুন
                            </p>
                          </div>

                          <form onSubmit={handleSubmit}>
                            {/* NID Input */}
                            <div className="form-group-custom mb-4">
                              <label className="form-label-custom" htmlFor="nidNumber">
                                <span className="label-icon"></span> আপনার এনআইডি নম্বর
                              </label>
                              <input
                                type="text"
                                id="nidNumber"
                                className="form-control form-control-custom"
                                placeholder="আপনার এনআইডি নম্বর লিখুন"
                                value={nidNumber}
                                onChange={(e) => setNidNumber(e.target.value)}
                                required
                              />
                            </div>

                            {/* Photo Upload */}
                            <div className="form-group-custom mb-4">

                              <label className="form-label-custom">
                                <span className="label-icon"></span> আপনার এনআইডির ছবি
                                সংযুক্ত করুন
                              </label>
                              <p className="upload-hint">
                                সামনে ও পেছনে — দুটি আলাদা ছবি নির্বাচন করুন
                              </p>

                

                              <div className="photo-slots-grid">
                                <div className="row">
                                {SLOTS.map((slot, index) => (
                                  
                                    <div className="col-lg-6 mb-4">
                                        <div key={index} className="photo-slot">
                                          {/* Hidden per-slot file input */}
                                          <input
                                            type="file"
                                            accept="image/*"
                                            ref={slotRefs[index]}
                                            onChange={(e) => handleSlotSelect(index, e)}
                                            className="d-none"
                                          />

                                          {photos[index] ? (
                                            /* ── Filled slot ── */
                                            <div className="slot-filled">
                                              {/* Preview — click to open lightbox */}
                                              <div
                                                className="slot-preview"
                                                onClick={() => setLightboxPhoto(photos[index].url)}
                                                title="বড় করে দেখতে ক্লিক করুন"
                                              >
                                                <img src={photos[index].url} alt={slot.label} />
                                                <div className="slot-zoom-hint">
                                                  <svg
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="white"
                                                    strokeWidth="2"
                                                  >
                                                    <circle cx="11" cy="11" r="8" />
                                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                                    <line x1="11" y1="8" x2="11" y2="14" />
                                                    <line x1="8" y1="11" x2="14" y2="11" />
                                                  </svg>
                                                </div>
                                              </div>

                                              {/* Filename */}
                                              <p
                                                className="slot-filename"
                                                title={photos[index].name}
                                              >
                                                📄{" "}
                                                {photos[index].name.length > 20
                                                  ? photos[index].name.slice(0, 18) + "…"
                                                  : photos[index].name}
                                              </p>

                                              {/* Action buttons */}
                                              <div className="slot-actions">
                                                <button
                                                  type="button"
                                                  className="slot-btn slot-btn-reselect"
                                                  onClick={(e) => handleReselectPhoto(index, e)}
                                                  title="পরিবর্তন করুন"
                                                >
                                                  <svg
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                  >
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                  </svg>
                                                  পরিবর্তন
                                                </button>
                                                <button
                                                  type="button"
                                                  className="slot-btn slot-btn-delete"
                                                  onClick={(e) => handleDeletePhoto(index, e)}
                                                  title="মুছে ফেলুন"
                                                >
                                                  <svg
                                                    width="13"
                                                    height="13"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2.5"
                                                  >
                                                    <polyline points="3 6 5 6 21 6" />
                                                    <path d="M19 6l-1 14H6L5 6" />
                                                    <path d="M10 11v6" />
                                                    <path d="M14 11v6" />
                                                    <path d="M9 6V4h6v2" />
                                                  </svg>
                                                  মুছুন
                                                </button>
                                              </div>
                                            </div>
                                          ) : (
                                            /* ── Empty slot ── */
                                            <button
                                              type="button"
                                              className="slot-empty"
                                              onClick={() => slotRefs[index].current.click()}
                                            >
                                              <div className="slot-empty-icon">
                                                <svg
                                                  width="26"
                                                  height="26"
                                                  viewBox="0 0 24 24"
                                                  fill="none"
                                                  stroke="currentColor"
                                                  strokeWidth="1.8"
                                                >
                                                  <rect x="3" y="3" width="18" height="18" rx="2" />
                                                  <circle cx="8.5" cy="8.5" r="1.5" />
                                                  <polyline points="21 15 16 10 5 21" />
                                                  <line
                                                    x1="12"
                                                    y1="9"
                                                    x2="12"
                                                    y2="15"
                                                    strokeWidth="2"
                                                  />
                                                  <line
                                                    x1="9"
                                                    y1="12"
                                                    x2="15"
                                                    y2="12"
                                                    strokeWidth="2"
                                                  />
                                                </svg>
                                              </div>
                                              <span className="slot-empty-label">{slot.label}</span>
                                              <span className="slot-empty-hint">{slot.hint}</span>
                                            </button>
                                          )}

                                          {/* Slot badge */}
                                          <div
                                            className={`slot-badge ${photos[index] ? "slot-badge-done" : "slot-badge-pending"}`}
                                          >
                                            {photos[index] ? (
                                              <>
                                                <span>✓</span> যুক্ত হয়েছে
                                              </>
                                            ) : (
                                              <>
                                                <span>+</span> {slot.label}
                                              </>
                                            )}
                                          </div>
                                        </div>
                                    </div>

                                ))}
                                </div>
                              </div>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className="btn btn-register w-100">
                              রেজিস্ট্রেশন করুন
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="ms-2"
                              >
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                              </svg>
                            </button>
                          </form>
                        </div>
                      </div>
                  </div>
              </div>
            </div>
          </main>

          
          {/* Lightbox */}
          {lightboxPhoto && (
            <div className="lightbox-overlay" onClick={closeLightbox}>
              <div
                className="lightbox-content"
                onClick={(e) => e.stopPropagation()}
              >
                <button className="lightbox-close" onClick={closeLightbox}>
                  ✕
                </button>
                <img src={lightboxPhoto} alt="বড় দেখুন" />
              </div>
            </div>
          )}
          
        </div>




    </>


  );
}

export default Registration;