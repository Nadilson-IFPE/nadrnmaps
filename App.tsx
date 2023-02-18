import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { styles } from "./styles";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    try {
      if (granted) {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);

        console.log("LOCALIZAÇÃO ATUAL => ", currentPosition);
      }
    } catch (error) {
      console.log("getCurrentPositionAsync error: ", error);
    }
  }

  useEffect(() => {
    try {
      requestLocationPermissions();
    } catch (error) {
      console.log("requestLocationPermissions error: ", error);
    }
  }, []);

  useEffect(() => {
    try {
      watchPositionAsync(
        {
          accuracy: LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (response) => {
          console.log("NOVA LOCALIZAÇÃO: ", response);
          setLocation(response);
        }
      );
    } catch (error) {
      console.log("watchPositionAsync error: ", error);
    }
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}
