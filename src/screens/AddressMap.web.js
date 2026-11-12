import React from "react";
import { View, Text, Pressable, Linking } from "react-native";

export default function AddressMap({ coordinates, address }) {
  const location = coordinates
    ? `${coordinates.latitude},${coordinates.longitude}`
    : address || "Brasil";

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    location
  )}&output=embed`;

  return (
    <View style={{ height: 280, overflow: "hidden", borderRadius: 15 }}>
      {React.createElement("iframe", {
        src: mapUrl,
        title: "Google Maps",
        width: "100%",
        height: "280",
        style: { border: 0 },
        allowFullScreen: true,
        loading: "lazy",
      })}
      <Pressable
        onPress={() =>
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              location
            )}`
          )
        }
      >
        <Text style={{ color: "#D92B20", marginTop: 8 }}>
          Abrir no Google Maps
        </Text>
      </Pressable>
    </View>
  );
}