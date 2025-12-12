  import { StatusBar } from 'expo-status-bar';
  import React, { useState } from 'react';
  import {StyleSheet, Text, View, Button, ActivityIndicator, Alert } from "react-native";
  import axios from "axios";
  import * as Location from "expo-location";
  import WeatherForm from "./components/WeatherForm";
  import WeatherDisplay from "./components/WeatherDisplay";
  import MapsDisplay from "./components/MapsDisplay";


  export default function App() {
      const [weather, setWeather] = useState(null);
      const [coords, setCoords] = useState(null);
      const [loading, setLoading] = useState(false);

      const handleSearch = async (lat, lng) => {
        setLoading(true);
        setWeather(null);

        try {
            const pointResponse = await axios.get(`https://api.weather.gov/points/${lat},${lng}`);
            const {cwa: office, gridX, gridY} = pointResponse.data.properties;
            
            const forecastResponse = await axios.get(
            `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`
            );
            
            setWeather(forecastResponse.data);
            setCoords({ lat: Number(lat), lng: Number(lng) });
          } catch (error) {
            console.error("Error fetching weather:", error);
          } finally {
            setLoading(false);
          }
      };

      const getMyLocationWeather = async () => {
        let {status} = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission denied", "Location permission is required.");
          return;
        }

        try {
        const loc = await Location.getCurrentPositionAsync({});
        handleSearch(loc.coords.latitude, loc.coords.longitude);
        } catch (error){
          console.error("Error getting location:", error);
          Alert.alert ("Error", "Unable to get location. Try again.");
        }
        }

      return (
          <View style={styles.container}>

            <Text style={styles.title}>Weather App with Google Maps</Text>

            <WeatherForm onSearch={handleSearch} coords={coords} />

            <Button
              title="Get Weather for my location."
              onPress={getMyLocationWeather}
            />

            {loading && <ActivityIndicator size="large" />}
            {!loading && weather && <WeatherDisplay weatherData={weather}/>}

            <MapsDisplay coords={coords || {lat: 39.8283, lng: -98.5795}} onMapClick={handleSearch} />
              
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
    }
  });
    

  
    
