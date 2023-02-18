import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  LocationObject,
} from "expo-location";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { styles } from "./styles";

export default function App() {
  const [location, setLocation] = useState<LocationObject | null>(null);

  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);

      console.log("LOCALIZAÇÃO ATUAL => ", currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermissions();
  }, []);

  return <View style={styles.container}></View>;
}
