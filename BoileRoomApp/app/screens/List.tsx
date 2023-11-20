import React from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { FIRESTORE_DB, storage } from '../../firebaseConfig';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import UploadComponent from './UploadComponent';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import LogoutButton from '../screens/LogoutButton';



const imgDir = `${FileSystem.documentDirectory}assets/`;


const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true});
  }
};




const List = ({ navigation }: any) => {
  const [PartName, setPartName] = useState('');
  const [PartNumber, setPartNumber] = useState('');
  const [Location, setLocation] = useState('');
  const [Manufacturer, setManufacturer] = useState('');
  const [Quantity, setQuantity] = useState('');
  const [Image, setImage] = useState('');

    const selectImage = async (useLibrary: boolean) => {
      let result;

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
      }

      if(useLibrary) {
        result = await ImagePicker.launchImageLibraryAsync(options);
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync({
        });
      }

      if (!result.canceled) {
        const filename = result.assets[0].uri.split('/').pop(); // Define filename here
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();

        const storageRef = ref(storage, `images/${filename}`);
        const uploadTask = uploadBytes(storageRef, blob);

        uploadTask.then(async () => {
          const downloadURL = await getDownloadURL(storageRef);
          setImage(downloadURL);
        });
      }
    };





  const addPart = async () => {
    const filename = Image.split('/').pop();

    const doc = await addDoc(collection(FIRESTORE_DB, 'Inventory'), {
      PartName,
      PartNumber,
      Location, 
      Manufacturer,
      Quantity,
      Image: Image
    });

    // Clear input fields after adding the part
    setPartName('');
    setPartNumber('');
    setLocation('');
    setManufacturer('');
    setQuantity('');
    setImage('');
  };

  return (
    <View style={styles.container}>
      <LogoutButton />
      <View>
        <Text style={styles.TopText}>ADD PART</Text>
        <TextInput
          style={styles.input}
          placeholder="Part Name"
          onChangeText={(text: string) => setPartName(text)}
          value={PartName}
        />
        <TextInput
          style={styles.input}
          placeholder="Part Number"
          onChangeText={(text: string) => setPartNumber(text)}
          value={PartNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Location"
          onChangeText={(text: string) => setLocation(text)}
          value={Location}
        />
        <TextInput
          style={styles.input}
          placeholder="Manufacturer"
          onChangeText={(text: string) => setManufacturer(text)}
          value={Manufacturer}
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          onChangeText={(text: string) => setQuantity(text)}
          value={Quantity}
        />
        <Button title='Photo Library' onPress={() => selectImage(true)}/>
        <Button title='Capture Image' onPress={() => selectImage(false)}/>
        {/* <UploadComponent setImage={setImage} /> */}
      </View>        
      <View style={styles.addPartButton}>
          <Button onPress={addPart} title="Add Part" />
      </View>
      {/* <Button
        title="Go to Inventory"
        onPress={() => {
          // Pass the input values to the Inventory screen using params
          navigation.navigate('Inventory', {
            PartName,
            PartNumber,
            Location,
            Manufacturer,
            Quantity,
          });
        }}
      /> */}
    </View>
  );
};

export default List;

const styles = StyleSheet.create({
  container: {},
  TopText: {
    flex: 1,
    justifyContent: 'center',
    fontSize: 20,
  },
  input: {
    fontSize: 26,
    padding: 20,
    borderBottomWidth: 1,
  },
  addPartButton: {
    display: 'flex',
    marginTop: 50,
    padding: 20
  }
});