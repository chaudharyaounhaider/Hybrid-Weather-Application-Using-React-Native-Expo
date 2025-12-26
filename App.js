import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import * as Location from "expo-location";

// Ensure you have these components created in your project structure
import WeatherForm from "./components/WeatherForm";
import WeatherDisplay from "./components/WeatherDisplay";
import MapsDisplay from "./components/MapsDisplay";

export default function App() {
  const [weather, setWeather] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (lat, lng) => {
    // Basic Input Validation
    if (!lat || !lng) {
      Alert.alert("Invalid Input", "Please provide valid latitude and longitude coordinates.");
      return;
    }

    setLoading(true);
    setWeather(null); // Clear previous data while loading

    try {
      // 1. Get Grid Points
      // Note: The NWS API requires a User-Agent header to prevent 403 errors.
      const pointResponse = await axios.get(`https://api.weather.gov/points/${lat},${lng}`, {
        headers: { 'User-Agent': 'my-weather-app-student-project' }
      });

      const { cwa: office, gridX, gridY } = pointResponse.data.properties;

      // 2. Get Forecast Data
      const forecastResponse = await axios.get(
        `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`,
        { headers: { 'User-Agent': 'my-weather-app-student-project' } }
      );

      setWeather(forecastResponse.data);
      setCoords({ lat: Number(lat), lng: Number(lng) });

    } catch (error) {
      console.error("Error fetching weather:", error);
      // improved Error Handling for the User
      Alert.alert("Fetch Error", "Could not retrieve weather data. Please check the coordinates or your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  const getMyLocationWeather = async () => {
    // Request Permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission denied", "Location permission is required to use this feature.");
      return;
    }

    try {
      setLoading(true); 
      const loc = await Location.getCurrentPositionAsync({});
      // Pass coordinates to the search handler
      handleSearch(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error("Error getting location:", error);
      Alert.alert("Location Error", "Unable to get current location. Please try again.");
      setLoading(false); // Ensure loading stops if location fails
    }
  };

  return (
    <View style={styles.container}>
      {/* StatusBar for better UI visibility on mobile */}
      <StatusBar style="auto" /> 

      <Text style={styles.title}>Weather App with Google Maps</Text>

      {/* Form to manually input coordinates */}
      <WeatherForm onSearch={handleSearch} coords={coords} />

      <View style={styles.buttonContainer}>
        <Button
          title="Get Weather for My Location"
          onPress={getMyLocationWeather}
        />
      </View>

      {/* Loading Indicator */}
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      {/* Weather Display (Only shows if not loading and weather data exists) */}
      {!loading && weather && <WeatherDisplay weatherData={weather} />}

      {/* Map Display */}
      <MapsDisplay 
        coords={coords || { lat: 39.8283, lng: -98.5795 }} // Default to center of US if no coords
        onMapClick={handleSearch} 
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  }
});
