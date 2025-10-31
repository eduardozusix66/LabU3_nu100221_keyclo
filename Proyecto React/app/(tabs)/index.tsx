import axios from 'axios';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const KEYCLOAK_URL = 'http://localhost:8080';
const MASTER_REALM = 'master';
const TARGET_REALM = 'ventas-realm';

// Credenciales del admin
const ADMIN = {
  username: 'admin',
  password: 'admin123',
  client_id: 'admin-cli'
};

export default function HomeScreen() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Ingrese un nombre de usuario.');
      return;
    }

    try {
      setLoading(true);
      // Obtener token de admin (realm master)
      const tokenRes = await axios.post(
        `${KEYCLOAK_URL}/realms/${MASTER_REALM}/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: ADMIN.client_id,
          username: ADMIN.username,
          password: ADMIN.password
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const token = tokenRes.data.access_token;
      console.log('✅ Token OK');

      // 2️ Buscar usuario en ventas-realm
      const userRes = await axios.get(
        `${KEYCLOAK_URL}/admin/realms/${TARGET_REALM}/users?username=${username}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (userRes.data.length === 0) {
        Alert.alert('Sin resultados', `No se encontró el usuario "${username}".`);
        return;
      }

      const user = userRes.data[0];
      // 3️ Mostrar datos en popup
      Alert.alert(
        'Usuario encontrado',
        `👤 Username: ${user.username}\n📧 Email: ${user.email}\n🧍 Nombre: ${user.firstName || '-'} ${user.lastName || '-'}\n✅ Enabled: ${user.enabled}\n🗂️ ID: ${user.id}`
      );
    } catch (error) {
      console.error(error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Buscar usuario Keycloak</Text>
      <TextInput
        placeholder="Ingrese username (ej. student2)"
        placeholderTextColor="#ccc"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />
      <TouchableOpacity onPress={handleSearch} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Buscando...' : 'Buscar usuario'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 10,
    color: 'white',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});