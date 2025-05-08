import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaTimes, FaInfoCircle, FaMapMarkerAlt, FaCrosshairs, FaLeaf } from 'react-icons/fa';
import './MapModal.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapModal = ({ latitude, longitude, accuracy, onClose }) => {
  const position = [parseFloat(latitude), parseFloat(longitude)];
  const accuracyRadius = accuracy ? parseFloat(accuracy) : 10;

  return (
    <div className="map-modal-overlay" onClick={onClose}>
      <div className="map-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <div className="map-header">
          <h3><FaMapMarkerAlt className="icon-pulse" /> <FaLeaf className="leaf-icon" /> Message Location</h3>
          <div className="location-details">
            <p><span className="detail-label">Latitude:</span> <span className="detail-value">{parseFloat(latitude).toFixed(6)}</span></p>
            <p><span className="detail-label">Longitude:</span> <span className="detail-value">{parseFloat(longitude).toFixed(6)}</span></p>
            <p><span className="detail-label">Accuracy:</span> <span className="detail-value"><FaCrosshairs /> ±{accuracyRadius.toFixed(0)} meters</span></p>
          </div>
        </div>
        <div className="map-container">
          <MapContainer 
            center={position} 
            zoom={15} 
            scrollWheelZoom={true}
            className="leaflet-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup className="custom-popup">
                <div className="map-popup">
                  <FaInfoCircle className="popup-icon" /> <strong>Message Location</strong><br />
                  <span className="popup-text">Lat: {parseFloat(latitude).toFixed(6)}</span><br />
                  <span className="popup-text">Lng: {parseFloat(longitude).toFixed(6)}</span><br />
                  <span className="popup-text">Accuracy: ±{accuracyRadius.toFixed(0)}m</span>
                </div>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
        <div className="map-footer">
          <p>Zoom in/out to explore the location</p>
          <div className="nature-icons">
            <FaLeaf className="nature-icon" />
            <FaLeaf className="nature-icon" />
            <FaLeaf className="nature-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;