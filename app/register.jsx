import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import CustomButton from '../components/CustomButton';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const {signup} = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !name) {
      Alert.alert('Missing fields', 'Please fill all the fields.');
      return;
    }
    try {
      await signup(email, password);
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }
    // Don't insert profile yet
    Alert.alert(
      'Confirm Your Email',
      'We’ve sent a confirmation link to your email. Please verify your account before logging in.'
    );
  
    router.replace('/'); // redirect to login
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <CustomButton label="Register" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});
