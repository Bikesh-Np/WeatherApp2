import requests
import os
from datetime import datetime, timedelta
from django.conf import settings
from dotenv import load_dotenv

load_dotenv()

class DisasterService:
    @staticmethod
    def calculate_risk_levels(weather_data):
        """Calculate flood and landslide risks based on weather data"""
        rainfall = weather_data.get('rainfall', 0)
        duration = 24  
        
        FLOOD_THRESHOLD = 30  
        LANDSLIDE_THRESHOLD = 40  
        
        risks = {
            'flood': {
                'risk': 'low',
                'threshold': FLOOD_THRESHOLD,
                'current': rainfall,
                'duration': duration
            },
            'landslide': {
                'risk': 'low',
                'threshold': LANDSLIDE_THRESHOLD,
                'current': rainfall,
                'duration': duration
            }
        }
        
        # Calculate flood risk
        if rainfall >= FLOOD_THRESHOLD:
            risks['flood']['risk'] = 'high' if rainfall > FLOOD_THRESHOLD * 1.5 else 'moderate'
        
        # Calculate landslide risk (typically needs more rain than flood)
        if rainfall >= LANDSLIDE_THRESHOLD:
            risks['landslide']['risk'] = 'high' if rainfall > LANDSLIDE_THRESHOLD * 1.5 else 'moderate'
        
        return risks

    @staticmethod
    def get_weather_data(lat, lon, city_name=None):
        url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={os.getenv('OPENWEATHER_API_KEY')}&units=metric"
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            # Analyze forecast for next 12 hours (3 data points at 3h intervals)
            forecast = data.get('list', [])[:4]  # Next 12 hours (3h intervals)
            
            total_rain = 0
            rainy_hours = 0
            
            for period in forecast:
                if 'rain' in period:
                    rain = period['rain'].get('3h', 0)  # 3-hour rainfall in mm
                    total_rain += rain
                    if rain > 0:
                        rainy_hours += 1
            
            avg_rainfall = total_rain / len(forecast) if forecast else 0
            
            weather_info = {
                'temperature': data['list'][0]['main']['temp'],
                'humidity': data['list'][0]['main']['humidity'],
                'rainfall': total_rain,
                'rainy_hours': rainy_hours,
                'weather_condition': data['list'][0]['weather'][0]['main'],
                'weather_description': data['list'][0]['weather'][0]['description'],
                'wind_speed': data['list'][0]['wind']['speed'],
                'city': data['city']['name'],
                'country': data['city']['country'],
                'coordinates': {
                    'lat': data['city']['coord']['lat'],
                    'lon': data['city']['coord']['lon']
                },
                'time': datetime.now().isoformat(),
                'forecast': forecast
            }
            
            # Calculate risks
            risks = DisasterService.calculate_risk_levels({
                'rainfall': avg_rainfall,
                'duration': rainy_hours * 3  # Convert to hours
            })
            
            weather_info['risks'] = risks
            
            return weather_info
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_earthquakes(days=360, min_magnitude=4.5):
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        url = f"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime={start_date.strftime('%Y-%m-%d')}&endtime={end_date.strftime('%Y-%m-%d')}&minmagnitude={min_magnitude}"
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_wildfires():
        url = f"https://eonet.gsfc.nasa.gov/api/v3/events?api_key={os.getenv('NASA_API_KEY')}&category=wildfires"
        try:
            response = requests.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {'error': str(e)}