import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Heatmap = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [districts, setDistricts] = useState([]);
  const [stats, setStats] = useState({ total: 0, urgent: 0, high: 0, pending: 0 });
  const mapRef = useRef(null);
  const heatmapLayerRef = useRef(null);
  const mapContainerRef = useRef(null);

  // Fetch complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch('http://localhost:5000/complaints');
        const data = await response.json();
        
        // Filter complaints with location data
        const locatedComplaints = data.filter(c => c.location && c.location.lat && c.location.lng);
        setComplaints(locatedComplaints);
        
        // Extract unique districts
        const uniqueDistricts = [...new Set(data.map(c => c.district).filter(Boolean))];
        setDistricts(uniqueDistricts);
        
        // Calculate stats
        const total = locatedComplaints.length;
        const urgent = locatedComplaints.filter(c => c.priority === 'urgent').length;
        const high = locatedComplaints.filter(c => c.priority === 'high').length;
        const pending = locatedComplaints.filter(c => c.status === 'pending').length;
        setStats({ total, urgent, high, pending });
        
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplaints();
  }, []);
  
  // Initialize map and heatmap
  useEffect(() => {
    if (!mapContainerRef.current || loading) return;
    
    // Initialize map centered on Bangladesh
    const map = L.map(mapContainerRef.current).setView([23.685, 90.3563], 7);
    mapRef.current = map;
    
    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 6
    }).addTo(map);
    
    // Add scale control
    L.control.scale({ metric: true, imperial: false }).addTo(map);
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [loading]);
  
  // Update heatmap when complaints or filter changes
  useEffect(() => {
    if (!mapRef.current || complaints.length === 0) return;
    
    // Filter complaints by district if needed
    let filteredComplaints = complaints;
    if (selectedDistrict !== 'all') {
      filteredComplaints = complaints.filter(c => c.district === selectedDistrict);
    }
    
    // Prepare heatmap data: [lat, lng, intensity]
    const heatmapData = filteredComplaints.map(complaint => {
      // Calculate intensity based on priority and status
      let intensity = 0.5;
      
      if (complaint.priority === 'urgent') intensity = 1.0;
      else if (complaint.priority === 'high') intensity = 0.8;
      else if (complaint.priority === 'medium') intensity = 0.6;
      
      if (complaint.status === 'pending') intensity += 0.2;
      else if (complaint.status === 'processing') intensity += 0.1;
      
      intensity = Math.min(intensity, 1.0);
      
      return [complaint.location.lat, complaint.location.lng, intensity];
    });
    
    // Remove existing heatmap layer
    if (heatmapLayerRef.current) {
      mapRef.current.removeLayer(heatmapLayerRef.current);
    }
    
    // Add new heatmap layer
    if (heatmapData.length > 0) {
      heatmapLayerRef.current = L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        minOpacity: 0.3,
        gradient: {
          0.2: 'blue',
          0.4: 'lime',
          0.6: 'yellow',
          0.8: 'orange',
          1.0: 'red'
        }
      }).addTo(mapRef.current);
    }
  }, [complaints, selectedDistrict]);

  if (loading) {
    return (
      <div className="dashboard-card" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">তাপমানচিত্র লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card" style={{ marginTop: '24px' }}>
      <h3>🗺️ অভিযোগের তাপমানচিত্র (Heatmap)</h3>
      <p className="text-muted small mb-3">লাল এলাকায় বেশি অভিযোগ, নীল এলাকায় কম অভিযোগ</p>
      
      {/* Stats Row */}
      <div className="row mb-3">
        <div className="col-md-3 mb-2">
          <div className="p-2 bg-light rounded text-center">
            <small className="text-muted">মোট অভিযোগ</small>
            <h5 className="mb-0 text-success">{stats.total}</h5>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-2 bg-light rounded text-center">
            <small className="text-muted">জরুরি (Urgent)</small>
            <h5 className="mb-0 text-danger">{stats.urgent}</h5>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-2 bg-light rounded text-center">
            <small className="text-muted">উচ্চ (High)</small>
            <h5 className="mb-0 text-warning">{stats.high}</h5>
          </div>
        </div>
        <div className="col-md-3 mb-2">
          <div className="p-2 bg-light rounded text-center">
            <small className="text-muted">বিচারাধীন</small>
            <h5 className="mb-0 text-info">{stats.pending}</h5>
          </div>
        </div>
      </div>
      
      {/* Filter */}
      <div className="filter-row mb-3">
        <label>জেলা ফিল্টার:</label>
        <select 
          className="form-select form-select-sm" 
          style={{ width: 'auto', display: 'inline-block' }}
          value={selectedDistrict} 
          onChange={e => setSelectedDistrict(e.target.value)}
        >
          <option value="all">সব জেলা</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      
      {/* Map */}
      <div 
        ref={mapContainerRef} 
        style={{ height: '450px', width: '100%', borderRadius: '12px', border: '1px solid #ddd' }}
      />
      
      <p className="text-muted small mt-3">
        <span className="badge bg-danger">লাল</span> = উচ্চ ঝুঁকিপূর্ণ এলাকা &nbsp;
        <span className="badge bg-warning">হলুদ</span> = মাঝারি ঝুঁকিপূর্ণ এলাকা &nbsp;
        <span className="badge bg-primary">নীল</span> = নিম্ন ঝুঁকিপূর্ণ এলাকা
      </p>
    </div>
  );
};

export default Heatmap;