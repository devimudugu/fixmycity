import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
  } from 'react-native';
  import { useRouter } from 'expo-router';
  import { useEffect, useState, useCallback } from 'react';
  import { supabase } from './lib/supabase';
  
  export default function ClosedIssuesScreen() {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
  
    const fetchReports = useCallback(async () => {
      if (!userId) {
        setLoading(true);
        try {
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();
          if (userError) throw userError;
          setUserId(user.id);
          const { data, error } = await supabase.from('reports').select('id, title').eq('status', 'Closed').eq('user_id', user.id);
  
          if (error) {
            setError(error.message);
          } else {
            setReports(data);
          }
        } catch (err) { setError(err.message); } finally {
          setLoading(false);
        }
      } else {
        setRefreshing(true)
        try {
          const { data, error } = await supabase.from('reports').select('id, title').eq('status', 'Closed').eq('user_id', userId);
          if (error) setError(error.message);
          else setReports(data);
        } catch (err) { setError(err.message); } finally { setRefreshing(false) }
      }
    }, [userId]);
  
    useEffect(() => {
      fetchReports();
    }, [fetchReports]);
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Closed Issues</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : reports.length === 0 ? (
          <Text style={styles.emptyText}>There are no closed issues</Text>
        ) : (
          <View style={{flex: 1}}>
            <FlatList
              data={reports}
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
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchReports} />}
              contentContainerStyle={styles.listContent}
            />
          </View>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 50 },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
    issueCard: {
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ddd',
    },
    issueTitle: { fontSize: 16, fontWeight: '600' },
    emptyText: { fontSize: 16, textAlign: 'center', marginTop: 20 },
    link: { color: '#007bff', marginTop: 6 },
    error: { color: 'red', marginTop: 10 },
    listContent: {
      paddingBottom: 20,
    },
  });