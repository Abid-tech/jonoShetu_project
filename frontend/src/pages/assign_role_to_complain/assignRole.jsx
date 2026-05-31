import React, { useState } from "react";
import "./assignRole.css";
import { useLocation } from "react-router-dom";


const DEPARTMENTS = ["ঢাকা","চট্টগ্রাম","খুলনা","রাজশাহী","সিলেট","বরিশাল","রংপুর","ময়মনসিংহ"];

const INITIAL_PERSONNEL = [
  { id: 1, name: "মোঃ রফিকুল ইসলাম", role: "সিনিয়র পরিদর্শক",    initials: "রই", busy: false },
  { id: 2, name: "নাসরিন আক্তার",     role: "জেলা কর্মকর্তা",     initials: "না", busy: false },
  { id: 3, name: "কামাল হোসেন",       role: "তদন্ত কর্মকর্তা",    initials: "কহ", busy: false },
  { id: 4, name: "সালমা বেগম",        role: "সহকারী পরিচালক",     initials: "সব", busy: false },
  { id: 5, name: "মোঃ আলী হাসান",    role: "মাঠকর্মী",           initials: "আহ", busy: false },
  { id: 6, name: "রেহানা পারভীন",     role: "জনসংযোগ কর্মকর্তা", initials: "রপ", busy: false },
];

const INITIAL_COMPLAINTS = [
  { id: "অভি-০০১", name: "আব্দুল করিম",     dept: "ঢাকা",       district: "নারায়ণগঞ্জ", date: "০৩ মে, ২০২৬", assignedTo: null,
    desc: "স্থানীয় বাজারে অবৈধ দখল ও চাঁদাবাজির অভিযোগ। দীর্ঘদিন ধরে ব্যবসায়ীরা হয়রানির শিকার।" },
  { id: "অভি-০০২", name: "সুমাইয়া খাতুন",  dept: "চট্টগ্রাম",  district: "কক্সবাজার",   date: "০২ মে, ২০২৬", assignedTo: null,
    desc: "পানীয় জল সরবরাহে দুর্নীতি ও অনিয়মের অভিযোগ।" },
  { id: "অভি-০০৩", name: "মোঃ জাহাঙ্গীর আলম", dept: "রাজশাহী", district: "বগুরা",        date: "০১ মে, ২০২৬", assignedTo: null,
    desc: "সরকারি জমি অবৈধভাবে দখলের অভিযোগ। প্রভাবশালী মহল দীর্ঘদিন আটকে রেখেছে।" },
  { id: "অভি-০০৪", name: "রাহেলা বেগম",     dept: "সিলেট",      district: "সুনামগঞ্জ",   date: "৩০ এপ্রিল, ২০২৬", assignedTo: null,
    desc: "বিদ্যালয়ে নিয়মিত শিক্ষক না আসায় শিক্ষার্থীরা ক্ষতিগ্রস্ত হচ্ছে।" },
  { id: "অভি-০০৫", name: "তারেক মাহমুদ",    dept: "খুলনা",      district: "যশোর",         date: "২৯ এপ্রিল, ২০২৬", assignedTo: null,
    desc: "স্থানীয় হাসপাতালে ওষুধ সংকট ও চিকিৎসা অবহেলার অভিযোগ।" },
];

function AssignRole({ submittedComplaint }) {
    const { state } = useLocation();
  const [complaints, setComplaints] = useState(() => {
    if (submittedComplaint) {
      return [
        {
          id: `অভি-${String(INITIAL_COMPLAINTS.length + 1).padStart(3, "০")}`,
          ...submittedComplaint,
          date: new Date().toLocaleDateString("bn-BD"),
          assignedTo: null,
        },
        ...INITIAL_COMPLAINTS,
      ];
    }
    return INITIAL_COMPLAINTS;
  });
  const [personnel, setPersonnel] = useState(INITIAL_PERSONNEL);
  const [selections, setSelections] = useState({});

  const handleAssign = (complaintId) => {
    const personId = parseInt(selections[complaintId]);
    if (!personId) return alert("অনুগ্রহ করে একজন কর্মী নির্বাচন করুন");
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, assignedTo: personId } : c))
    );
    setPersonnel((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, busy: true } : p))
    );
    setSelections((prev) => ({ ...prev, [complaintId]: "" }));
  };

  const handleUnassign = (complaintId) => {
    const complaint = complaints.find((c) => c.id === complaintId);
    const personId = complaint.assignedTo;
    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, assignedTo: null } : c))
    );
    setPersonnel((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, busy: false } : p))
    );
  };

  const totalCount    = complaints.length;
  const assignedCount = complaints.filter((c) => c.assignedTo).length;
  const pendingCount  = totalCount - assignedCount;
  const availableCount = personnel.filter((p) => !p.busy).length;

  return (
    <div className="ar-wrapper">
      <div className="ar-header">
        <h1 className="ar-title">অভিযোগ ব্যবস্থাপনা</h1>
        <p className="ar-subtitle">জমা দেওয়া অভিযোগ পর্যালোচনা ও দায়িত্ব বরাদ্দ করুন</p>
      </div>

      {/* Stats */}
      <div className="ar-stats-row">
        <div className="ar-stat-card">
          <span className="ar-stat-num">{totalCount}</span>
          <span className="ar-stat-label">মোট অভিযোগ</span>
        </div>
        <div className="ar-stat-card pink">
          <span className="ar-stat-num">{pendingCount}</span>
          <span className="ar-stat-label">অমীমাংসিত</span>
        </div>
        <div className="ar-stat-card green">
          <span className="ar-stat-num">{assignedCount}</span>
          <span className="ar-stat-label">বরাদ্দকৃত</span>
        </div>
        <div className="ar-stat-card amber">
          <span className="ar-stat-num">{availableCount}</span>
          <span className="ar-stat-label">প্রাপ্য কর্মী</span>
        </div>
      </div>

      {/* Complaints List */}
      <div className="ar-complaints-grid">
        {complaints.map((c) => {
          const isAssigned = c.assignedTo !== null;
          const person = isAssigned ? personnel.find((p) => p.id === c.assignedTo) : null;
          const available = personnel.filter((p) => !p.busy || p.id === c.assignedTo);

          return (
            <div key={c.id} className={`ar-complaint-card ${isAssigned ? "assigned" : "pending"}`}>
              <div className="ar-card-top">
                <div className="ar-card-meta">
                  <span className="ar-card-id">{c.id} &bull; {c.date}</span>
                  <span className="ar-card-name">{c.name}</span>
                </div>
                <span className={`ar-badge ${isAssigned ? "ar-badge-assigned" : "ar-badge-pending"}`}>
                  {isAssigned ? "বরাদ্দ হয়েছে" : "অপেক্ষমান"}
                </span>
              </div>

              <div className="ar-card-details">
                <span className="ar-detail-tag">{c.dept}</span>
                <span className="ar-detail-tag">{c.district}</span>
              </div>

              <p className="ar-card-desc">{c.desc}</p>

              <div className="ar-assign-area">
                <p className="ar-assign-label">
                  {isAssigned ? "দায়িত্বপ্রাপ্ত কর্মী" : "দায়িত্ব বরাদ্দ করুন"}
                </p>

                {isAssigned && person ? (
                  <div className="ar-assigned-person">
                    <div className="ar-person-avatar">{person.initials}</div>
                    <div className="ar-person-info">
                      <p className="ar-pname">{person.name}</p>
                      <p className="ar-prole">{person.role}</p>
                    </div>
                    <button className="ar-btn-unassign" onClick={() => handleUnassign(c.id)}>
                      বাতিল করুন
                    </button>
                  </div>
                ) : (
                  <div className="ar-assign-row">
                    <select
                      className="ar-select"
                      value={selections[c.id] || ""}
                      onChange={(e) =>
                        setSelections((prev) => ({ ...prev, [c.id]: e.target.value }))
                      }
                    >
                      <option value="">কর্মী নির্বাচন করুন</option>
                      {available.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} — {p.role}
                        </option>
                      ))}
                    </select>
                    <button className="ar-btn-assign" onClick={() => handleAssign(c.id)}>
                      বরাদ্দ করুন
                    </button>
                  </div>
                )}
                {!isAssigned && available.length === 0 && (
                  <p className="ar-no-staff">কোনো কর্মী বর্তমানে প্রাপ্য নেই</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Personnel Panel */}
      <div className="ar-personnel-panel">
        <h2 className="ar-panel-title">কর্মীদের প্রাপ্যতা</h2>
        <div className="ar-personnel-grid">
          {personnel.map((p) => (
            <div key={p.id} className={`ar-person-card ${p.busy ? "busy" : ""}`}>
              <div className="ar-pa">{p.initials}</div>
              <div className="ar-pi">
                <p className="ar-pn">{p.name}</p>
                <p className="ar-ps">{p.role}</p>
              </div>
              <span className={`ar-status-dot ${p.busy ? "dot-busy" : "dot-free"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AssignRole;