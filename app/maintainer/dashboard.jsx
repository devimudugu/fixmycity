import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export default function MaintainerDashboard() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reports').select('id, title, category');
      if (error) {
        setError(error.message);
      } else {
        const sortedReports = data.sort((a, b) => {
          const categoryA = a.category ?? '';
          const categoryB = b.category ?? '';
          return categoryA.localeCompare(categoryB);
        });
        setReports(sortedReports);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  }, [fetchReports]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.issueCard}
      onPress={() => router.push(`/maintainer/report/${item.id}`)}
    >
      <Text style={styles.issueTitle}>{item.title}</Text>
      <Text style={styles.issueCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintainers Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text>No issues found</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  issueCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  issueCategory: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});