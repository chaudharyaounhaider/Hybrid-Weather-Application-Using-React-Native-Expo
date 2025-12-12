import React, { useEffect, useState } from "react";
import {View, TextInput, Button} from "react-native";

function WeatherForm({ onSearch, coords }) {
    const [lat, setLat] = useState(coords?.lat || "");
    const[lng, setLng] = useState(coords?.lng || "");
    
    useEffect(() => {
        if (coords) {
        setLat(coords.lat);
        setLng(coords.lng);
    }
    }, [coords]);

    return (
        <View style={{ margin: 10}}>
            <TextInput
                placeholder="Latitude"
                value={lat}
                onChangeText={setLat}
                keyboardType="numeric"
                style={{borderWidth: 1, marginBottom: 10, padding: 5}}
            />
            <TextInput
                placeholder="Longitude"
                value={lng}
                onChangeText={setLng}
                keyboardType="numeric"
                style={{borderWidth: 1, marginBottom: 10, padding: 5}}
            />

            <Button
                title="Search"
                onPress={() => onSearch(lat, lng)}
            />
            </View>
    );
}

export default WeatherForm;