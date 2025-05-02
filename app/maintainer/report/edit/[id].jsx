import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../../lib/supabase';
import { Picker } from '@react-native-picker/picker';

export default function EditReportStatus() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const id = params.id;
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Pending');

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
          throw error;
        }

        setReport(data);
        setSelectedStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleStatusChange = (itemValue) => {
    setSelectedStatus(itemValue);
  };

  const handleUpdateStatus = async () => {
    console.log('Updating report with ID:', id);
    console.log('New status:', selectedStatus);

    try {
      const { data, error } = await supabase
        .from('reports')
        .update({ status: selectedStatus })
        .eq('id', id)
        .select()

      console.log("Supabase Response :", {data, error});

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Report status updated successfully!');
      router.push(`/maintainer/report/${id}`);
    } catch (err) {
      setError(err.message);
      Alert.alert('Error', 'Failed to update report status.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Report not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Report Status</Text>
      <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedStatus}
        onValueChange={handleStatusChange}
        style={styles.picker}
      >
        <Picker.Item label="Pending" value="Pending" />
        <Picker.Item label="In Progress" value="In Progress" />
        <Picker.Item label="Resolved" value="Resolved" />
        <Picker.Item label="Closed" value="Closed" />
      </Picker>
      </View>
      <Button title="Confirm Changes" onPress={handleUpdateStatus} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
  },
    pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#333',
  },
});