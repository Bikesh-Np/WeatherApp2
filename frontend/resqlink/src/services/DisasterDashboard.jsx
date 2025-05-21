import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DisasterDashboard.css';

// Asia's geographical boundaries (approximate)
const ASIA_BOUNDS = {
  minLat: 5,     // South India
  maxLat: 40,    // Northern China
  minLng: 65,    // Western India
  maxLng: 110,
};

// Check if coordinates are within Asia
const isInAsia = (lat, lng) => {
  return (
    lat >= ASIA_BOUNDS.minLat &&
    lat <= ASIA_BOUNDS.maxLat &&
    lng >= ASIA_BOUNDS.minLng &&
    lng <= ASIA_BOUNDS.maxLng
  );
};

// Custom marker icons
const earthquakeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const wildfireIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DisasterDashboard = () => {
  const [disasters, setDisasters] = useState({
    earthquakes: [],
    wildfires: [],
    loading: true,
    error: null,
    lastUpdated: null
  });

  const [activeTab, setActiveTab] = useState('earthquakes');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [earthquakeRes, wildfireRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/disasters/earthquakes/'),
          fetch('http://127.0.0.1:8000/api/disasters/wildfires/')
        ]);

        const [earthquakeData, wildfireData] = await Promise.all([
          earthquakeRes.ok ? earthquakeRes.json() : [],
          wildfireRes.ok ? wildfireRes.json() : []
        ]);

        const filterForAsia = (items) => {
          if (!Array.isArray(items)) return [];
          return items.filter(item => {
            if (item.location && Array.isArray(item.location)) {
              return isInAsia(item.location[1], item.location[0]);
            } else if (item.location && item.location.lat && item.location.lng) {
              return isInAsia(item.location.lat, item.location.lng);
            }
            return false;
          });
        };

        setDisasters({
          earthquakes: filterForAsia(Array.isArray(earthquakeData) ? earthquakeData : []),
          wildfires: filterForAsia(Array.isArray(wildfireData) ? wildfireData : []),
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } catch (err) {
        setDisasters(prev => ({
          ...prev,
          loading: false,
          error: err.message
        }));
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  if (disasters.loading) return (
    <div className="pulse-loading-screen">
      <div className="pulse-spinner">
        <div className="pulse-spinner-inner"></div>
      </div>
      <h2>Loading Disaster Data</h2>
      <p>Gathering real-time information for Asia</p>
    </div>
  );

  if (disasters.error) return (
    <div className="pulse-error-screen">
      <div className="pulse-error-content">
        <div className="pulse-error-icon">⚠️</div>
        <h2>Connection Error</h2>
        <p>{disasters.error}</p>
        <button 
          className="pulse-retry-btn"
          onClick={() => window.location.reload()}
        >
          <span>Retry Connection</span>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z" />
          </svg>
        </button>
      </div>
    </div>
  );

  const activeData = activeTab === 'earthquakes' ? disasters.earthquakes : disasters.wildfires;

  return (
    <div className="pulse-container">
      {/* Sidebar */}
      <div className={`pulse-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="pulse-sidebar-header">
          <div className="pulse-logo">
            <svg viewBox="0 0 24 24">
              <path d="M12,2L4,12L12,22L20,12L12,2M12,4L18,12L12,20L6,12L12,4M11,16V8H15V16H11Z" />
            </svg>
            {!sidebarCollapsed && <span>ResQLink Asia</span>}
          </div>
          {!sidebarCollapsed && <div className="pulse-logo-subtitle">Disaster Monitoring System</div>}
        </div>

        <div className="pulse-nav">
          <button 
            className={`pulse-nav-btn ${activeTab === 'earthquakes' ? 'active' : ''}`}
            onClick={() => setActiveTab('earthquakes')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M15.5,8H16.5A1.5,1.5 0 0,1 18,9.5V10.9C18,12.2 17.24,13.43 16,14V17H15V19H14V17H10V19H9V17H8V14C6.76,13.43 6,12.2 6,10.9V9.5A1.5,1.5 0 0,1 7.5,8H8.5C8.5,7.4 8.9,7 9.5,7H14.5C15.1,7 15.5,7.4 15.5,8M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11Z" />
            </svg>
            {!sidebarCollapsed && (
              <>
                <span>Earthquakes</span>
                <div className="pulse-nav-badge">{disasters.earthquakes.length}</div>
              </>
            )}
          </button>

          <button 
            className={`pulse-nav-btn ${activeTab === 'wildfires' ? 'active' : ''}`}
            onClick={() => setActiveTab('wildfires')}
          >
            <svg viewBox="0 0 24 24">
              <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z" />
            </svg>
            {!sidebarCollapsed && (
              <>
                <span>Wildfires</span>
                <div className="pulse-nav-badge">{disasters.wildfires.length}</div>
              </>
            )}
          </button>
          
          <button 
            className="pulse-nav-btn"
            onClick={() => window.location.href = 'http://localhost:3000/weather'}
          >
            <svg viewBox="0 0 64 64" width="24" height="24">
              <path fill="#2196f3" d="M2 48c4 0 4-4 8-4s4 4 8 4 4-4 8-4 4 4 8 4 4-4 8-4 4 4 8 4 4-4 8-4v4c-4 0-4 4-8 4s-4-4-8-4-4 4-8 4-4-4-8-4-4 4-8 4-4-4-8-4-4 4-8 4v-4z"/>
              <path fill="#795548" d="M40 8l20 20h-10l-14 14-10-10 14-14z"/>
            </svg>
            {!sidebarCollapsed && <span>Flood Prediction</span>}
          </button>
        </div>

        <div className="pulse-sidebar-footer">
          {!sidebarCollapsed && (
            <>
              <div className="pulse-update-time">
                Last updated: {disasters.lastUpdated?.toLocaleTimeString()}
              </div>
              <div className="pulse-version">v2.0.1</div>
            </>
          )}
        </div>
        
        <button className="pulse-sidebar-toggle" onClick={toggleSidebar}>
          <svg viewBox="0 0 24 24">
            {sidebarCollapsed ? (
              <path d="M9,19V13H11V17H13V13H15V19H17V12A1,1 0 0,0 16,11H8A1,1 0 0,0 7,12V19H9M12,2A3,3 0 0,1 15,5V11H9V5A3,3 0 0,1 12,2Z" />
            ) : (
              <path d="M19,13H5V11H19V13Z" />
            )}
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="pulse-main-content">
        {/* Stats Bar */}
        <div className="pulse-stats-bar">
          <div className="pulse-stat-card">
            <div className="pulse-stat-value">{disasters.earthquakes.length}</div>
            <div className="pulse-stat-label">Earthquakes</div>
          </div>
          <div className="pulse-stat-card">
            <div className="pulse-stat-value">{disasters.wildfires.length}</div>
            <div className="pulse-stat-label">Wildfires</div>
          </div>
          <div className="pulse-stat-card">
            <div className="pulse-stat-value">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="pulse-stat-label">
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="pulse-map-container">
          <MapContainer 
            center={[35, 105]} 
            zoom={4} 
            style={{ height: '100%', width: '100%' }}
            maxBounds={[
              [ASIA_BOUNDS.minLat, ASIA_BOUNDS.minLng],
              [ASIA_BOUNDS.maxLat, ASIA_BOUNDS.maxLng]
            ]}
            maxBoundsViscosity={1.0}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {/* Earthquake Markers */}
            {disasters.earthquakes.map(quake => (
              <Marker
                key={`quake-${quake.id}`}
                position={[quake.location[1], quake.location[0]]}
                icon={earthquakeIcon}
              >
                <Popup className="pulse-popup">
                  <div className="pulse-popup-header">
                    <h3>Earthquake Alert</h3>
                    <div className="pulse-popup-magnitude">
                      M{quake.magnitude}
                    </div>
                  </div>
                  <div className="pulse-popup-content">
                    <p><strong>Location:</strong> {quake.place}</p>
                    <p><strong>Time:</strong> {new Date(quake.time).toLocaleString()}</p>
                    {quake.tsunami === 1 && (
                      <p className="pulse-tsunami-warning">⚠️ Tsunami Warning Issued</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Wildfire Markers */}
            {disasters.wildfires.map(fire => (
              <Marker
                key={`fire-${fire.id}`}
                position={[fire.location[1], fire.location[0]]}
                icon={wildfireIcon}
              >
                <Popup className="pulse-popup">
                  <div className="pulse-popup-header">
                    <h3>Wildfire Alert</h3>
                    <div className={`pulse-popup-severity ${fire.severity.toLowerCase()}`}>
                      {fire.severity}
                    </div>
                  </div>
                  <div className="pulse-popup-content">
                    <p><strong>Area:</strong> {fire.area}</p>
                    <p><strong>Reported:</strong> {new Date(fire.time).toLocaleString()}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Events List */}
        <div className="pulse-events-list">
          <div className="pulse-events-header">
            <h2>{activeTab === 'earthquakes' ? 'Recent Earthquakes' : 'Active Wildfires'}</h2>
            <div className="pulse-events-count">{activeData.length} events</div>
          </div>
          
          <div className="pulse-events-scroll">
            {activeData.length > 0 ? (
              activeData.map(event => (
                <div key={event.id} className="pulse-event-card">
                  <div className="pulse-event-icon">
                    {activeTab === 'earthquakes' ? (
                      <svg viewBox="0 0 24 24">
                        <path d="M12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2M15.5,8H16.5A1.5,1.5 0 0,1 18,9.5V10.9C18,12.2 17.24,13.43 16,14V17H15V19H14V17H10V19H9V17H8V14C6.76,13.43 6,12.2 6,10.9V9.5A1.5,1.5 0 0,1 7.5,8H8.5C8.5,7.4 8.9,7 9.5,7H14.5C15.1,7 15.5,7.4 15.5,8M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11Z" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24">
                        <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2Z" />
                      </svg>
                    )}
                  </div>
                  <div className="pulse-event-content">
                    <div className="pulse-event-header">
                      <h3>
                        {activeTab === 'earthquakes' 
                          ? `M${event.magnitude} Earthquake` 
                          : `${event.severity} Wildfire`}
                        {activeTab === 'earthquakes' && event.tsunami === 1 && (
                          <span className="pulse-tsunami-indicator">🌊 Tsunami</span>
                        )}
                      </h3>
                      <div className="pulse-event-time">
                        {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <p className="pulse-event-location">
                      {activeTab === 'earthquakes' ? event.place : event.area}
                    </p>
                    <div className="pulse-event-meta">
                      {activeTab === 'earthquakes' ? (
                        <span>Depth: {event.location[2]?.toFixed(1) || 'Unknown'} km</span>
                      ) : (
                        <span>Size: {event.acres ? `${event.acres} acres` : 'Unknown'}</span>
                      )}
                    </div>
                  </div>
                  <button className="pulse-event-more">
                    <svg viewBox="0 0 24 24">
                      <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="pulse-no-events">
                <svg viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                </svg>
                <h3>No {activeTab} detected</h3>
                <p>No recent {activeTab} have been reported in Asia</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisasterDashboard;