import { initializeApp, FirebaseApp } from 'firebase/app';
import { initializeAuth, User} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import * as firebaseAuth from 'firebase/auth';


//My Database Configuration

const firebaseConfig = {
    apiKey: "AIzaSyAsLwWnhC5v4kSiDzDBA98DbFNaGeRza-Y",
    authDomain: "boilerroomapp-16a62.firebaseapp.com",  
    projectId: "boilerroomapp-16a62",
    storageBucket: "boilerroomapp-16a62.appspot.com",
    messagingSenderId: "345483114239",
    appId: "1:345483114239:web:08ee929ed08c740728beca"
  };
  



// initialize Firebase
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);


const auth = initializeAuth(firebaseApp, {
    persistence: reactNativePersistence(ReactNativeAsyncStorage)
  });


// Export necessary modules
export const FIREBASE_APP = firebaseApp;
export const FIRESTORE_DB = firestore;
export const FIREBASE_AUTH = auth;
export const storage = getStorage(firebaseApp);
