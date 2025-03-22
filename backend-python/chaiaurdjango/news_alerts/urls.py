from django.urls import path
from .views import get_weather_data

urlpatterns = [
    path('', get_weather_data, name="weather"),
]
