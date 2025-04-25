import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function IssueDetails({ route }) {
  const issue = route?.params?.issue || {
    title: 'Pothole near school',
    description: 'There is a large pothole near the government school causing traffic and risk to kids.',
    location: { latitude: 12.9716, longitude: 77.5946 },
    status: 'Pending',
    imageUri: null,
    reportedAt: '2025-04-19T10:32:00Z',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Issue Details</Text>

      <View style={styles.card}>
        <Text style={styles.title}>{issue.title}</Text>
        <Text style={styles.label}>Description</Text>
        <Text style={styles.text}>{issue.description}</Text>

        {issue.imageUri && (
          <Image source={{ uri: issue.imageUri }} style={styles.image} />
        )}

        <Text style={styles.label}>Location</Text>
        <Text style={styles.text}>
          Latitude: {issue.location?.latitude?.toFixed(4)}{'\n'}
          Longitude: {issue.location?.longitude?.toFixed(4)}
        </Text>

        <Text style={styles.label}>Status</Text>
        <Text style={[styles.status, getStatusStyle(issue.status)]}>
          {issue.status}
        </Text>

        <Text style={styles.label}>Reported At</Text>
        <Text style={styles.text}>{new Date(issue.reportedAt).toLocaleString()}</Text>
      </View>
    </ScrollView>
  );
}

function getStatusStyle(status) {
  if (status === 'Resolved') return styles.statusResolved;
  if (status === 'In Progress') return styles.statusInProgress;
  return styles.statusPending;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fefefe',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  image: {
    marginVertical: 12,
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
    width: '100%',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusResolved: {
    backgroundColor: '#c4f0c4',
    color: '#137333',
  },
  statusInProgress: {
    backgroundColor: '#fff4c2',
    color: '#b28900',
  },
  statusPending: {
    backgroundColor: '#fdecea',
    color: '#d93025',
  },
});
