import MapView, {Marker} from "react-native-maps";
import {View} from "react-native";

function MapsDisplay({coords, onMapClick}) {
    
    const region= {
        latitude: coords?.lat || 39.8283,
        longitude: coords?.lng || -98.5795,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    };

 
    return (
        <View style={{height: 300, width: '100%'}}>
            <MapView
                style ={{flex:1}}
                region={region}
                onPress={(e) => {
                    const {latitude, longitude} = e.nativeEvent.coordinate;
                    onMapClick(latitude,longitude);
                }}>
                {coords && (
                    <Marker 
                        coordinate={{latitude: coords.lat, longitude: coords.lng}}
                     />
                    )}
            </MapView>
        </View>
    );
}

export default MapsDisplay;