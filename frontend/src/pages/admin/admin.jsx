import { useState } from "react";
import axios from "axios";
import "./admin.css";

export default function AdminPage() {
  const [form, setForm] = useState({ question: "", startTime: "", endTime: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/votes/create", form);
    alert("Event Created");

    // Clear the form after successful submission
    setForm({ question: "", startTime: "", endTime: "" });
  };

  return (
    <div className="container">

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
                                <input className="form-control input" type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="mb-3">
                                <label className="form-label fw-bold">গণভোট শেষের সময় *</label>
                                <input className="form-control input" type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                              
                            </div>
                        </div>
                        
                        <button className="btn w-100 loginBtn" type="submit">
                            সাবমিট করুন
                        </button>
                    </div>

                </form>
            </div>
            
    </div>
  );
}






