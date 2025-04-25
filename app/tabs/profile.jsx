import { View, Text, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('name, avatar_url, reports_submitted, joined')
        .eq('id', user.id)
        .single();

      if (error) {
        throw error;
      }

      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err.message);
      Alert.alert('Error', 'Could not load profile info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  if (loading || !profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: profile.avatar_url }}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Reports Submitted</Text>
        <Text style={styles.value}>{profile.reports_submitted}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.value}>
          {new Date(profile.joined).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.buttonWrapper}>
        <CustomButton label="Log Out" onPress={handleLogout} type="secondary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  buttonWrapper: {
    marginTop: 30,
  },
});
