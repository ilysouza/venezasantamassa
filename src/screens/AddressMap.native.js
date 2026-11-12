import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function AddressMap({ coordinates, address }) {
  const region = coordinates || {
    latitude: -23.1857,
    longitude: -46.8978,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={{ height: 280, borderRadius: 15, overflow: "hidden" }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: region.latitude,
          longitude: region.longitude,
          latitudeDelta: region.latitudeDelta || 0.01,
          longitudeDelta: region.longitudeDelta || 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Endereço"
          description={address || "Localização selecionada"}
        />
      </MapView>
    </View>
  );
}