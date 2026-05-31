import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./referendum.css";

export default function Referendum() {
  const [events, setEvents] = useState([]);
  const [area, setArea] = useState("");
  const [timeLeft, setTimeLeft] = useState({});
  const [user, setUser] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check login status
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimers();
    }, 1000);
    return () => clearInterval(interval);
  }, [events]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/votes");
      setEvents(res.data);
      updateTimers(res.data);
      
      // Check which events user has already voted in
      if (user) {
        fetchUserVotes();
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserVotes = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/votes/user/${user.id}/votes`);
      const votedMap = {};
      res.data.forEach(vote => {
        votedMap[vote.eventId] = true;
      });
      setUserVotes(votedMap);
    } catch (error) {
      console.error("Error fetching user votes:", error);
    }
  };

  const updateTimers = (eventsData = events) => {
    const newTimeLeft = {};
    const now = new Date();

    eventsData.forEach((e) => {
      const start = new Date(e.startTime);
      const end = new Date(e.endTime);

      if (now >= start && now <= end) {
        const diff = end - now;
        newTimeLeft[e._id] = formatTime(diff);
      }
    });

    setTimeLeft(newTimeLeft);
  };

  const toBanglaNumber = (num) => {
    const banglaDigits = {
      '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
      '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
    };
    return num.toString().replace(/[0-9]/g, digit => banglaDigits[digit]);
  };

  const formatTime = (milliseconds) => {
    if (milliseconds <= 0) return `${toBanglaNumber(0)} সেকেন্ড`;
  
    const totalSeconds = Math.floor(milliseconds / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${toBanglaNumber(days)} দিন`);
    if (hours > 0) parts.push(`${toBanglaNumber(hours)} ঘণ্টা`);
    if (minutes > 0) parts.push(`${toBanglaNumber(minutes)} মিনিট`);
    if (seconds > 0 || parts.length === 0) parts.push(`${toBanglaNumber(seconds)} সেকেন্ড`);
    
    return parts.join(" ");
  };

  const vote = async (id, choice) => {
    if (!area) {
      alert("অনুগ্রহ করে আপনার বিভাগ/জেলা লিখুন");
      return;
    }

    if (userVotes[id]) {
      alert("আপনি ইতিমধ্যে এই গণভোটে ভোট দিয়েছেন!");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/votes/vote/${id}`, {
        vote: choice,
        area: area,
        userId: user.id,
        userNid: user.nidNumber,
        userName: user.fullName
      });
      
      alert("আপনার ভোট সফলভাবে গৃহীত হয়েছে!");
      setArea("");
      
      // Update local state
      setUserVotes(prev => ({ ...prev, [id]: true }));
      
      // Refresh events to get updated counts
      fetchEvents();
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message === "Already voted") {
        alert("আপনি ইতিমধ্যে এই গণভোটে ভোট দিয়েছেন!");
        setUserVotes(prev => ({ ...prev, [id]: true }));
      } else {
        console.error("Error voting:", error);
        alert("ভোট দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    }
  };

  if (loading) {
    return (
      <div className="referendum-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>গণভোটের তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="container referendum-container">
      {events.length === 0 ? (
        <div className="card adminCard">
          <div className="text-center">
            <h3 className="title">কোনো সক্রিয় গণভোট নেই</h3>
            <p className="subtitle">বর্তমানে কোনো গণভোট চলমান নেই। পরে আবার দেখুন।</p>
          </div>
        </div>
      ) : (
        events.map((e) => {
          const now = new Date();
          const start = new Date(e.startTime);
          const end = new Date(e.endTime);
          const hasUserVoted = userVotes[e._id];

          if (now < start) return null;

          if (now >= start && now <= end) {
            return (
              <div className="card adminCard" key={e._id}>
                <div className="row">
                  <div className="text-center mb-2">
                    <h3 className="title">গণভোট ব্যালট ফরম</h3>
                    <p className="subtitle">
                      গণভোটে আপনার গুরুত্বপূর্ণ মতামত দিয়ে ফরম সাবমিট করুন
                    </p>
                    <div className="countdown-timer">
                      <p className="timer-label">ভোট শেষ হতে বাকি: {timeLeft[e._id] || "গণনা করা হচ্ছে..."}</p>
                    </div>
                  </div>
                  
                  <div className="col-lg-12">
                    <label className="form-label fw-bold">আপনার বিভাগ/জেলা *</label>
                    <input
                      placeholder="আপনার বিভাগ বা জেলা লিখুন"
                      className="form-control input"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      disabled={hasUserVoted}
                    />
                  </div>
                  
                  <div className="col-lg-12 mb-4 mt-4 vote-result">
                    <h3>{e.question}</h3>
                  </div>
                  
                  {hasUserVoted ? (
                    <div className="col-lg-12 text-center">
                      <div className="alert alert-success">
                         আপনি ইতিমধ্যে এই গণভোটে ভোট দিয়েছেন
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="col-lg-6">
                        <button className="btn w-100 yesBtn" onClick={() => vote(e._id, "yes")}>
                          একমত
                        </button>
                      </div>
                      <div className="col-lg-6">
                        <button className="btn w-100 noBtn" onClick={() => vote(e._id, "no")}>
                          একমত নয়
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          }

          if (now > end) {
            const total = e.yesCount + e.noCount;
            const yesPercentage = total === 0 ? 0 : (e.yesCount / total) * 100;
            const noPercentage = total === 0 ? 0 : (e.noCount / total) * 100;
            const winner = e.yesCount > e.noCount ? "হ্যাঁ" : e.noCount > e.yesCount ? "না" : "টাই";
            
            return (
              <div className="card adminCard" key={e._id}>
                <div className="text-center mb-2">
                  <h3 className="title">গণভোটের ফলাফল</h3>
                  <p className="subtitle">
                    গণভোটে {winner} জয়যুক্ত হয়েছে
                  </p>
                  {hasUserVoted && (
                    <div className="alert alert-info mt-2">
                      আপনি এই গণভোটে ভোট দিয়েছেন
                    </div>
                  )}
                </div>
                
                <div className="row">
                  <div className="col-lg-12 text-center mb-4 vote-result">
                    <h3>{e.question}</h3>
                  </div>
                  <div className="col-lg-6">
                    <p className="btn w-100 loginBtn">একমত : {yesPercentage.toFixed(2)}% ({e.yesCount} জন)</p>
                  </div>
                  <div className="col-lg-6">
                    <p className="btn w-100 loginBtn">একমত নয় : {noPercentage.toFixed(2)}% ({e.noCount} জন)</p>
                  </div>
                </div>
              </div>
            );
          }
          
          return null;
        })
      )}
    </div>
  );
}