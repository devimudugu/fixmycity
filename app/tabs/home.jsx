import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const issues = [
  { id: '1', title: 'Pothole near market' },
  { id: '2', title: 'Leaking water pipeline' },
  { id: '3', title: 'Streetlight not working' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <Text style={styles.subtitle}>Recent Issues</Text>
      <FlatList
        data={issues}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.issueCard}
            onPress={() => router.push(`/issue/${item.id}`)}
          >
            <Text style={styles.issueTitle}>{item.title}</Text>
            <Text style={styles.link}>View Details →</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  issueCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  issueTitle: { fontSize: 16, fontWeight: '600' },
  link: { color: '#007bff', marginTop: 6 }
});
