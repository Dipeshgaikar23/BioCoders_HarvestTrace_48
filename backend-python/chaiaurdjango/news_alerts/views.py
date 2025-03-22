import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse

@api_view(["GET"])
def get_weather_data(request):
    # Example: Default location (change as needed)
    latitude = request.GET.get("lat", "28.7041")  # Default: Delhi
    longitude = request.GET.get("lon", "77.1025")

    url = f"https://api.open-meteo.com/v1/forecast?latitude={latitude}&longitude={longitude}&daily=weathercode&timezone=auto"

    response = requests.get(url)
    data = response.json()

    if "daily" in data:
        weather_code = data["daily"]["weathercode"][0]

        # Convert weather code into farming advice
        farm_tip = generate_farming_advice(weather_code)

        return Response({"weather_code": weather_code, "advice": farm_tip})
    
    return Response({"error": "Failed to fetch weather data"}, status=500)


def generate_farming_advice(weather_code):
    """Generates simple farming advice based on weather conditions."""
    advice_dict = {
        0: "Clear sky today. Good day for irrigation.",
        1: "Partly cloudy. Monitor soil moisture.",
        2: "Cloudy. Expect lower sunlight for crops.",
        3: "Rain expected! Protect crops from excess water.",
        45: "Foggy conditions. Watch out for pest risks.",
        61: "Light rain showers. Mild watering for plants.",
        63: "Heavy rain! Check for water drainage issues.",
        71: "Snowfall. Protect winter crops.",
        80: "Thunderstorms. Delay outdoor activities.",
    }
    return advice_dict.get(weather_code, "No specific advice available.")



