import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const KEYCLOAK_URL = 'http://localhost:8080';   // Keycloak server
const REALM = 'ventas-realm';                   // Your realm

// Admin credentials for master realm
const ADMIN = {
  username: 'admin',
  password: 'admin123',
  client_id: 'admin-cli'
};

export default function RegisterUser() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    departamento: '',
    rol_interno: ''
  });

  const handleChange = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleRegister = async () => {
    try {
      // 1️Get admin token
      const tokenResponse = await axios.post(
        `${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token`,
        new URLSearchParams({
          grant_type: 'password',
          client_id: ADMIN.client_id,
          username: ADMIN.username,
          password: ADMIN.password
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      const token = tokenResponse.data.access_token;
      console.log('Admin token OK');

      // 2️ Build user JSON
      const user = {
        username: form.username,
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        enabled: true,
        emailVerified: true,
        credentials: [
          {
            type: 'password',
            value: form.password,
            temporary: false
          }
        ],
        attributes: {
          departamento: form.departamento || 'N/A',
          rol_interno: form.rol_interno || 'N/A'
        }
      };

      // 3️ Create user request
      const res = await axios.post(
        `${KEYCLOAK_URL}/admin/realms/${REALM}/users`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 201) {
        Alert.alert('Usuario creado', `Usuario ${form.username} registrado correctamente.`);
      } else {
        Alert.alert('Respuesta inesperada', `Código HTTP: ${res.status}`);
      }

    } catch (error) {
     
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 ,color: 'white' }}>Registrar usuario</Text>

      <TextInput placeholder="Username" value={form.username} onChangeText={(v)=>handleChange('username', v)} style={styles.input}/>
      <TextInput placeholder="Email" value={form.email} onChangeText={(v)=>handleChange('email', v)} style={styles.input}/>
      <TextInput placeholder="Nombre" value={form.firstName} onChangeText={(v)=>handleChange('firstName', v)} style={styles.input}/>
      <TextInput placeholder="Apellido" value={form.lastName} onChangeText={(v)=>handleChange('lastName', v)} style={styles.input}/>
      <TextInput placeholder="Contraseña" secureTextEntry value={form.password} onChangeText={(v)=>handleChange('password', v)} style={styles.input}/>
      <TextInput placeholder="Departamento" value={form.departamento} onChangeText={(v)=>handleChange('departamento', v)} style={styles.input}/>
      <TextInput placeholder="Rol interno" value={form.rol_interno} onChangeText={(v)=>handleChange('rol_interno', v)} style={styles.input}/>

      <TouchableOpacity onPress={handleRegister} style={styles.btn}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>Crear usuario</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  backgroundColor: '#a2c9e5ff',
    Color:'white'
  },
  btn: {
    backgroundColor: '#0077cc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10
  }
};
