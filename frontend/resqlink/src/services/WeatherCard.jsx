import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './WeatherCard.css';
import { FaSearch } from 'react-icons/fa';
import sirenSound from './siren.mp3';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentCity, setCurrentCity] = useState('Kathmandu');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const sirenAudioRef = useRef(null);

  // Initialize siren sound
  useEffect(() => {
    sirenAudioRef.current = new Audio(sirenSound);
    sirenAudioRef.current.loop = true;
    
    return () => {
      if (sirenAudioRef.current) {
        sirenAudioRef.current.pause();
        sirenAudioRef.current = null;
      }
    };
  }, []);

  const handleUserInteraction = () => {
    setUserInteracted(true);
    document.removeEventListener('click', handleUserInteraction);
  };

  useEffect(() => {
    document.addEventListener('click', handleUserInteraction);
    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const fetchWeatherData = async (city = 'Kathmandu') => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await axios.get('/api/disasters/weather/', {
        params: { city }
      });
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      
      const processedData = {
        ...response.data,
        risks: response.data.risks || {
          flood: { risk: 'low', threshold: 20, current: 0, duration: 0 },
          landslide: { risk: 'low', threshold: 30, current: 0, duration: 0 }
        }
      };
      
      setWeatherData(processedData);
      setCurrentCity(city);

      // Check for dual high risk
      const floodHigh = processedData.risks?.flood?.risk === 'high';
      const landslideHigh = processedData.risks?.landslide?.risk === 'high';
      
      if (floodHigh && landslideHigh) {
        activateEmergencyAlert();
      } else {
        deactivateEmergencyAlert();
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch weather data');
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const activateEmergencyAlert = () => {
    if (!userInteracted) {
      console.log('Waiting for user interaction before playing sound');
      return;
    }
    
    setIsSirenActive(true);
    if (sirenAudioRef.current) {
      sirenAudioRef.current.currentTime = 0;
      sirenAudioRef.current.play()
        .then(() => {
          setTimeout(deactivateEmergencyAlert, 5000);
        })
        .catch(e => {
          console.error("Audio playback failed:", e);
          setIsSirenActive(false);
        });
    }
  };

  const deactivateEmergencyAlert = () => {
    setIsSirenActive(false);
    if (sirenAudioRef.current) {
      sirenAudioRef.current.pause();
      sirenAudioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeatherData(searchQuery);
    }
  };

  const renderRiskIndicator = (riskLevel) => {
    switch (riskLevel) {
      case 'high': return <span className="risk-icon high-risk">🔥</span>;
      case 'moderate': return <span className="risk-icon moderate-risk">⚠️</span>;
      default: return <span className="risk-icon low-risk">✅</span>;
    }
  };

  const renderWeatherIcon = (condition) => {
    const icons = {
      Rain: '🌧️',
      Clouds: '☁️',
      Clear: '☀️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Drizzle: '🌦️',
      Mist: '🌫️',
      default: '🌈'
    };
    return <span className="weather-icon">{icons[condition] || icons.default}</span>;
  };

  if (isLoading && !weatherData) {
    return (
      <div className="eco-loading-screen">
        <div className="eco-spinner">
          <div className="leaf-spin">🍃</div>
        </div>
        <p className="loading-text">Analyzing regional weather patterns...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="eco-error-screen">
        <div className="error-icon">❌</div>
        <h3>Data Retrieval Failed</h3>
        <p>{errorMessage}</p>
        <button className="eco-retry-btn" onClick={() => fetchWeatherData()}>
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className={`eco-dashboard ${isSirenActive ? 'emergency-mode' : ''}`}>
      {isSirenActive && (
        <div className="eco-alert-banner pulse">
          🚨 CRISIS ALERT: Simultaneous Flood & Landslide Threat Detected! 🚨
        </div>
      )}

      <header className="eco-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="app-icon">🌿</span> EcoRisk Monitor
          </h1>
          <p className="app-tagline">Sustainable environmental threat assessment</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="eco-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city..."
            className="search-input"
          />
          <button type="submit" className="search-btn">
          <span className="time-icon"><FaSearch /></span> 
          </button>
        </form>
      </header>

      {weatherData && (
        <main className="eco-main-content">
          {/* Location Section */}
          <section className="eco-location">
            <h2 className="location-title">
              <span className="location-icon">📍</span> 
              {weatherData.city || 'Unknown Location'}, {weatherData.country || ''}
            </h2>
            <p className="location-time">
              <span className="time-icon">🕒</span> 
              {new Date(weatherData.time).toLocaleString()}
            </p>
          </section>

          {/* Weather Summary */}
          <section className="eco-weather-card">
            <div className="weather-visual">
              {renderWeatherIcon(weatherData.weather_condition)}
              <div className="temperature">
                {Math.round(weatherData.temperature)}°C
              </div>
            </div>
            <p className="weather-desc">
              {weatherData.weather_description || 'Weather data unavailable'}
            </p>
            
            <div className="weather-stats">
              <div className="stat-item">
                <span className="stat-icon">💧</span>
                <span className="stat-value">{weatherData.humidity || '--'}%</span>
                <span className="stat-label">Humidity</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🌧️</span>
                <span className="stat-value">
                  {weatherData.rainfall ? weatherData.rainfall.toFixed(1) : '0'}mm
                </span>
                <span className="stat-label">Rainfall</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💨</span>
                <span className="stat-value">{weatherData.wind_speed || '--'} m/s</span>
                <span className="stat-label">Wind</span>
              </div>
            </div>
          </section>

          {/* Risk Assessment */}
          <section className="eco-risk-section">
            <h3 className="section-title">
              <span className="section-icon">⚠️</span> Hazard Analysis
            </h3>
            <div className="risk-cards">
              <div className={`risk-card ${weatherData.risks?.flood?.risk || 'low'}`}>
                <div className="risk-header">
                  {renderRiskIndicator(weatherData.risks?.flood?.risk || 'low')}
                  <h4>Flood Risk</h4>
                </div>
                <div className="risk-level">
                  {(weatherData.risks?.flood?.risk || 'low').toUpperCase()}
                </div>
                <div className="risk-meter">
                  <div 
                    className="meter-fill"
                    style={{
                      width: `${Math.min(100, (weatherData.risks?.flood?.current || 0) / (weatherData.risks?.flood?.threshold || 20) * 100)}%`,
                      backgroundColor: weatherData.risks?.flood?.risk === 'high' 
                        ? '#ff6b6b' 
                        : weatherData.risks?.flood?.risk === 'moderate' 
                          ? '#ffd166' 
                          : '#06d6a0'
                    }}
                  ></div>
                </div>
                <div className="risk-details">
                  <p>
                    <span className="detail-icon">📊</span> 
                    Current: {weatherData.risks?.flood?.current?.toFixed(1) || '0'}mm
                  </p>
                  <p>
                    <span className="detail-icon">⏱️</span> 
                    Duration: {weatherData.risks?.flood?.duration || '0'}h
                  </p>
                  <p className="threshold">
                    <span className="detail-icon">📈</span> 
                    Threshold: {weatherData.risks?.flood?.threshold || '20'}mm/h
                  </p>
                </div>
              </div>

              <div className={`risk-card ${weatherData.risks?.landslide?.risk || 'low'}`}>
                <div className="risk-header">
                  {renderRiskIndicator(weatherData.risks?.landslide?.risk || 'low')}
                  <h4>Landslide Risk</h4>
                </div>
                <div className="risk-level">
                  {(weatherData.risks?.landslide?.risk || 'low').toUpperCase()}
                </div>
                <div className="risk-meter">
                  <div 
                    className="meter-fill"
                    style={{
                      width: `${Math.min(100, (weatherData.risks?.landslide?.current || 0) / (weatherData.risks?.landslide?.threshold || 30) * 100)}%`,
                      backgroundColor: weatherData.risks?.landslide?.risk === 'high' 
                        ? '#ff6b6b' 
                        : weatherData.risks?.landslide?.risk === 'moderate' 
                          ? '#ffd166' 
                          : '#06d6a0'
                    }}
                  ></div>
                </div>
                <div className="risk-details">
                  <p>
                    <span className="detail-icon">📊</span> 
                    Current: {weatherData.risks?.landslide?.current?.toFixed(1) || '0'}mm
                  </p>
                  <p>
                    <span className="detail-icon">⏱️</span> 
                    Duration: {weatherData.risks?.landslide?.duration || '0'}h
                  </p>
                  <p className="threshold">
                    <span className="detail-icon">📈</span> 
                    Threshold: {weatherData.risks?.landslide?.threshold || '30'}mm/h
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Recommendations */}
          <section className="eco-recommendations">
            <h3 className="section-title">
              <span className="section-icon">💡</span> Safety Tips
            </h3>
            {weatherData.risks?.flood?.risk === 'high' || weatherData.risks?.landslide?.risk === 'high' ? (
              <div className="emergency-tip">
                <p>⚠️ <strong>Immediate Action:</strong> High risk detected. Follow local evacuation orders and move to higher ground.</p>
              </div>
            ) : (
              <div className="normal-tip">
                <p>✅ <strong>Eco-Friendly Advisory:</strong> Conditions are favorable for sustainable outdoor activities.</p>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};

export default WeatherCard;