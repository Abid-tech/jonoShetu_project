import { useState } from "react";
import axios from "axios";
import "./admin.css";

export default function AdminPage() {
  const [form, setForm] = useState({ question: "", startTime: "", endTime: "" });


  // Notice form state
  const [noticeForm, setNoticeForm] = useState({ 
    title: "", 
    content: "", 
    category: "General", 
    publishedBy: ""  
  });

  // Gov Link form state
  const [govLinkForm, setGovLinkForm] = useState({
    name: "",
    url: "",
    description: "",
    category: "General",
    icon: ""
  });

  const [loading, setLoading] = useState(false);
  const [noticeLoading, setNoticeLoading] = useState(false);
  const [govLinkLoading, setGovLinkLoading] = useState(false);

  // Handle Voting Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/votes/create", form);
      alert("Event Created Successfully!");
      // Clear the form after successful submission
      setForm({ question: "", startTime: "", endTime: "" });
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Notice Submit
  const handleNoticeSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!noticeForm.title.trim()) {
      return alert("Please enter notice title");
    }
    if (!noticeForm.content.trim()) {
      return alert("Please enter notice content");
    }
    if (!noticeForm.publishedBy.trim()) {
      return alert("Please enter publisher name");
    }

    setNoticeLoading(true);
    try {
      await axios.post("http://localhost:5000/api/notices", noticeForm);
      alert("Notice Posted Successfully!");
      // Clear the form after successful submission
      setNoticeForm({ 
        title: "", 
        content: "", 
        category: "General", 
        publishedBy: "" 
      });
    } catch (error) {
      console.error("Error posting notice:", error);
      alert("Failed to post notice. Please try again.");
    } finally {
      setNoticeLoading(false);
    }
  };


  // Handle Gov Link Submit
  const handleGovLinkSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!govLinkForm.name.trim()) {
      return alert("Please enter link name");
    }
    if (!govLinkForm.url.trim()) {
      return alert("Please enter URL");
    }
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (!urlPattern.test(govLinkForm.url)) {
      return alert("Please enter a valid URL (e.g., https://example.com)");
    }

    setGovLinkLoading(true);
    try {
      await axios.post("http://localhost:5000/api/gov-links", govLinkForm);
      alert("Government Link Posted Successfully!");
      // Clear the form after successful submission
      setGovLinkForm({
        name: "",
        url: "",
        description: "",
        category: "General",
        icon: ""
      });
    } catch (error) {
      console.error("Error posting government link:", error);
      alert("Failed to post government link. Please try again.");
    } finally {
      setGovLinkLoading(false);
    }
  };




  return (

    <div className="container">
            {/* Voting Create Frontend Part */}
            <div className="card adminCard">
 
                <div className="text-center mb-2">
         
                <h3 className="title">গণভোট সাবমিট ফরম</h3>
                <p className="subtitle">
                    গণভোটের তথ্য দিয়ে ফরম সাবমিট করুন
                </p>
                </div>

                <form onSubmit={handleSubmit}>            
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="mb-3">
                                <label className="form-label fw-bold ">গণভোটের প্রশ্ন *</label>
                                <textarea className="form-control input" rows="5" cols="40" placeholder="গণভোটের সর্ম্পূন প্রশ্ন এখানে প্রদান করুন" value={form.question}  onChange={(e) => setForm({ ...form, question: e.target.value })} required></textarea>
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">গণভোট শুরুর সময় *</label>
                                <input className="form-control input" type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">গণভোট শেষের সময় *</label>
                                <input className="form-control input" type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required/>
                              
                            </div>
                        </div>
                        
                        <button className="btn w-100 loginBtn" type="submit">
                            {loading ? "সাবমিট হচ্ছে..." : "সাবমিট করুন"}
                        </button>
                    </div>

                </form>
            </div>


            {/* Notice Board Form - Separator */}
            <div className="formDivider noticeDivider"></div>

            {/* Notice Board Create Frontend Part */}
            <div className="card adminCard">
                <div className="text-center mb-2">
                <h3 className="title">নোটিশ বোর্ড</h3>
                <p className="subtitle">
                    গুরুত্বপূর্ণ নোটিশ পোস্ট করুন
                </p>
                </div>

                <form onSubmit={handleNoticeSubmit}>            
                <div className="row">
                    <div className="col-lg-12">
                    <div className="mb-3">
                        <label className="form-label fw-bold">নোটিশের শিরোনাম *</label>
                        <input 
                        type="text"
                        className="form-control input" 
                        placeholder="নোটিশের শিরোনাম লিখুন"
                        value={noticeForm.title}
                        onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                        required
                        />
                    </div>
                    </div>

                    <div className="col-lg-12">
                    <div className="mb-3">
                        <label className="form-label fw-bold">ক্যাটাগরি</label>
                        <select 
                        className="form-control input"
                        value={noticeForm.category}
                        onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value })}
                        >
                        <option value="General">সাধারণ</option>
                        <option value="Important">গুরুত্বপূর্ণ</option>
                        <option value="Urgent">জরুরি</option>
                        <option value="Event">ইভেন্ট</option>
                        <option value="Holiday">ছুটি</option>
                        </select>
                    </div>
                    </div>

                    <div className="col-lg-12">
                    <div className="mb-3">
                        <label className="form-label fw-bold">নোটিশের বিবরণ *</label>
                        <textarea 
                        className="form-control input" 
                        rows="6" 
                        cols="40" 
                        placeholder="নোটিশের বিস্তারিত বিবরণ লিখুন"
                        value={noticeForm.content}
                        onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                        required
                        />
                    </div>
                    </div>

                    <div className="col-lg-12">
                    <div className="mb-3">
                        <label className="form-label fw-bold">প্রকাশক *</label>
                        <input 
                        type="text"
                        className="form-control input" 
                        placeholder="আপনার নাম/পদবি লিখুন"
                        value={noticeForm.publishedBy}
                        onChange={(e) => setNoticeForm({ ...noticeForm, publishedBy: e.target.value })}
                        required
                        />
                    </div>
                    </div>
                    
                    <button className="btn w-100 loginBtn" type="submit" disabled={noticeLoading}>
                    {noticeLoading ? "পোস্ট হচ্ছে..." : "নোটিশ পোস্ট করুন"}
                    </button>
                </div>
                </form>
            </div>


                  {/* Government Links Form - Separator */}
      <div className="formDivider govLinkDivider"></div>

      {/* Government Links Create Frontend Part */}
      <div className="card adminCard">
        <div className="text-center mb-2">
          <h3 className="title">সরকারি লিংক</h3>
          <p className="subtitle">
            গুরুত্বপূর্ণ সরকারি ওয়েবসাইটের লিংক যুক্ত করুন
          </p>
        </div>

        <form onSubmit={handleGovLinkSubmit}>            
          <div className="row">
            <div className="col-lg-12">
              <div className="mb-3">
                <label className="form-label fw-bold">লিংকের নাম *</label>
                <input 
                  type="text"
                  className="form-control input" 
                  placeholder="যেমন: বাংলাদেশ জাতীয় তথ্য বাতায়ন"
                  value={govLinkForm.name}
                  onChange={(e) => setGovLinkForm({ ...govLinkForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-3">
                <label className="form-label fw-bold">URL *</label>
                <input 
                  type="url"
                  className="form-control input" 
                  placeholder="https://bangladesh.gov.bd"
                  value={govLinkForm.url}
                  onChange={(e) => setGovLinkForm({ ...govLinkForm, url: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-3">
                <label className="form-label fw-bold">ক্যাটাগরি</label>
                <select 
                  className="form-control input"
                  value={govLinkForm.category}
                  onChange={(e) => setGovLinkForm({ ...govLinkForm, category: e.target.value })}
                >
                  <option value="General">সাধারণ</option>
                  <option value="Education">শিক্ষা</option>
                  <option value="Health">স্বাস্থ্য</option>
                  <option value="Agriculture">কৃষি</option>
                  <option value="Finance">অর্থ ও বাণিজ্য</option>
                  <option value="Law">আইন ও বিচার</option>
                  <option value="LocalGov">স্থানীয় সরকার</option>
                </select>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-3">
                <label className="form-label fw-bold">বিবরণ (ঐচ্ছিক)</label>
                <textarea 
                  className="form-control input" 
                  rows="3" 
                  placeholder="এই লিংক সম্পর্কে সংক্ষিপ্ত বিবরণ লিখুন"
                  value={govLinkForm.description}
                  onChange={(e) => setGovLinkForm({ ...govLinkForm, description: e.target.value })}
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="mb-3">
                <label className="form-label fw-bold">আইকন (ঐচ্ছিক)</label>
                <input 
                  type="text"
                  className="form-control input" 
                  value={govLinkForm.icon}
                  onChange={(e) => setGovLinkForm({ ...govLinkForm, icon: e.target.value })}
                />
              </div>
            </div>
            
            <button className="btn w-100 loginBtn" type="submit" disabled={govLinkLoading}>
              {govLinkLoading ? "লিংক যুক্ত হচ্ছে..." : "লিংক যুক্ত করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>


  );
}






