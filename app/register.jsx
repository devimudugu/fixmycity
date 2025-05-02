import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import CustomButton from '../components/CustomButton';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword || !name) {
      Alert.alert('Missing fields', 'Please fill all the fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'The passwords do not match. Please try again.');
      return;
    }

    try {
      await signup(email, password);
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    }

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
        secureTextEntry={!showPassword}
      />

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry={!showPassword}
      />

      <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
        <Text style={styles.toggleText}>{showPassword ? 'Hide Passwords' : 'Show Passwords'}</Text>
      </TouchableOpacity>

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
  toggleText: {
    color: '#007BFF',
    textAlign: 'right',
    marginBottom: 16,
  },
});
