import { useEffect, useState } from "react";
import axios from "axios";
import "./referendum.css";

export default function Referendum() {
  const [events, setEvents] = useState([]);
  const [area, setArea] = useState("");
  const [timeLeft, setTimeLeft] = useState({}); //added for timer

  useEffect(() => {
    fetchEvents();
  }, []);


  // added for timer
  useEffect(() => {
    // Update timer every second for active events
    const interval = setInterval(() => {
      updateTimers();
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  const fetchEvents = async () => {
    const res = await axios.get("http://localhost:5000/api/votes");
    setEvents(res.data);
    updateTimers(res.data);
  };


  //added for timer
  const updateTimers = (eventsData = events) => {
    const newTimeLeft = {};
    const now = new Date();

    eventsData.forEach((e) => {
      const start = new Date(e.startTime);
      const end = new Date(e.endTime);

      if (now >= start && now <= end) {
        // Calculate remaining time
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
    if (!area) return alert("Please enter your area");

    await axios.post(`http://localhost:5000/api/votes/vote/${id}`, {
      vote: choice,
      area
    });
    
    setArea("");
    fetchEvents();
  };

  return (
    <div className="container">
   

        {events.map((e) => {
          const now = new Date();
          const start = new Date(e.startTime);
          const end = new Date(e.endTime);

          if (now < start) return null;

          if (now >= start && now <= end) {
            return (
              <div className="card adminCard">
                <div key={e._id}>
                  <div className="row">
                    <div className="text-center mb-2">
                          <h3 className="title">গণভোট ব্যালট ফরম</h3>
                          
                          <p className="subtitle">
                              গণভোটে আপনার গুরুত্বপূর্ণ মতামত দিয়ে ফরম সাবমিট করুন
                          </p>
                          <div className="countdown-timer">
                            <p className="timer-label">ভোট শেষ হতে বাকি: {timeLeft[e._id] || "Calculating..."}</p>
                            {/* <p className="timer-value"></p> */}
                          </div>
                    </div>
                    <div className="col-lg-12">
                      <label className="form-label fw-bold">আপনার বিভাগ *</label>
                      <input
                        placeholder="আপনার বিভাগ প্রদান করুন"
                        className="form-control input"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-12 mb-4 mt-4 vote-result">
                        <h3>{e.question}</h3> 
                    </div>
                    <div className="col-lg-6">
                        <button className="btn w-100 yesBtn" onClick={() => vote(e._id, "yes")}>একমত</button>
                    </div>
                    <div className="col-lg-6">
                        <button className="btn w-100 noBtn" onClick={() => vote(e._id, "no")}>একমত নয়</button>
                    </div>
                  </div>
                
                </div>
              </div>
            );
          }

          if (now > end) {
            const total = e.yesCount + e.noCount;
            const yesPercentage = total === 0 ? 0 : (e.yesCount / total) * 100;
            const noPercentage = total === 0 ? 0 : (e.noCount / total) * 100;
            return (
              <>
                <div className="card adminCard">
                    <div className="text-center mb-2">
                        <h3 className="title">গণভোটের ফলাফল </h3>
                        <p className="subtitle">
                              গণভোটে {e.yesCount > e.noCount ? "হ্যাঁ জয়যুক্ত হয়েছে" : e.noCount > e.yesCount ? "না জয়যুক্ত হয়েছে" : "টাই হয়েছে"}
                        </p>
                    </div>
                    <div key={e._id}>
                      <div className="row">
                        <div className="col-lg-12 text-center mb-4 vote-result">
                            <h3>{e.question}</h3>
                        </div>
                        <div className="col-lg-6">
                            <p className="btn w-100 loginBtn" >একমত : {yesPercentage.toFixed(2)}% ({e.yesCount} জন)</p>
                        </div>
                        <div className="col-lg-6">
                            <p className="btn w-100 loginBtn" >একমত নয়:{noPercentage.toFixed(2)}% ({e.noCount} জন)</p>
                        </div>
                      </div>
                      
                      
                    </div>
                </div>
              </>
            );
          }
        })}



    </div>
    
  );
}

