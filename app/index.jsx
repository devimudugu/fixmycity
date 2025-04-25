import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to</Text>
      <Text style={styles.brand}>FixMyCity</Text>

      <View style={styles.buttonContainer}>
        <CustomButton 
          label="Login" 
          onPress={() => router.push('/login')} 
          style={styles.button}
        />
        <Text style={styles.orText}>Don't have an account?</Text>
        <CustomButton 
          label="Create Account" 
          onPress={() => router.push('/register')} 
          style={styles.button}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  brand: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    width: '80%',
  },
  orText: {
    fontSize: 14,
    color: '#555',
  },
});
