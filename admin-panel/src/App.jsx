import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

export default function App() {
  const [data, setData] = useState({
    whatsappLink: '',
    livePrice: '',
    webinarPrice: '',
    isPaymentEnabled: true
  });

  useEffect(() => {
    // Replace with your actual backend URL once deployed
    axios.get('https://kshitizadmin.onrender.com/api/settings')
      .then(res => { if(res.data) setData(res.data); })
      .catch(err => console.log("Initial fetch failed."));
  }, []);

  const handleSave = async () => {
    try {
      await axios.post('https://kshitizadmin.onrender.com/api/settings', data);
      alert("✅ Settings Updated!");
    } catch (error) {
      alert("❌ Update failed. Check connection.");
    }
  };

  return (
    <div className="mobile-wrapper">
      <div className="admin-card">
        <header>
          <h1>Admin Control</h1>
          <p>Manage your links and pricing</p>
        </header>

        <div className="form-body">
          <div className="input-group">
            <label>WhatsApp Link</label>
            <input 
              type="url" 
              placeholder="https://wa.me/..."
              value={data.whatsappLink} 
              onChange={(e) => setData({...data, whatsappLink: e.target.value})} 
            />
          </div>

          <div className="price-row">
            <div className="input-group">
              <label>Live Price</label>
              <input 
                type="number" 
                value={data.livePrice} 
                onChange={(e) => setData({...data, livePrice: e.target.value})} 
              />
            </div>
            <div className="input-group">
              <label>Webinar Price</label>
              <input 
                type="number" 
                value={data.webinarPrice} 
                onChange={(e) => setData({...data, webinarPrice: e.target.value})} 
              />
            </div>
          </div>

          <div className="toggle-container">
            <div className="toggle-text">
              <span>Payment Gateway</span>
              <small>{data.isPaymentEnabled ? "Active" : "Disabled"}</small>
            </div>
            <label className="switch">
              <input 
                type="checkbox" 
                checked={data.isPaymentEnabled} 
                onChange={(e) => setData({...data, isPaymentEnabled: e.target.checked})} 
              />
              <span className="slider round"></span>
            </label>
          </div>

          <button className="save-btn" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
