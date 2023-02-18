import {
  LocationObject,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import { useState, useRef, useEffect } from "react";
import { Platform, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { styles } from "./styles";

export default function HomeScreen() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    try {
      if (granted) {
        const currentPosition = await getCurrentPositionAsync();
        setLocation(currentPosition);

        //    console.log("LOCALIZAÇÃO ATUAL => ", currentPosition);
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
          //    console.log("NOVA LOCALIZAÇÃO: ", response);
          setLocation(response);
          mapRef.current?.animateCamera({
            pitch: 70,
            center: response.coords,
          });
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
          provider={
            Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
          zoomEnabled={true}
          showsUserLocation={true}
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
