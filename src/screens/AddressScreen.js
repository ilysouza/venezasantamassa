
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AddressMap from "./AddressMap";

const COLORS = {
  red: "#C9232C",
  darkRed: "#971A21",
  orange: "#F28C28",
  cream: "#FFF8F0",
  white: "#FFFFFF",
  dark: "#292321",
  gray: "#77716D",
};

export default function AddressScreen({ onBack }) {
  const [cep, setCep] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMap, setLoadingMap] = useState(false);

  const [address, setAddress] = useState({
    logradouro: "",
    bairro: "",
    localidade: "",
    uf: "",
    numero: "",
    complemento: "",
  });

  // Começa sem coordenadas para não mostrar um local incorreto.
  const [coordinates, setCoordinates] = useState(null);

  function formatCEP(value) {
    const numbers = value.replace(/\D/g, "");

    if (numbers.length <= 5) {
      return numbers;
    }

    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  }

  // Procura as coordenadas do endereço usando OpenStreetMap.
  async function geocodeAddress(addressData) {
    const parts = [
      addressData.numero,
      addressData.logradouro,
      addressData.bairro,
      addressData.localidade,
      addressData.uf,
      "Brasil",
    ].filter(Boolean);

    const query = parts.join(", ");

    if (!addressData.logradouro && !addressData.localidade) {
      setCoordinates(null);
      return false;
    }

    try {
      const url =
        "https://nominatim.openstreetmap.org/search" +
        `?format=jsonv2&q=${encodeURIComponent(query)}` +
        "&limit=1&countrycodes=br";

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao consultar localização");
      }

      const results = await response.json();

      if (!results || results.length === 0) {
        setCoordinates(null);
        return false;
      }

      setCoordinates({
        latitude: Number(results[0].lat),
        longitude: Number(results[0].lon),
      });

      return true;
    } catch (error) {
      console.log("Erro ao localizar endereço:", error);
      setCoordinates(null);
      return false;
    }
  }

  async function searchCEP() {
    const cleanCEP = cep.replace(/\D/g, "");

    if (cleanCEP.length !== 8) {
      Alert.alert(
        "CEP inválido",
        "Digite um CEP com 8 números."
      );
      return;
    }

    setLoading(true);
    setCoordinates(null);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCEP}/json/`
      );

      if (!response.ok) {
        throw new Error("Erro ao consultar CEP");
      }

      const data = await response.json();

      if (data.erro) {
        Alert.alert(
          "CEP não encontrado",
          "Não encontramos esse CEP."
        );
        return;
      }

      const newAddress = {
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        localidade: data.localidade || "",
        uf: data.uf || "",
        numero: address.numero,
        complemento: address.complemento,
      };

      setAddress(newAddress);

      setLoadingMap(true);

      const found = await geocodeAddress(newAddress);

      if (!found) {
        Alert.alert(
          "Endereço encontrado",
          "Os dados do CEP foram preenchidos, mas não encontramos as coordenadas desse endereço no mapa. Confira o endereço e tente atualizar a localização."
        );
      }
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível consultar o CEP. Verifique sua conexão e tente novamente."
      );
    } finally {
      setLoading(false);
      setLoadingMap(false);
    }
  }

  // Tenta localizar novamente usando também o número da residência.
  async function updateMapLocation() {
    if (!address.logradouro || !address.localidade) {
      Alert.alert(
        "Busque o CEP primeiro",
        "Preencha o CEP antes de atualizar o mapa."
      );
      return;
    }

    setLoadingMap(true);

    const found = await geocodeAddress(address);

    setLoadingMap(false);

    if (found) {
      Alert.alert(
        "Localização atualizada!",
        "Encontramos uma localização para o endereço informado. Confira o marcador no mapa."
      );
    } else {
      Alert.alert(
        "Localização não encontrada",
        "Não encontramos esse endereço no mapa. Confira os dados digitados."
      );
    }
  }

  function saveAddress() {
    if (!address.logradouro || !address.numero) {
      Alert.alert(
        "Complete o endereço",
        "Informe pelo menos a rua e o número."
      );
      return;
    }

    if (!coordinates) {
      Alert.alert(
        "Localização pendente",
        "Não foi possível localizar seu endereço no mapa. Atualize a localização antes de salvar."
      );
      return;
    }

    Alert.alert(
      "Endereço salvo! 📍",
      `${address.logradouro}, ${address.numero}\n${address.bairro}\n${address.localidade} - ${address.uf}`,
      [
        {
          text: "OK",
          onPress: onBack,
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          Meu endereço
        </Text>

        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Onde devemos entregar? 📍
        </Text>

        <Text style={styles.subtitle}>
          Digite seu CEP e preencheremos o endereço automaticamente.
        </Text>

        <Text style={styles.label}>CEP</Text>

        <View style={styles.cepRow}>
          <TextInput
            value={cep}
            onChangeText={(value) => setCep(formatCEP(value))}
            placeholder="00000-000"
            keyboardType="numeric"
            maxLength={9}
            style={styles.cepInput}
          />

          <Pressable
            style={styles.searchButton}
            onPress={searchCEP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.searchText}>Buscar</Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.label}>Rua</Text>

        <TextInput
          value={address.logradouro}
          onChangeText={(value) =>
            setAddress((current) => ({
              ...current,
              logradouro: value,
            }))
          }
          placeholder="Rua / Avenida"
          style={styles.input}
        />

        <View style={styles.twoColumns}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Número</Text>

            <TextInput
              value={address.numero}
              onChangeText={(value) =>
                setAddress((current) => ({
                  ...current,
                  numero: value,
                }))
              }
              placeholder="123"
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Complemento</Text>

            <TextInput
              value={address.complemento}
              onChangeText={(value) =>
                setAddress((current) => ({
                  ...current,
                  complemento: value,
                }))
              }
              placeholder="Apto, casa..."
              style={styles.input}
            />
          </View>
        </View>

        <Text style={styles.label}>Bairro</Text>

        <TextInput
          value={address.bairro}
          onChangeText={(value) =>
            setAddress((current) => ({
              ...current,
              bairro: value,
            }))
          }
          placeholder="Bairro"
          style={styles.input}
        />

        <View style={styles.twoColumns}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Cidade</Text>

            <TextInput
              value={address.localidade}
              onChangeText={(value) =>
                setAddress((current) => ({
                  ...current,
                  localidade: value,
                }))
              }
              placeholder="Cidade"
              style={styles.input}
            />
          </View>

          <View style={{ width: 90 }}>
            <Text style={styles.label}>UF</Text>

            <TextInput
              value={address.uf}
              editable={false}
              style={[
                styles.input,
                styles.disabledInput,
              ]}
            />
          </View>
        </View>

        <Text style={styles.mapTitle}>
          Confira a localização
        </Text>

        <View style={styles.mapContainer}>
          {loadingMap ? (
            <View style={styles.mapMessage}>
              <ActivityIndicator color={COLORS.red} size="large" />
              <Text style={styles.mapMessageText}>
                Procurando seu endereço no mapa...
              </Text>
            </View>
          ) : coordinates ? (
            <AddressMap
              coordinates={coordinates}
              address={`${address.logradouro}, ${address.numero}, ${address.localidade} - ${address.uf}`}
            />
          ) : (
            <View style={styles.mapMessage}>
              <Text style={styles.mapEmoji}>📍</Text>
              <Text style={styles.mapMessageText}>
                Digite e busque seu CEP para localizar o endereço.
              </Text>
            </View>
          )}
        </View>

        <Pressable
          style={styles.updateMapButton}
          onPress={updateMapLocation}
          disabled={loadingMap || loading}
        >
          <Text style={styles.updateMapText}>
            Atualizar localização com número
          </Text>
        </Pressable>

        <Pressable
          style={styles.saveButton}
          onPress={saveAddress}
        >
          <Text style={styles.saveButtonText}>
            Salvar endereço
          </Text>
        </Pressable>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  header: {
    backgroundColor: COLORS.red,
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    color: COLORS.white,
    fontSize: 36,
    lineHeight: 35,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "900",
  },

  content: {
    padding: 18,
  },

  title: {
    color: COLORS.dark,
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 6,
  },

  subtitle: {
    color: COLORS.gray,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 22,
  },

  label: {
    color: COLORS.dark,
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 6,
    marginTop: 12,
  },

  cepRow: {
    flexDirection: "row",
    gap: 9,
  },

  cepInput: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E4D8CF",
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 14,
  },

  searchButton: {
    backgroundColor: COLORS.red,
    borderRadius: 11,
    paddingHorizontal: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  searchText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
  },

  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: "#E4D8CF",
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 13,
    color: COLORS.dark,
  },

  disabledInput: {
    backgroundColor: "#EEE8E3",
  },

  twoColumns: {
    flexDirection: "row",
    gap: 12,
  },

  mapTitle: {
    color: COLORS.dark,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 25,
    marginBottom: 10,
  },

  mapContainer: {
    height: 260,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2D7CF",
  },

  mapMessage: {
    flex: 1,
    backgroundColor: "#F1EAE4",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  mapEmoji: {
    fontSize: 35,
    marginBottom: 8,
  },

  mapMessageText: {
    color: COLORS.gray,
    fontSize: 13,
    textAlign: "center",
  },

  updateMapButton: {
    backgroundColor: "#FFF0D8",
    borderRadius: 12,
    padding: 13,
    alignItems: "center",
    marginTop: 12,
  },

  updateMapText: {
    color: COLORS.darkRed,
    fontSize: 13,
    fontWeight: "900",
  },

  saveButton: {
    backgroundColor: COLORS.red,
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 18,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },
});
