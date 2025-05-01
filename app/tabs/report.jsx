import {
  ActivityIndicator,
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
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import CustomButton from '../../components/CustomButton';
import { supabase } from '../lib/supabase';
import * as FileSystem from 'expo-file-system';

export default function ReportPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Pothole');

  const categories = [
    'Pothole',
    'Traffic Light',
    'Street Light',
    'Road Sign',
    'Garbage',
    'Other',
  ];

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

  const handleCameraPick = async () => {
    try {
      const { granted } = await ImagePicker.requestCameraPermissionsAsync();
      if (!granted) return Alert.alert('Permission Denied', 'Camera access is required.');
  
      const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled) setImageUri(result.assets[0].uri);
    } catch (err) {
      console.error('Camera error:', err);
      Alert.alert('Error', 'Something went wrong while opening the camera.');
    }
  };
  
  const handleGalleryPick = async () => {
    try {
      const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!granted) return Alert.alert('Permission Denied', 'Gallery access is required.');
  
      const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setImageUri(uri);
        console.log(uri);
      }
    } catch (err) {
      console.error('Gallery error:', err);
      Alert.alert('Error', 'Something went wrong while accessing the gallery.');
    }
  };
  
  const pickImage = () => {
    Alert.alert(
      'Choose Image Source',
      'Select where you want to pick the image from:',
      [
        { text: 'Camera', onPress: () => handleCameraPick() },
        { text: 'Gallery', onPress: () => handleGalleryPick() },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };
  
  

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const finalLocation = mode === 'live' ? location : predefinedLocations[manualLocation];
  
      if (!title || !description || !finalLocation) {
        Alert.alert('Missing Info', 'Please fill all fields and select a location.');
        return;
      }
  
      const { data: { user }, error: getUserError } = await supabase.auth.getUser();
      if (getUserError) throw getUserError;
  
      let imagePath = null;
  
      if (imageUri) {
        const fileExtension = imageUri.split('.').pop();
        const filename = `report_${Date.now()}.${fileExtension || 'jpg'}`;
        const fileData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('report-images') // your bucket name
          .upload(filename, Buffer.from(fileData, 'base64'), {
            contentType: 'image/jpeg',
            upsert: true,
          });
  
        if (uploadError) throw uploadError;
  
        const { data: publicUrlData } = supabase
          .storage
          .from('report-images')
          .getPublicUrl(filename);

        imagePath = publicUrlData.publicUrl;

      }
  
      const { error: insertError } = await supabase.from('reports').insert({
        title,
        description,
        user_id: user.id,
        latitude: finalLocation.latitude,
        longitude: finalLocation.longitude,
        category: selectedCategory,
        image_url: imagePath,
      });
  
      if (insertError) throw insertError;
  
      Alert.alert('Success', 'Issue reported successfully!');
      setTitle('');
      setDescription('');
      setImageUri(null);
      setManualLocation('none');
      setMode('live');
      router.push('/tabs/home');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const renderLocationText = useCallback(() => {
    const loc =
      mode === 'live'
        ? location
        : predefinedLocations[manualLocation] || { latitude: null, longitude: null };

    if (!loc || !loc.latitude || !loc.longitude) {
      return (
        <Text style={styles.locationText}>
        <Text>Location not available.</Text>
        </Text>
      );
    }

    return (
      <Text style={styles.locationText}>
        <Text style={styles.bold}>Latitude:</Text> {loc.latitude.toFixed(4)} {'\n'}
        <Text style={styles.bold}>Longitude:</Text> {loc.longitude.toFixed(4)}
      </Text>
    );
  }, [mode, location, manualLocation]);

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

<Text style={styles.label}>Category</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value)}
        >
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>


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
      {loading && (
        <ActivityIndicator size="large" color="#007bff" />
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      

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
    textAlignVertical: 'top'
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
   error: {
    color: 'red',
    marginTop: 10,
  },
});
