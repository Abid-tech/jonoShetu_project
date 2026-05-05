import { React, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./complaint.css";
import "./complaint.css";


const DEPARTMENTS = ["ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ"];

const DISTRICTS = [
  "ঢাকা", "গাজীপুর", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নারায়ণগঞ্জ",
  "নরসিংদী", "টাঙ্গাইল", "শরীয়তপুর", "ফরিদপুর", "রাজবাড়ী", "চট্টগ্রাম",
  "কুমিল্লা", "ফেনী", "ব্রাহ্মণবাড়িয়া", "চাঁদপুর", "লক্ষ্মীপুর", "নোয়াখালী",
  "রাঙ্গামাটি", "বান্দরবান", "খাগড়াছড়ি", "কক্সবাজার", "বরিশাল", "বরগুনা",
  "ভোলা", "ঝালকাঠি", "পটুয়াখালী", "পিরোজপুর", "রাজশাহী", "বগুরা", "জয়পুরহাট",
  "নওগাঁ", "নাটোর", "সিরাজগঞ্জ", "পাবনা", "খুলনা", "যশোর", "চুয়াডাঙ্গা",
  "ঝিনাইদহ", "কুষ্টিয়া", "মাগুরা", "মেহেরপুর", "নড়াইল", "সাতক্ষীরা", "বাগেরহাট",
  "সিলেট", "সুনামগঞ্জ", "মৌলভীবাজার", "হবিগঞ্জ", "ময়মনসিংহ", "জামালপুর",
  "নেত্রকোনা", "শেরপুর", "রংপুর", "দিনাজপুর", "গাইবান্ধা", "কুড়িগ্রাম",
  "লালমনিরহাট", "নীলফামারী", "পঞ্চগড়", "ঠাকুরগাঁও"
];

// Priority color mapping
const priorityColors = {
  urgent: { bg: '#ffebee', text: '#c62828', label: 'জরুরি' },
  high: { bg: '#fff3e0', text: '#ef6c00', label: 'উচ্চ' },
  medium: { bg: '#e8f5e9', text: '#2e7d32', label: 'মাঝারি' },
  low: { bg: '#e3f2fd', text: '#1565c0', label: 'নিম্ন' }
};

const MapSelector = ({ location, setLocation }) => {
  const mapEvents = useMapEvents({
    click(e) {
      setLocation(e.latlng);
    }
  });
  return location ? <Marker position={location} /> : null;
};

function Complaint() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [district, setDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // { type, message, data }
  const [trackingId, setTrackingId] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setTrackingId(null);
    
    // Prepare complaint data
    const complaintData = {
      name: name.trim(),
      department: department,
      district: district,
      description: description.trim(),
      location: location ? { lat: location.lat, lng: location.lng } : null

    };
    
    try {
      const response = await fetch("http://localhost:5000/complaints", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(complaintData),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Store the tracking ID (MongoDB _id)
        const trackingId = result.data._id;
        setTrackingId(trackingId);
        
        // FEATURE 12 & 13: Display auto-assigned department and priority
        setSubmitStatus({
          type: "success",
          message: "অভিযোগ সফলভাবে জমা হয়েছে!",
          data: result.meta
        });
        
        // Reset form
        setName("");
        setDepartment("");
        setDistrict("");
        setDescription("");
        setLocation(null);
        
        // Auto hide success message after 10 seconds (longer for tracking ID)
        setTimeout(() => {
          setSubmitStatus(null);
          // Don't clear tracking ID immediately - let user copy it
        }, 10000);
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "অভিযোগ জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setSubmitStatus({
        type: "error",
        message: "সার্ভার সংযোগ ব্যর্থ হয়েছে। নেটওয়ার্ক চেক করুন।"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyTrackingId = () => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId);
      alert("ট্র্যাকিং আইডি কপি করা হয়েছে!");
    }
  };
  
  // Get priority info based on selected department & district (preview)
  const getPreviewPriority = () => {
    if (!department || !district) return null;
    
    // Simple preview logic (matches backend calculation)
    let score = 0;
    const highPriorityDepts = ["ঢাকা", "চট্টগ্রাম"];
    const urgentDistricts = ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "চট্টগ্রাম"];
    
    if (highPriorityDepts.includes(department)) score += 30;
    if (urgentDistricts.includes(district)) score += 25;
    
    if (score >= 50) return priorityColors.urgent;
    if (score >= 25) return priorityColors.high;
    if (score >= 10) return priorityColors.medium;
    return priorityColors.low;
  };
  
  const previewPriority = getPreviewPriority();
  
  return (
    <div className="complaint-wrapper">
      <main className="complaint-main">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="complaint-card my-5">
                <div className="card-body-inner">
                  <div className="card-title-section text-center mb-4">
                    <div className="complaint-icon-wrap mb-3">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <h2 className="complaint-title">অভিযোগ দায়ের</h2>
                    <p className="complaint-subtitle">
                      আপনার তথ্য দিয়ে অভিযোগ জমা দিন
                    </p>
                  </div>
                  
                  {/* Success Message with Tracking ID */}
                  {submitStatus && submitStatus.type === 'success' && (
                    <div className="success-card mb-4">
                      <div className="success-header">
                        <span className="success-icon">✅</span>
                        <h4>অভিযোগ সফলভাবে জমা হয়েছে!</h4>
                      </div>
                      <div className="tracking-section">
                        <label>আপনার ট্র্যাকিং আইডি:</label>
                        <div className="tracking-id-box">
                          <code className="tracking-id">{trackingId}</code>
                          <button 
                            className="copy-btn"
                            onClick={copyTrackingId}
                            title="কপি করুন"
                          >
                            📋 কপি
                          </button>
                        </div>
                        <p className="tracking-note">
                          ⚠️ এই আইডি সংরক্ষণ করুন। এই আইডি দিয়ে আপনি আপনার অভিযোগের অবস্থা জানতে পারবেন।
                        </p>
                      </div>
                      <div className="assignment-info">
                        <div className="info-row">
                          <span>নিয়োজিত বিভাগ:</span>
                          <strong>{submitStatus.data.assignedDepartment}</strong>
                        </div>
                        <div className="info-row">
                          <span>অগ্রাধিকার:</span>
                          <span className={`priority-tag priority-${submitStatus.data.priority}`}>
                            {submitStatus.data.priority === 'urgent' ? 'জরুরি' : 
                             submitStatus.data.priority === 'high' ? 'উচ্চ' : 
                             submitStatus.data.priority === 'medium' ? 'মাঝারি' : 'নিম্ন'}
                          </span>
                        </div>
                      </div>
                      <button 
                        className="track-now-btn"
                        onClick={() => window.location.href = '/track'}
                      >
                        🔍 এখনই ট্র্যাক করুন
                      </button>
                    </div>
                  )}
                  
                  {/* Error Message */}
                  {submitStatus && submitStatus.type === 'error' && (
                    <div className="alert alert-danger mb-3" role="alert">
                      <strong>✕</strong> {submitStatus.message}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="form-group-custom mb-3">
                      <label className="form-label-custom" htmlFor="name">
                        নাম *
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="form-control form-control-custom"
                        placeholder="আপনার নাম লিখুন"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    {/* Department */}
                    <div className="form-group-custom mb-3">
                      <label className="form-label-custom" htmlFor="department">
                        বিভাগ *
                      </label>
                      <select
                        id="department"
                        className="form-control form-control-custom"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="">বিভাগ নির্বাচন করুন</option>
                        {DEPARTMENTS.map((dep, i) => (
                          <option key={i} value={dep}>
                            {dep}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* District */}
                    <div className="form-group-custom mb-3">
                      <label className="form-label-custom" htmlFor="district">
                        জেলা *
                      </label>
                      <select
                        id="district"
                        className="form-control form-control-custom"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        required
                        disabled={loading}
                      >
                        <option value="">জেলা নির্বাচন করুন</option>
                        {DISTRICTS.map((dist, i) => (
                          <option key={i} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Priority Preview */}
                    {previewPriority && (
                      <div className="mb-3 p-2 rounded text-center" style={{ backgroundColor: previewPriority.bg }}>
                        <small className="text-muted">পূর্বাভাসিত অগ্রাধিকার:</small>
                        <span className="badge ms-2" style={{ backgroundColor: previewPriority.text }}>
                          {previewPriority.label}
                        </span>
                        <p className="small text-muted mt-1 mb-0">
                          * আপনার অভিযোগের ধরণ ও এলাকা অনুযায়ী স্বয়ংক্রিয়ভাবে অগ্রাধিকার নির্ধারণ করা হবে
                        </p>
                      </div>
                    )}
                    
                    {/* Description */}
                    <div className="form-group-custom mb-3">
                      <label className="form-label-custom" htmlFor="description">
                        বিস্তারিত বিবরণ *
                      </label>
                      <textarea
                        id="description"
                        className="form-control form-control-custom"
                        placeholder="আপনার অভিযোগের বিস্তারিত লিখুন (প্রয়োজনে ছবি সংযুক্ত করুন)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        required
                        disabled={loading}
                      />
                    </div>
                    
                    {/* Location */}
                    <div className="form-group-custom mb-4">
                      <label className="form-label-custom">লোকেশন (ঐচ্ছিক)</label>
                      <MapContainer 
                        center={[23.685, 90.3563]} 
                        zoom={7} 
                        style={{ height: 300, width: '100%', borderRadius: '8px' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution="&copy; OpenStreetMap contributors"
                        />
                        <MapSelector location={location} setLocation={setLocation} />
                      </MapContainer>
                      {location && (
                        <div className="mt-2 small text-success">
                          ✓ লোকেশন নির্বাচিত: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                        </div>
                      )}
                    </div>
                    
                    {/* Auto-assignment notice */}
                    <div className="alert alert-info mb-3 small" role="alert">
                      <strong>ℹ️ তথ্য:</strong> আপনার জেলা অনুযায়ী স্বয়ংক্রিয়ভাবে সংশ্লিষ্ট বিভাগে অভিযোগটি পাঠানো হবে। 
                      অভিযোগ জমা দেওয়ার পর আপনি একটি ট্র্যাকিং আইডি পাবেন যা দিয়ে আপনার অভিযোগের অবস্থা জানতে পারবেন।
                    </div>
                    
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-submit w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          জমা দেওয়া হচ্ছে...
                        </>
                      ) : (
                        "অভিযোগ দায়ের করুন"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Complaint;