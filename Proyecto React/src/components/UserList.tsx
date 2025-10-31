
import React from 'react';
import { View, Text, FlatList } from 'react-native';

export default function UserList({ users }: { users: any[] }) {
  return (
    <View>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Users</Text>
      <FlatList
        data={users}
        keyExtractor={(item)=>item.id || item.username}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.username}</Text>
            <Text>{item.firstName} {item.lastName}</Text>
            <Text>{item.email}</Text>
            <Text>Enabled: {String(item.enabled)}</Text>
          </View>
        )}
      />
    </View>
  );
}
