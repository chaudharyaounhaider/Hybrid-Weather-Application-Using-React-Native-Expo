import React from "react";
import { View, Text } from "react-native";

const WeatherDisplay = ({weatherData}) => {
    if (!weatherData) return null;

    const summary = weatherData.properties.periods[0];

    return (
        <View>
            <Text>Weather Forecast</Text>
            <Text>Condition: {summary.shortForecast}</Text>
            <Text>Temperature: {summary.temperature} °{summary.temperatureUnit}</Text>
            <Text>Wind: {summary.windSpeed} {summary.windDirection}</Text>
        </View>
    );
};  

export default WeatherDisplay;