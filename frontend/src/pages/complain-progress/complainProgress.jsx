import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./complainProgress.css";

const STATUS_ORDER = ["submitted", "review", "assigned", "resolved"];

const BADGE_MAP = {
  submitted: { cls: "badge-submitted", label: "অপেক্ষমাণ" },
  review:    { cls: "badge-review",    label: "পর্যালোচনাধীন" },
  assigned:  { cls: "badge-assigned",  label: "✓ প্রক্রিয়াধীন" },
  resolved:  { cls: "badge-resolved",  label: "✓ সমাধান হয়েছে" },
};

const STEPS = [
  { key: "submitted", label: "অভিযোগ জমা হয়েছে",           note: "আপনার অভিযোগ সফলভাবে নথিভুক্ত হয়েছে।" },
  { key: "review",    label: "পর্যালোচনা চলছে",              note: "আমাদের দল অভিযোগটি যাচাই করছে।" },
  { key: "assigned",  label: "দায়িত্বপ্রাপ্ত ব্যক্তি নির্ধারিত", note: "একজন কর্মী নিয়োগ দেওয়া হয়েছে।" },
  { key: "resolved",  label: "সমাধান হয়েছে",                note: "অভিযোগটি সফলভাবে সমাধান করা হয়েছে।" },
];

const DEMO_COMPLAINTS = [
  {
    id: "#CMP-2024-00312", title: "পানি সরবরাহ বিঘ্নিত — ব্লক সি",
    date: "২ মে ২০২৪", dateSort: "2024-05-02", district: "ঢাকা উত্তর",
    category: "পানি ও পয়ঃনিষ্কাশন",
    desc: "ব্লক সি, সেক্টর ৭-এ গত ৩ দিন ধরে পানি সরবরাহ নেই।",
    status: "assigned", expectedResolution: "৫ কার্যদিবসের মধ্যে",
    assignedPerson: { name: "মো. হাসিবুল ইসলাম", initials: "হা", role: "ফিল্ড ইন্সপেক্টর", contact: "+৮৮০ ১৭১১-৩৩৪৪৫৫" },
    timeline: { submitted: "২ মে ২০২৪ · সকাল ১০:৪২", review: "২ মে ২০২৪ · দুপুর ১২:১৫", assigned: "৩ মে ২০২৪ · সকাল ৯:০০", resolved: null },
  },
  {
    id: "#CMP-2024-00287", title: "রাস্তার গর্ত মেরামত প্রয়োজন",
    date: "২৮ এপ্রিল ২০২৪", dateSort: "2024-04-28", district: "মিরপুর",
    category: "সড়ক ও অবকাঠামো",
    desc: "মিরপুর ১২ নম্বরে প্রধান সড়কে বড় গর্ত। দুর্ঘটনার ঝুঁকি রয়েছে।",
    status: "resolved", expectedResolution: "সমাধান হয়েছে",
    assignedPerson: { name: "ইঞ্জি. রফিকুল আলম", initials: "রা", role: "সিভিল ইঞ্জিনিয়ার", contact: "+৮৮০ ১৮১৯-২২৩৩৪৪" },
    timeline: { submitted: "২৮ এপ্রিল ২০২৪ · সকাল ৯:১০", review: "২৮ এপ্রিল ২০২৪ · বিকাল ৩:০০", assigned: "২৯ এপ্রিল ২০২৪ · সকাল ৮:৩০", resolved: "৩০ এপ্রিল ২০২৪ · বিকাল ৫:০০" },
  },
  {
    id: "#CMP-2024-00301", title: "বিদ্যুৎ বিচ্ছিন্ন — আবাসিক এলাকা",
    date: "১ মে ২০২৪", dateSort: "2024-05-01", district: "উত্তরা",
    category: "বিদ্যুৎ",
    desc: "উত্তরা ৪ নম্বর সেক্টরে ২ দিন ধরে বিদ্যুৎ নেই।",
    status: "review", expectedResolution: "৩ কার্যদিবসের মধ্যে",
    assignedPerson: null,
    timeline: { submitted: "১ মে ২০২৪ · সকাল ৭:৪৫", review: "১ মে ২০২৪ · দুপুর ১১:০০", assigned: null, resolved: null },
  },
  {
    id: "#CMP-2024-00265", title: "ময়লা-আবর্জনা সংগ্রহ বন্ধ",
    date: "২২ এপ্রিল ২০২৪", dateSort: "2024-04-22", district: "মোহাম্মদপুর",
    category: "পরিচ্ছন্নতা",
    desc: "গত ৫ দিন ধরে ময়লা সংগ্রহ হচ্ছে না। স্বাস্থ্য ঝুঁকি তৈরি হয়েছে।",
    status: "submitted", expectedResolution: "৭ কার্যদিবসের মধ্যে",
    assignedPerson: null,
    timeline: { submitted: "২২ এপ্রিল ২০২৪ · সকাল ১১:৩০", review: null, assigned: null, resolved: null },
  },
  {
    id: "#CMP-2024-00290", title: "স্ট্রিট লাইট নষ্ট — ৩টি পোল",
    date: "২৫ এপ্রিল ২০২৪", dateSort: "2024-04-25", district: "বনানী",
    category: "বিদ্যুৎ",
    desc: "বনানী ১১ নম্বর সড়কে ৩টি স্ট্রিট লাইট নষ্ট। রাতে চলাচলে অসুবিধা হচ্ছে।",
    status: "assigned", expectedResolution: "২ কার্যদিবসের মধ্যে",
    assignedPerson: { name: "মো. ইকবাল হোসেন", initials: "ই", role: "টেকনিশিয়ান — বিদ্যুৎ বিভাগ", contact: "+৮৮০ ১৬১২-৫৫৬৬৭৭" },
    timeline: { submitted: "২৫ এপ্রিল ২০২৪ · দুপুর ২:০০", review: "২৫ এপ্রিল ২০২৪ · বিকাল ৪:৩০", assigned: "২৬ এপ্রিল ২০২৪ · সকাল ১০:০০", resolved: null },
  },
];

function getStepState(complaint, stepIdx) {
  const curIdx = STATUS_ORDER.indexOf(complaint.status);
  if (stepIdx < curIdx) return "done";
  if (stepIdx === curIdx) return "active";
  return "idle";
}

function ComplaintDetail({ c }) {
  return (
    <div className="cp-detail">
      <p className="cp-dlabel">অগ্রগতির ধাপসমূহ</p>
      <div className="cp-timeline">
        {STEPS.map((s, i) => {
          const state = getStepState(c, i);
          const isLast = i === STEPS.length - 1;
          return (
            <div className="cp-step" key={s.key}>
              <div className="cp-sleft">
                <div className={`cp-sdot sdot-${state}`}>
                  {state === "done" ? "✓" : state === "active" ? "▶" : i + 1}
                </div>
                {!isLast && <div className={`cp-sline ${state === "done" ? "done" : ""}`} />}
              </div>
              <div className="cp-sbody">
                <p className={`cp-sname ${state === "active" ? "act" : state === "idle" ? "idl" : ""}`}>{s.label}</p>
                <p className="cp-snote">{s.note}</p>
                <p className="cp-stime">{c.timeline[s.key] ?? "— অপেক্ষমাণ"}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cp-divider" />
      <p className="cp-dlabel">দায়িত্বপ্রাপ্ত কর্মী</p>
      {c.assignedPerson ? (
        <div className="cp-person-wrap">
          <div className="cp-avatar">{c.assignedPerson.initials}</div>
          <div>
            <p className="cp-pname">{c.assignedPerson.name}</p>
            <p className="cp-prole">{c.assignedPerson.role}</p>
            <p className="cp-pcontact">📞 {c.assignedPerson.contact}</p>
          </div>
        </div>
      ) : (
        <div className="cp-unassigned">
          <div className="cp-ua-icon">⏳</div>
          <div>
            <p className="cp-ua-t">এখনও কাউকে নিয়োগ দেওয়া হয়নি</p>
            <p className="cp-ua-s">শীঘ্রই একজন কর্মী নিয়োগ দেওয়া হবে।</p>
          </div>
        </div>
      )}
      <div className="cp-divider" />
      <p className="cp-dlabel">অভিযোগ তথ্য</p>
      <div className="cp-meta-grid">
        <div className="cp-mi"><p className="cp-mk">রেফারেন্স নম্বর</p><p className="cp-mv">{c.id}</p></div>
        <div className="cp-mi"><p className="cp-mk">বিভাগ</p><p className="cp-mv">{c.category}</p></div>
        <div className="cp-mi"><p className="cp-mk">জেলা</p><p className="cp-mv">{c.district}</p></div>
        <div className="cp-mi"><p className="cp-mk">সমাধানের প্রত্যাশিত সময়</p><p className="cp-mv">{c.expectedResolution}</p></div>
      </div>
    </div>
  );
}

export default function ComplainProgress() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // In real app: fetch from API or read from location.state
  const complaints = DEMO_COMPLAINTS;

  const filtered = useMemo(() => {
    let list = complaints.filter(c => {
      const q = search.toLowerCase();
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.district.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
      const matchS = !statusFilter || c.status === statusFilter;
      return matchQ && matchS;
    });
    if (sortBy === "date-asc")  list = [...list].sort((a, b) => a.dateSort.localeCompare(b.dateSort));
    if (sortBy === "date-desc") list = [...list].sort((a, b) => b.dateSort.localeCompare(a.dateSort));
    if (sortBy === "status")    list = [...list].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status));
    return list;
  }, [complaints, search, statusFilter, sortBy]);

  const stats = {
    total:    complaints.length,
    pending:  complaints.filter(c => c.status === "submitted" || c.status === "review").length,
    assigned: complaints.filter(c => c.status === "assigned").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  };

  return (
    <div className="cp-wrap">
      <div className="cp-inner">
        <button className="cp-back" onClick={() => navigate(-1)}>← ফিরে যান</button>

        <div className="cp-head">
          <div className="cp-icon-wrap">
            <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4" stroke="#006a4e" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="9" stroke="#006a4e" strokeWidth="2"/>
            </svg>
          </div>
          <h1 className="cp-h1">আমার অভিযোগসমূহ</h1>
          <p className="cp-sub">আপনার সমস্ত জমা দেওয়া অভিযোগের তালিকা ও অগ্রগতি</p>
        </div>

        {/* Stats */}
        <div className="cp-stats">
          <div className="cp-stat"><div className="cp-sn">{stats.total}</div><div className="cp-sl">মোট</div></div>
          <div className="cp-stat"><div className="cp-sn amber">{stats.pending}</div><div className="cp-sl">অপেক্ষমাণ</div></div>
          <div className="cp-stat"><div className="cp-sn pink">{stats.assigned}</div><div className="cp-sl">প্রক্রিয়াধীন</div></div>
          <div className="cp-stat"><div className="cp-sn green2">{stats.resolved}</div><div className="cp-sl">সমাধান</div></div>
        </div>

        {/* Controls */}
        <div className="cp-controls">
          <input className="cp-search" type="text" placeholder="অভিযোগ খুঁজুন..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="cp-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">সব অবস্থা</option>
            <option value="submitted">অপেক্ষমাণ</option>
            <option value="review">পর্যালোচনাধীন</option>
            <option value="assigned">প্রক্রিয়াধীন</option>
            <option value="resolved">সমাধান হয়েছে</option>
          </select>
          <select className="cp-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date-desc">নতুন আগে</option>
            <option value="date-asc">পুরাতন আগে</option>
            <option value="status">অবস্থা অনুযায়ী</option>
          </select>
        </div>

        {/* List */}
        <div className="cp-list">
          {filtered.length === 0 ? (
            <div className="cp-empty">কোনো অভিযোগ পাওয়া যায়নি।</div>
          ) : filtered.map(c => {
            const b = BADGE_MAP[c.status];
            const isOpen = expandedId === c.id;
            return (
              <div className={`cp-card ${isOpen ? "expanded" : ""}`} key={c.id}>
                <div className="cp-card-header" onClick={() => setExpandedId(isOpen ? null : c.id)}>
                  <div className={`cp-status-dot dot-${c.status}`} />
                  <div className="cp-card-main">
                    <div className="cp-card-row1">
                      <span className="cp-cid">{c.id} · {c.date}</span>
                      <span className={`cp-badge ${b.cls}`}>{b.label}</span>
                    </div>
                    <p className="cp-ctitle">{c.title}</p>
                    <div className="cp-cmeta">
                      <span className="cp-ctag">📍 {c.district}</span>
                      <span className="cp-ctag">{c.category}</span>
                    </div>
                  </div>
                  <div className={`cp-chevron ${isOpen ? "open" : ""}`}>▼</div>
                </div>
                {isOpen && <ComplaintDetail c={c} />}
              </div>
            );
          })}
        </div>

        <p className="cp-footer">জরুরি প্রয়োজনে কল করুন: <strong>১৬১০০</strong></p>
      </div>
    </div>
  );
}