import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      setUserId(user.id);

      const { data, error } = await supabase
        .from('reports')
        .select('id, title')
        .neq('status', 'Closed')
        .eq('user_id', user.id);

      if (error) {
        setError(error.message);
      } else {
        setReports(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [userId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReports();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back!</Text>

      <Text style={styles.subtitle}>Recent Issues</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.issueCard} onPress={() => router.push(`/issue/${item.id}`)}>
              <Text style={styles.issueTitle}>{item.title}</Text>
              <Text style={styles.link}>View Details →</Text>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text>No issues found</Text>} // Show a message if no issues are available
        />
      )}
      <Link href="/closed" style={styles.link}>
        View Closed Issues
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
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
  link: { color: '#007bff', marginTop: 6 },
  error: { color: 'red', marginTop: 10 },
});
