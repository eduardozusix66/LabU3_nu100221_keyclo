// /app/login.tsx
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { passwordGrant } from '@/src/services/keycloakAuth';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await passwordGrant(username, password);
      // Store tokens in memory for lab only
      // In production use secure storage
    global.access_token = res.access_token;
global.refresh_token = res.refresh_token
      setError('');
      router.push('/(tabs)'); // Go to tabs
    }  catch (e) {
  console.error(e);
  setError(e.response?.data || e.message || 'Login failed');
}
  };

  return (
    <View style={{ padding: 20, flex: 1, justifyContent: 'center', gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>Login</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
      />

      <TouchableOpacity
        style={{ backgroundColor: '#2196F3', padding: 12, borderRadius: 8 }}
        onPress={handleLogin}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          ENTRAR
        </Text>
      </TouchableOpacity>

      {error ? <Text style={{ color: 'red', marginTop: 20 }}>{error}</Text> : null}
    </View>
  );
}
