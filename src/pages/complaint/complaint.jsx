import {React,useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "./complaint.css"



const DEPARTMENTS = [ "ঢাকা", "চট্টগ্রাম", "খুলনা", "রাজশাহী", "সিলেট", "বরিশাল", "রংপুর", "ময়মনসিংহ" ];
const DISTRICTS = [
  "ঢাকা",
  "গাজীপুর",
  "কিশোরগঞ্জ",
  "মানিকগঞ্জ",
  "মুন্সীগঞ্জ",
  "নারায়ণগঞ্জ",
  "নরসিংদী",
  "টাঙ্গাইল",
  "শরীয়তপুর",
  "ফরিদপুর",
  "রাজবাড়ী",
  
  "চট্টগ্রাম",
  "কুমিল্লা",
  "ফেনী",
  "ব্রাহ্মণবাড়িয়া",
  "চাঁদপুর",
  "লক্ষ্মীপুর",
  "নোয়াখালী",
  "রাঙ্গামাটি",
  "বান্দরবান",
  "খাগড়াছড়ি",
  "কক্সবাজার",
  
  "বরিশাল",
  "বরগুনা",
  "ভোলা",
  "ঝালকাঠি",
  "পটুয়াখালী",
  "পিরোজপুর",
  
  "রাজশাহী",
  "বগুরা",
  "জয়পুরহাট",
  "নওগাঁ",
  "নাটোর",
  "রাজশাহী জেলা",
  "সিরাজগঞ্জ",
  "পাবনা",
  "নওয়াবগঞ্জ",
  
  "খুলনা",
  "যশোর",
  "চুয়াডাঙ্গা",
  "ঝিনাইদহ",
  "কুষ্টিয়া",
  "মাগুরা",
  "মেহেরপুর",
  "নড়াইল",
  "সাতক্ষীরা",
  "বাগেরহাট",
  
  "সিলেট",
  "সুনামগঞ্জ",
  "মৌলভীবাজার",
  "হবিগঞ্জ",
  
  "ময়মনসিংহ",
  "জামালপুর",
  "নেত্রকোনা",
  "শেরপুর",
  
  "রংপুর",
  "দিনাজপুর",
  "গাইবান্ধা",
  "কুড়িগ্রাম",
  "লালমনিরহাট",
  "নীলফামারী",
  "পঞ্চগড়",
  "রংপুর জেলা",
  "ঠাকুরগাঁও",
  
  "নেত্রকোনা"
];
const MapSelector = ({ location, setLocation }) => {
  const mapEvents = useMapEvents({
    click(e) {
      setLocation(e.latlng); // Save selected lat/lng
    }
  });
  return location ? <Marker position={location} /> : null;
};




function Complaint() {

    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [district, setDistrict] = useState("");
    const [description, setDescription] = useState("");
    const [locationFile, setLocationFile] = useState(null);
    const locationRef = useRef(null);
    const [location, setLocation] = useState(null); 

    const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLocationFile({ url: URL.createObjectURL(file), name: file.name });
    e.target.value = "";
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    alert("অভিযোগ সফলভাবে জমা হয়েছে!");
    setName("");
    setDepartment("");
    setDistrict("");
    setDescription("");
    setLocationFile(null);
    };

  return (
    <>
      <div className="complaint-wrapper">
            <main className="complaint-main">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-12 col-md-8 col-lg-6">
                    <div className="complaint-card my-5">
                      <div className="card-body-inner">
                        <div className="card-title-section text-center mb-4">
                          <div className="complaint-icon-wrap mb-3">
                              <svg
                                  width="32"
                                  height="32"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="green"  
                                  strokeWidth="2"
                              >
                                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                  <circle cx="12" cy="7" r="4" />
                              </svg>
                          </div>
                          <h2 className="complaint-title">অভিযোগ দায়ের</h2>
                          <p className="complaint-subtitle">
                            আপনার তথ্য দিয়ে অভিযোগ জমা দিন
                          </p>
                        </div>
      
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
                              >
                              <option value="">জেলা নির্বাচন করুন</option>
                              {DISTRICTS.map((dist, i) => (
                                  <option key={i} value={dist}>{dist}</option>
                              ))}
                          </select>
                          </div>
      
                          {/* Description */}
                          <div className="form-group-custom mb-3">
                            <label
                              className="form-label-custom"
                              htmlFor="description"
                            >
                              বিস্তারিত বিবরণ *
                            </label>
                            <textarea
                              id="description"
                              className="form-control form-control-custom"
                              placeholder="আপনার অভিযোগের বিস্তারিত লিখুন"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={4}
                              required
                            />
                          </div>
      
                          {/* Optional Location */}
                          <div className="form-group-custom mb-4">
                            <label className="form-label-custom">লোকেশন (Optional)</label>
                            <div
                              className="location-upload"
                              onClick={() => locationRef.current.click()}
                            >
                              {locationFile ? (
                                <p>{locationFile.name}</p>
                              ) : (
                                <p>মানচিত্র নির্বাচন করুন</p>
                              )}
                              <div className="form-group-custom mb-4">
                              <label className="form-label-custom">লোকেশন (Optional)</label>
                              <MapContainer center={[23.685, 90.3563]} zoom={7} style={{ height: 300, width: '100%' }}>
                                  <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution="&copy; OpenStreetMap contributors"
                                  />
                                  <MapSelector location={location} setLocation={setLocation} />
                              </MapContainer>
                              </div>
                            </div>
                          </div>
      
                          {/* Submit */}
                          <button type="submit" className="btn btn-submit w-100">
                            অভিযোগ দায়ের করুন
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>

    </>
  )
}

export default Complaint
