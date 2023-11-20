import { NavigationContainer } from '@react-navigation/native';
import List from './app/screens/List';
import Details from './app/screens/Details';
import Inventory from './app/screens/Inventory';
import Chemicals from './app/screens/Chemicals';
import Login from './app/screens/Login_SignUp';
import { StyleSheet } from 'react-native';
import { View, Text} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { color } from 'react-native-elements/dist/helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useState, useEffect } from 'react';
import {FIREBASE_AUTH} from './firebaseConfig';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator()

type MainStackProps = {
  isLoggedIn: boolean;
}



const MainStack: React.FC<MainStackProps> = ({ isLoggedIn }) => {
  return (
      <Stack.Navigator initialRouteName= 'Login'>
        <Stack.Screen name="Login/SignUp" 
        component={Login}
        options={{
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#787878',
          },
        }}
      />
      </Stack.Navigator>
  )}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user: User | null) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);



  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen 
          name='Home'
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontWeight: '900',
            },
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" color={color} size={size} />
            ),
        }}
        >
          {() => <MainStack isLoggedIn={isLoggedIn} />}
           </Tab.Screen>

        {isLoggedIn && (
          <>


        <Tab.Screen name="Add New Part" component={List} 
          options={{
            headerTitleAlign: "center",
            headerTitleStyle: styles.BlackText,
            tabBarIcon: ({ color, size }) => (
              <Icon name="add" color={color} size={size} />
            )
        }}
        />
        <Tab.Screen name="Chemicals" component={Chemicals} 
          options={{
            headerTitleAlign: "center",
            headerTitleStyle: styles.BlackText,
            tabBarIcon: ({ color, size }) => (
              <Icon name="science" color={color} size={size} />
            )
          }}
        />
        <Tab.Screen name="Inventory" component={Inventory} 
          options={{
            headerTitleAlign: "center",
            headerTitleStyle: styles.BlackText,
            tabBarIcon: ({ color, size }) => (
              <Icon name="inventory" color={'green'} size={size} />
            )
          }}
        />
        </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  )
}
  const styles = StyleSheet.create({
    headerTitleContainer: {
      paddingBottom: 10, // Add a bottom padding of 18px
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold' // Add a bottom padding of 18px
    },
    BlackText: {
      fontSize: 30,
      marginBottom: 15,
    },
    PageTitle: {
      fontSize: 28,
      justifyContent: "center",
    },
  })



//React Native Todo App with Firebase and <Expo>
//18:22 Simon Grimm
//PR
//6:01 / 22:28
//Super Easy React Native AUTHENTICATION with Firebase 