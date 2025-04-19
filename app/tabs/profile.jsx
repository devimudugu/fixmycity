import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from '../../components/CustomButton';

export default function ProfileScreen() {
  const user = {
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    reportsSubmitted: 7,
    joined: 'January 2024',
    avatar: 'https://api.dicebear.com/7.x/shapes/png?seed=user123',
  };

  const handleLogout = () => {
    console.log('Logging out...');
    // Future: Add real logout logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Reports Submitted</Text>
        <Text style={styles.value}>{user.reportsSubmitted}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Member Since</Text>
        <Text style={styles.value}>{user.joined}</Text>
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
