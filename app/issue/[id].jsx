import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { supabase } from '../lib/supabase';

export default function IssueDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    const fetchIssue = async () => {
      setLoading(true);
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if(userError) throw userError;
        setUserId(user.id);

        const { data, error } = await supabase
          .from('reports')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError("Issue not found");
          } else {
            setError(error.message);
          }
        } else {
          setIssue(data);
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id, userId]);

  const handleCloseIssue = useCallback(async () => {
    if (!issue) return;
    if (issue.status !== 'Resolved') {
      Alert.alert(
        'Confirm Close',
        'This issue is not marked as resolved. Are you sure you want to close it?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Close', onPress: async () => { await updateIssueStatus('Closed') } },
        ]
      );
    } else {
      await updateIssueStatus('Closed');
    }
  }, [issue]);

  const updateIssueStatus = async (newStatus) => {
    try {
      const { error: updateError } = await supabase.from('reports').update({ status: newStatus }).eq('id', id);
      if (updateError) throw updateError;
      Alert.alert('Success', 'Issue closed successfully!');
      router.push('/tabs/home');
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Issue Details</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error === "Issue not found" ? (
        <Text style={styles.error}>Issue not found</Text>
      ) : error === "You are not authorized to view this issue." ? (
        <Text style={styles.error}>You are not authorized to view this issue.</Text>
      ) : issue ? (
        <>
          <View style={styles.card}>
            <Text style={styles.title}>{issue.title}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{issue.description}</Text>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.text}>{issue.category}</Text>
            {issue.image_url && (
              <Image source={{ uri: issue.image_url }} style={styles.image} />
            )}

            <Text style={styles.label}>Location</Text>
            <Text style={styles.text}>
              Latitude: {issue.latitude?.toFixed(4)}{'\n'}
              Longitude: {issue.longitude?.toFixed(4)}
            </Text>

            <Text style={styles.label}>Status</Text>
            <Text style={[styles.status, getStatusStyle(issue.status)]}>
              {issue.status}
            </Text>
            <Text style={styles.label}>Reported At</Text>
            <Text style={styles.text}>{new Date(issue.reported_at).toLocaleString()}</Text>
          </View>
          {issue.status !== 'Closed' && (
            <CustomButton label="Close Issue" onPress={handleCloseIssue} />
          )}
        </>
      ) : (
        <Text style={styles.error}>{error}</Text>
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
    marginBottom:50
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
});
