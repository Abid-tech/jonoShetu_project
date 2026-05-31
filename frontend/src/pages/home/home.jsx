import React, { useState, useEffect } from "react";
import "./home.css"

function Home() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      // Fetch all complaints
      const response = await fetch("http://localhost:5000/complaints");
      const complaints = await response.json();
      
      // Get last 2 months
      const now = new Date();
      const months = [];
      
      for (let i = 0; i < 2; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = date.toLocaleString('bn-BD', { month: 'long', year: 'numeric' });
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        // Filter complaints for this month
        const monthComplaints = complaints.filter(c => {
          const createdAt = new Date(c.createdAt);
          return createdAt >= monthStart && createdAt <= monthEnd;
        });
        
        // Count resolved complaints for this month
        const resolvedComplaints = monthComplaints.filter(c => c.status === 'resolved');
        
        // Find district with most complaints
        const districtCount = {};
        monthComplaints.forEach(c => {
          districtCount[c.district] = (districtCount[c.district] || 0) + 1;
        });
        
        let topDistrict = "N/A";
        let maxCount = 0;
        for (const [district, count] of Object.entries(districtCount)) {
          if (count > maxCount) {
            maxCount = count;
            topDistrict = district;
          }
        }
        
        months.push({
          name: monthName,
          total: monthComplaints.length,
          resolved: resolvedComplaints.length,
          topDistrict: topDistrict,
          monthIndex: i
        });
      }
      
      setMonthlyData(months);
    } catch (error) {
      console.error("Error fetching monthly stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <section id="banner">
          <div className="container">
            <div className="banner-txt">
              <div className="row">
                <div className="col-lg-12">
                  <h1>নাগরিক <span>অধিকার চর্চা </span> করবেন<br/>  এখন আরো  সহজভাবে </h1>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="monthly-report">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="monthly-top">
                  <h3>মাসিক অভি<span>যোগ দায়ে</span>রের তুলনা</h3>
                </div>
              </div>
            </div>
            <div className="monthly-loading">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>তথ্য লোড হচ্ছে...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>

        <section id="banner">
            <div className="container">
                <div className="banner-txt">
                    <div className="row">
                        <div className="col-lg-12">
                            
                            <h1>নাগরিক <span>অধিকার চর্চা </span> করবেন<br/>  এখন আরো  সহজভাবে </h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <section id="monthly-report">
            <div className="container">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="monthly-top">
                            <h3>মাসিক অভি<span>যোগ দায়ে</span>রের তুলনা</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {monthlyData.map((month, index) => (
                        <div className="col-lg-6" key={index}>
                            <div className="monthly-content">
                                <h5>মাসের নাম : {month.name}</h5>
                                <h5>মোট অভিযোগ দায়ের : {month.total.toLocaleString('bn-BD')}</h5>
                                <h5>অভিযোগ সমাধান : {month.resolved.toLocaleString('bn-BD')}</h5>
                                <h5>জেলাভিত্তিক সর্বোচ্চ অভিযোগ দায়ের : {month.topDistrict}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="monthly-btn">
                    <button onClick={() => window.location.href = '/dashboard'}>বিস্তারিত জানুন</button>
                </div>
            </div>
        </section>


    </>
  )
}

export default Home