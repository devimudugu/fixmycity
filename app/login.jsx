import { View, Text, TextInput, StyleSheet, TouchableOpacity,Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from './context/AuthContext';
import { supabase } from './lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();


  const handleLogin = async () => {
    try {
      await login(email, password);
  
      // Get the current user
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();
  
      if (userError || !user) {
        Alert.alert('Auth Error', 'Failed to fetch user.');
        return;
      }
  
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();
  
      if (!profile) {
        // Profile doesn't exist, create one
        const avatarUrl = `https://api.dicebear.com/7.x/shapes/png?seed=${encodeURIComponent(user.email)}`;
        const name = user.email.split('@')[0]; // fallback
  
        const { error: insertError } = await supabase.from('user_profiles').insert([
          {
            id: user.id,
            name,
            avatar_url: avatarUrl
          }
        ]);
  
        if (insertError) {
          Alert.alert('Profile Error', insertError.message);
          return;
        }
      }
  
      Alert.alert('Success', 'Logged in successfully');
      router.replace('/tabs');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', paddingHorizontal: 24, backgroundColor: '#fff'
  },
  title: {
    fontSize: 28, fontWeight: 'bold', marginBottom: 32, textAlign: 'center'
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 12, marginBottom: 16, fontSize: 16
  },
  button: {
    backgroundColor: '#007bff', padding: 14, borderRadius: 8
  },
  buttonText: {
    color: '#fff', fontSize: 16, textAlign: 'center'
  }
});
