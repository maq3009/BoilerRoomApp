import { 
    Text,
    TouchableOpacity,
    View,
    LogBox,
    Image,
    FlatList,
    } from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { UpLoading } from './Uploading';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";
import { useState } from 'react';


export default function UploadComponent() {
    const [image, setImage] = useState('');
    const [video, setVideo] = useState('');
    
    
    
    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.3
        })

        if(!result.canceled) {
            setImage(result.uri)
            // upload the image
        }
    }




    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Uploading />
            <ProgressBar progress={60} />
            <TouchableOpacity
            // onPress={pickImage}
            style={{
                position: 'absolute',
                bottom: 90,
                right: 30,
                width: 44,
                height: 44,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
            }}
            >
                <Ionicons name='image' size={24} color='white' />
            </TouchableOpacity>
            <TouchableOpacity
            // onPress={pickVideo}
                style={{
                    position: "absolute",
                    bottom: 150,
                    right: 30,
                    width: 44,
                    height: 44,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                }}
            >
                <Ionicons name="videocam" size={24} color='white' />
            </TouchableOpacity>
        </View>
    );
}