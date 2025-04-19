import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function IssueDetail() {
  const { id } = useLocalSearchParams();

  // 🔧 Replace this with real data fetch later
  const issue = {
    title: 'Pothole near market',
    description: 'A large pothole that’s been there for 2 weeks. Causes major traffic jams during peak hours.',
    location: 'Sector 12, Main Road',
    status: 'Pending',
    createdAt: 'April 10, 2025',
    category: 'Road',
    submittedBy: 'Ravi khan',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{issue.title}</Text>

      <View style={styles.metaSection}>
        <Text style={styles.meta}>📍 {issue.location}</Text>
        <Text style={styles.meta}>🗓️ {issue.createdAt}</Text>
        <Text style={styles.meta}>👤 Submitted by: {issue.submittedBy}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Category:</Text>
        <Text style={styles.value}>{issue.category}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{issue.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.status, issue.status === 'Pending' && styles.pending]}>
          {issue.status}
        </Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  metaSection: {
    marginBottom: 20,
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#d1e7dd',
    color: '#0f5132',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#664d03',
  },
});
