import { View, Text } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { TextInput, StyleSheet, Image, Button } from 'react-native'
import { color } from 'react-native-elements/dist/helpers';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Auth, UserCredential } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';

type StackParamList = {
  Login: undefined;
  List: undefined ;
};

type LoginScreenNavigationProp = StackNavigationProp<StackParamList, 'Login'>;


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation<LoginScreenNavigationProp>();
  
  const signIn = async () => {
    setLoading(true);
    try {
      const response: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Add New Part');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your emails!');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Image style={styles.boilerImage} source={require('../../assets/Boiler.png')} />
        <View style={styles.centeredContent}>
          <TextInput
            value={email} 
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            onChangeText={(text) => setEmail(text)}
          ></TextInput>
          <TextInput
            secureTextEntry={true}
            value={password} 
            style={styles.input}
            placeholder= "Password"
            autoCapitalize="none"
            onChangeText={(text) => setPassword(text)}
          ></TextInput>

          { loading ? <ActivityIndicator size= "large" color= "#0000ff" />
          : <>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Button title="Login" onPress={signIn} />
              </View>
              <View style={styles.button}>
                <Button title= "SignUp" onPress={signUp} />
              </View>
            </View>
        </>}

      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    color: 'black',
    backgroundColor: 'lightgray'
  },
  boilerImage: {
    alignSelf: "center",
    marginTop: 20,
    height: 120,
    width: 300,
  },
  centeredContent: {
    flex: 0.7,
    paddingHorizontal: 30,
    justifyContent: 'center',

  },
  buttonContainer: {
    flexDirection: 'row', // Horizontal layout
    justifyContent: 'space-around', // Space buttons evenly
    marginTop: 30,
  },
  button: {
    width: '49%', // Adjust the width as needed to fit both buttons
  },
})