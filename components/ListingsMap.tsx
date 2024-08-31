import {
  Alert,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Marker, Region } from "react-native-maps";
import MapView from "react-native-map-clustering";
import { defaultStyles } from "@/constants/Styles";
import * as Location from "expo-location";
import { ListingGeo } from "@/types/ListingGeo";

import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

interface Props {
  listings: any;
}

const ListingsMap = ({ listings }: Props) => {
  const [location, setLocation] = useState<Region | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const mapRef = useRef<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert("Permission to access location was denied");
        return;
      }

      let initialLocation = await Location.getCurrentPositionAsync({});
      const region = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      setLocation(region);
      mapRef.current?.animateToRegion(region);
    })();
  }, []);

  if (!location) {
    return (
      <View style={[defaultStyles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      </View>
    );
  }

  const onMarkerSelected = (event: any) => {
    // Handle marker selection here (e.g., navigate to the listing page)
    router.push(`/listings/${event.properties.id}`);
  };

  const renderCluster = (cluster: any) => {
    const { id, geometry, onPress, properties } = cluster;
    const points = properties.point_count;

    return (
      <Marker
        key={`cluster-${id}`}
        coordinate={{
          longitude: geometry.coordinates[0],
          latitude: geometry.coordinates[1],
        }}
        onPress={onPress}
      >
        <View style={styles.clusterMarker}>
          <Text style={styles.clusterText}>{points}</Text>
        </View>
      </Marker>
    );
  };

  const onLocateMe = () => {
    if (location) {
      mapRef.current?.animateToRegion(location);
    }
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <MapView
        ref={mapRef}
        clusterColor="#fff"
        clusterTextColor="#000"
        clusterFontFamily="jakata-sb"
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={false}
        initialRegion={location}
        renderCluster={renderCluster}
      >
        {listings.features.map((item: ListingGeo) => (
          <Marker
            coordinate={{
              latitude: +item.properties.latitude,
              longitude: +item.properties.longitude,
            }}
            key={item.properties.id}
            onPress={() => onMarkerSelected(item)}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>SLE {item.properties.price}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <TouchableOpacity style={styles.locateBtn} onPress={onLocateMe}>
        <Ionicons name="navigate" size={24} color={Colors.dark} />
      </TouchableOpacity>
    </View>
  );
};

export default ListingsMap;

const styles = StyleSheet.create({
  centered: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  errorText: {
    marginTop: 10,
    color: "red",
    fontSize: 16,
  },
  marker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 10 },
  },
  markerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  clusterMarker: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    borderRadius: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 10 },
  },
  clusterText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  locateBtn: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 1, height: 10 },
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
