import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function MaintainerReportDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          setError(error.message);
        } else {
          setReport(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Report Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : report ? (
        <View style={styles.card}>
          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.label}>Description</Text>
          <Text style={styles.text}>{report.description}</Text>
          <Text style={styles.label}>Category</Text>
          <Text style={styles.text}>{report.category}</Text>
          {report.image_url && (
            <Image source={{ uri: report.image_url }} style={styles.image} />
          )}

          <Text style={styles.label}>Location</Text>
          <Text style={styles.text}>
            Latitude: {report.latitude?.toFixed(4)}{'\n'}
            Longitude: {report.longitude?.toFixed(4)}
          </Text>

          <Text style={styles.label}>Status</Text>
          <Text style={[styles.status, getStatusStyle(report.status)]}>
            {report.status}
          </Text>
          <Text style={styles.label}>Reported At</Text>
          <Text style={styles.text}>{new Date(report.reported_at).toLocaleString()}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              console.log('Editing report ID:', report.id);
              router.push(`/maintainer/report/edit/${report.id}`);
            }}>
            <Text style={styles.editButtonText}>Edit Progress</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.error}>Report not found.</Text>
      )}
    </ScrollView>
  );
}

function getStatusStyle(status) {
  if (status === 'Resolved') return styles.statusResolved
  if (status === 'In Progress') return styles.statusInProgress
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
  error: {
    color: 'red',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});