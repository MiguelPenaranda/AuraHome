import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import Constants from 'expo-constants';

export default function RegistroInicial() {
  const [nombre, setNombre] = useState('');
  const [nombreHogar, setNombreHogar] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarRegistro = async () => {
    if (!nombre || !nombreHogar) {
      Alert.alert("Error", "Por favor rellena ambos campos");
      return;
    }

    setCargando(true);
    try {
      // 1. Generar un ID único basado en la instalación de la App
      // Esto reemplaza la necesidad de pedir un correo real o usar la MAC
      const deviceId = Constants.installationId || Math.random().toString(36).substring(7);
      const emailUnico = `device_${deviceId}@aurahome.com`;
      const passwordFicticia = 'AuraHome2024*';

      // 2. Intentar registrar al usuario en Auth
      // IMPORTANTE: Asegúrate de haber desactivado "Confirm Email" en Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: emailUnico,
        password: passwordFicticia,
      });

      if (authError) {
        // Si el usuario ya existe (ej. reinstaló la app), intentamos loguear
        if (authError.message.includes("already registered")) {
          const { error: logInError } = await supabase.auth.signInWithPassword({
            email: emailUnico,
            password: passwordFicticia,
          });
          if (logInError) throw logInError;
        } else {
          throw authError;
        }
      }

      const user = authData?.user || (await supabase.auth.getUser()).data.user;

      // 3. Buscar el Hogar existente
      const { data: homeData, error: homeError } = await supabase
        .from('homes')
        .select('id, name')
        .ilike('name', nombreHogar.trim())
        .maybeSingle();

      if (homeError) throw homeError;

      if (!homeData) {
        throw new Error(`No encontramos el hogar "${nombreHogar}". Verifica que esté bien escrito.`);
      }

      // 4. Crear el Perfil vinculado
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{ // Usamos upsert por si el perfil ya existía
          id: user.id,
          full_name: nombre,
          home_id: homeData.id
        }]);

      if (profileError) throw profileError;

      Alert.alert("¡Éxito!", `Dispositivo vinculado a ${homeData.name}.`);
      
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error", error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Aura Home</Text>
        <Text style={styles.subtitulo}>Vincular este dispositivo</Text>
        
        <TextInput
          placeholder="Tu nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />

        <TextInput
          placeholder="Nombre del Hogar"
          value={nombreHogar}
          onChangeText={setNombreHogar}
          style={styles.input}
          autoCapitalize="none"
        />

        {cargando ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <Button 
            title="Comenzar" 
            onPress={manejarRegistro} 
            color="#4A90E2"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitulo: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EEE',
  },
});