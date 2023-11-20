import React from 'react';
import { Button } from 'react-native';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import Login from './Login_SignUp';


const LogoutButton: React.FC = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await signOut(FIREBASE_AUTH);
            navigation.navigate('Login');
        } catch (error){
            console.error('Error logging out:', error);
        }
    };

    return <Button title="Logout" onPress={handleLogout} />;
};

export default LogoutButton;