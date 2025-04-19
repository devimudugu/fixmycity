import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../components/CustomButton';

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [mode, setMode] = useState('live');
  const [manualLocation, setManualLocation] = useState('none');

  const predefinedLocations = {
    none: null,
    Bangalore: { latitude: 12.9716, longitude: 77.5946 },
    Mumbai: { latitude: 19.076, longitude: 72.8777 },
    Delhi: { latitude: 28.6139, longitude: 77.209 },
    Chennai: { latitude: 13.0827, longitude: 80.2707 },
  };

  const fetchLiveLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required.');
      return;
    }

    let loc = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (mode === 'live') fetchLiveLocation();
    }, [mode])
  );

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission Required', 'Access to photos is needed.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const finalLocation = mode === 'live' ? location : predefinedLocations[manualLocation];

    if (!title || !description || !finalLocation) {
      Alert.alert('Missing Info', 'Please fill all fields and select a location.');
      return;
    }

    Alert.alert('Success', 'Issue reported successfully!');
    setTitle('');
    setDescription('');
    setImageUri(null);
    setManualLocation('none');
    setMode('live');
  };

  const renderLocationText = () => {
    const loc =
      mode === 'live'
        ? location
        : predefinedLocations[manualLocation] || { latitude: null, longitude: null };

    if (!loc || !loc.latitude || !loc.longitude) {
      return <Text style={styles.locationText}>Location not available.</Text>;
    }

    return (
      <Text style={styles.locationText}>
        <Text style={styles.bold}>Latitude:</Text> {loc.latitude.toFixed(4)} {'\n'}
        <Text style={styles.bold}>Longitude:</Text> {loc.longitude.toFixed(4)}
      </Text>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Report an Issue</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Pothole near school"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Give more details..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Location</Text>
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'live' ? styles.modeActive : styles.modeInactive]}
          onPress={() => setMode('live')}
        >
          <Text style={styles.modeText}>Live</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeButton, mode === 'manual' ? styles.modeActive : styles.modeInactive]}
          onPress={() => setMode('manual')}
        >
          <Text style={styles.modeText}>Manual</Text>
        </TouchableOpacity>
      </View>

      {mode === 'manual' && (
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={manualLocation}
            onValueChange={(value) => setManualLocation(value)}
          >
            {Object.keys(predefinedLocations).map((key) => (
              <Picker.Item key={key} label={key} value={key} />
            ))}
          </Picker>
        </View>
      )}

      {renderLocationText()}

      {mode === 'live' && (
        <CustomButton label="Refresh Live Location" onPress={fetchLiveLocation} />
      )}

      <Text style={styles.label}>Image</Text>
      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imageText}>Tap to select image</Text>
        )}
      </TouchableOpacity>

      <CustomButton label="Submit Report" onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  modeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modeButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 8,
  },
  modeActive: {
    backgroundColor: '#007aff',
  },
  modeInactive: {
    backgroundColor: '#eee',
  },
  modeText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
  },
  locationText: {
    marginVertical: 10,
    fontSize: 14,
    color: '#222',
    paddingLeft: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#000',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
    marginBottom: 10,
  },
  imageBox: {
    height: 150,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imageText: {
    color: '#888',
  },
});
