
import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';

export type NewUser = {
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  enabled?: boolean;
  password?: string;
};

export default function UserForm({ onSubmit, busy }: { onSubmit: (u: NewUser)=>void; busy?: boolean; }) {
  const [u, setU] = useState<NewUser>({ username: '', email: '', firstName: '', lastName: '', enabled: true, password: '' });

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Register new user</Text>
      <TextInput placeholder="username" value={u.username} onChangeText={(t)=>setU({...u, username: t})} style={styles.input}/>
      <TextInput placeholder="email" value={u.email} onChangeText={(t)=>setU({...u, email: t})} style={styles.input}/>
      <TextInput placeholder="first name" value={u.firstName} onChangeText={(t)=>setU({...u, firstName: t})} style={styles.input}/>
      <TextInput placeholder="last name" value={u.lastName} onChangeText={(t)=>setU({...u, lastName: t})} style={styles.input}/>
      <TextInput placeholder="initial password" secureTextEntry value={u.password} onChangeText={(t)=>setU({...u, password: t})} style={styles.input}/>
      <TouchableOpacity disabled={busy} onPress={()=>onSubmit(u)} style={{ backgroundColor: '#2196F3', padding: 12, borderRadius: 8, opacity: busy?0.5:1 }}>
        <Text style={{ color: 'white', textAlign:'center', fontWeight: 'bold' }}>{busy? 'Creating...' : 'Create user'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10 }
};
