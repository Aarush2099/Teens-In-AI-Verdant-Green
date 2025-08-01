import requests
import pandas as pd
import os
from dotenv import load_dotenv
from typing import Dict, Optional, Union
from datetime import datetime, timedelta
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# Load OpenWeatherMap API Key from environment variables
OPENWEATHERMAP_API_KEY = os.getenv("OPENWEATHERMAP_API_KEY")

def fetch_weather_data(lat: float, lon: float, date: str) -> Dict[str, Optional[float]]:
    """
    Fetches historical weather data for a given location and date.
    
    Args:
        lat (float): Latitude of the location
        lon (float): Longitude of the location
        date (str): Date string in YYYY-MM-DD format
        
    Returns:
        Dict containing weather metrics or None values if data fetch fails
    """
    if not OPENWEATHERMAP_API_KEY:
        raise ValueError("OPENWEATHERMAP_API_KEY environment variable is not set.")

    # Validate date is within 5 days
    try:
        date_obj = pd.to_datetime(date)
        if date_obj > datetime.now() or date_obj < datetime.now() - timedelta(days=5):
            raise ValueError("Date must be within the last 5 days due to API limitations")
        dt_timestamp = int(date_obj.timestamp())
    except Exception as e:
        logger.error(f"Date parsing error: {e}")
        raise ValueError(f"Invalid date format: {date}. Error: {e}")

    url = (
        f"https://api.openweathermap.org/data/2.5/onecall/timemachine"
        f"?lat={lat}&lon={lon}&dt={dt_timestamp}&units=metric"
        f"&appid={OPENWEATHERMAP_API_KEY}"
    )
    
    empty_response = {
        'avg_temp_c': None,
        'avg_humidity_percent': None,
        'total_rainfall_mm': None,
        'num_data_points': 0
    }

    try:
        response = requests.get(url, timeout=10)  # Add timeout
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.HTTPError as e:
        logger.error(f"HTTP Error fetching weather data: {e.response.status_code} - {e.response.text}")
        return empty_response
    except requests.exceptions.RequestException as e:
        logger.error(f"Request Error fetching weather data: {e}")
        return empty_response

    hourly_data = data.get('hourly', [])

    if not hourly_data:
        logger.warning(f"No hourly data found for {lat}, {lon} on {date}.")
        return empty_response

    try:
        temps = [h['temp'] for h in hourly_data if 'temp' in h]
        humidities = [h['humidity'] for h in hourly_data if 'humidity' in h]
        rainfalls = [
            h.get('rain', {}).get('1h', 0) 
            for h in hourly_data
        ]

        return {
            'avg_temp_c': round(pd.Series(temps).mean(), 2) if temps else None,
            'avg_humidity_percent': round(pd.Series(humidities).mean(), 2) if humidities else None,
            'total_rainfall_mm': round(pd.Series(rainfalls).sum(), 2) if rainfalls else 0.0,
            'num_data_points': len(hourly_data)
        }
    except Exception as e:
        logger.error(f"Error processing weather data: {e}")
        return empty_response

def get_soil_type_from_coords(lat: float, lon: float) -> Dict[str, Union[str, float]]:
    """
    Get soil type and properties from coordinates.
    
    Args:
        lat (float): Latitude of the location
        lon (float): Longitude of the location
        
    Returns:
        Dict containing soil type, pH level and texture
    """
    try:
        # This is dummy data for demonstration purposes
        # Replace with actual API calls in a real project
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            raise ValueError("Invalid coordinates")

        if (lat + lon) % 2 == 0:
            return {"soil_type": "loamy", "ph_level": 6.5, "texture": "medium"}
        elif (lat + lon) % 3 == 0:
            return {"soil_type": "sandy", "ph_level": 7.0, "texture": "coarse"}
        else:
            return {"soil_type": "clay", "ph_level": 6.0, "texture": "fine"}
    except Exception as e:
        logger.error(f"Error getting soil data: {e}")
        return {"soil_type": "unknown", "ph_level": None, "texture": "unknown"}

if __name__ == '__main__':
    try:
        test_lat, test_lon = 40.7128, -74.0060
        test_date = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

        logger.info(f"Fetching weather data for {test_lat}, {test_lon} on {test_date}...")
        weather_result = fetch_weather_data(test_lat, test_lon, test_date)
        logger.info(f"Weather Data: {weather_result}")

        logger.info(f"\nFetching soil data for {test_lat}, {test_lon}...")
        soil_result = get_soil_type_from_coords(test_lat, test_lon)
        logger.info(f"Soil Data: {soil_result}")
    except Exception as e:
        logger.error(f"Test execution failed: {e}")