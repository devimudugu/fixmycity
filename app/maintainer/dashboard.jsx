import {
  View,
  Text, SectionList,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

export default function MaintainerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [groupedReports, setGroupedReports] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('reports').select('id, title, category');
      if (error) {
        setError(error.message);
      } else {
        const grouped = data.reduce((acc, item) => {
          const category = item.category || 'No Category';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});
          setGroupedReports(grouped);
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

  const renderSectionHeader = ({ section: { title } }) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );
  const sections = useMemo(() => {
    return Object.entries(groupedReports)
      .sort(([keyA], [keyB]) => {
          if (keyA === 'Other' || keyA === "No Category") {
              return 1;
          }
          if (keyB === 'Other' || keyB === "No Category") {
              return -1;
          }
        return keyA.localeCompare(keyB);
        }
       ).map(([title, data]) => ({ title, data }));
  }, [groupedReports]);
  
   const renderEmpty = useMemo(() => {
      if(!loading && Object.keys(groupedReports).length === 0){
          return (
          <View>
              <Text>No issues found</Text>
          </View>
          )
      }else{
          return null;
      }
   },[loading, groupedReports])
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintainers Dashboard</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
          <SectionList
              sections={sections}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              renderSectionHeader={renderSectionHeader}
              stickySectionHeadersEnabled
              ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
              ListEmptyComponent={renderEmpty}
              contentContainerStyle={styles.contentContainer}
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
  sectionHeader: {
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  contentContainer: {
      paddingBottom: 20,
  },
});