import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useUserContext } from "./src/hooks/useUserContext";
import RegistroInicial from "./src/components/RegistroInicial";
import PantallaInventario from "./src/screens/PantallaInventario";

export default function App() {
  const { session, profile, loading } = useUserContext();

  // Solo mostrar carga si realmente el proceso de verificación está activo
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  // Si no hay sesión, vamos al registro directamente
  if (!session) {
    return <RegistroInicial />;
  }

  // Si hay sesión pero el perfil no existe en la tabla, 
  // también mandamos al registro (para que lo cree)
  if (!profile) {
    return <RegistroInicial />;
  }

  // Si ya tenemos ambos, entramos a la App
  return <PantallaInventario profile={profile} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
});