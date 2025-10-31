// /app/profile.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Text, View } from 'react-native';

export default function ProfileScreen() {
  const { name, email } = useLocalSearchParams();
  const router = useRouter();

const handleLogout = () => {
  router.replace('login'); // Regresa a login y elimina historial
};

  const styles = {
    container: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
        padding: 20,
        backgroundColor: 'white'
    },
    title: {
        fontSize: 22,
        marginTop: 20,
        fontWeight: 'bold' as const
    },
    subtitle: {
        fontSize: 18,
        color: 'gray',
        marginTop: 10
    }
};
  return (
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: 'white' }}>

      <Button title="Cerrar sesión" onPress={handleLogout} />
      <Text style={{ fontSize: 22, marginTop: 20 }}>Hola, {name} 👋</Text>
      <Text style={{ fontSize: 18, color: 'gray' }}>{email}</Text>
    </View>
  );
}
