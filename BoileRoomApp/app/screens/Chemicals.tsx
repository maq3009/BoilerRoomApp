import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import {
  getDoc,
  getDocs,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { Card, Button } from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import LogoutButton from './LogoutButton';



interface ChemicalItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
}

const Chemicals: React.FC = () => {
  const [chemicalsData, setChemicalsData] = useState<ChemicalItem[]>([]);

  const addItemsToFirestore = async (items: ChemicalItem[]) => {
    const batch: Promise<void>[] = [];
    for (const item of items) {
      const chemicalRef = doc(FIRESTORE_DB, 'Chemicals', item.id);
      const docSnapshot = await getDoc(chemicalRef);

      if (docSnapshot.exists()) {
        batch.push(updateDoc(chemicalRef, { quantity: item.quantity }));
      } else {
        // Document doesn't exist, create it
        batch.push(setDoc(chemicalRef, { ...item }));
      }
      }
    await Promise.all(batch);
  };


  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Chemicals'));
      const data: ChemicalItem[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        const docData = doc.data() as ChemicalItem;
        data.push({ id: doc.id, ...doc.data() });
      });
      const hardcodedItems: ChemicalItem[] = [
        {
          id: '1',
          name: 'Alkalinity Titrant',
          quantity: 5,
          image: require('../../assets/AlkalinityTitrant.jpeg'),
        },
        {
          id: '2',
          name: 'Hardness Buffer',
          quantity: 10,
          image: require('../../assets/HardnessBuffer.jpeg'),
        },
        {
          id: '3',
          name: 'Molybdenum Packets',
          quantity: 3,
          image: require('../../assets/MolybdenumPackets.jpeg'),
        },
        {
          id: '4',
          name: 'Molybdenum Reagent',
          quantity: 7,
          image: require('../../assets/MolybdenumReagent.jpeg'),
        },
        {
          id: '5',
          name: 'Phenolphthalein',
          quantity: 5,
          image: require('../../assets/Phenolphthalein.jpeg'),
        },
        {
          id: '6',
          name: 'Starch Acid',
          quantity: 10,
          image: require('../../assets/StarchAcidIndicator.jpeg'),
        },
        {
          id: '7',
          name: 'Sulfite Titrant',
          quantity: 3,
          image: require('../../assets/SulfiteTitrant.jpeg'),
        },
        {
          id: '8',
          name: 'Total Hardness Indicator',
          quantity: 7,
          image: require('../../assets/TotalHardnessIndicator.jpeg'),
        },
        {
          id: '9',
          name: 'Trace Hardness Titrant',
          quantity: 7,
          image: require('../../assets/TraceHardnessTitrant.jpeg'),
        },
        {
          id: '10',
          name: 'Filter Membrane',
          quantity: 7,
          image: require('../../assets/FilterMembrane.jpeg'),
        },
      ];

      await addItemsToFirestore(hardcodedItems);

      // Combine Firestore data with hardcoded data
      const combinedData = data.map((firestoreItem) => {
        const correspondingHardcodedItem = hardcodedItems.find(
          (item) => item.id === firestoreItem.id
        );
  
        // If item is present in hardcoded items, use it; otherwise, use the one from Firestore
        return correspondingHardcodedItem
          ? { ...correspondingHardcodedItem, ...firestoreItem }
          : firestoreItem;
      });


      // Combine Firestore data with hardcoded data
      setChemicalsData(combinedData);
      await addItemsToFirestore(hardcodedItems);
    };
    fetchData();
  }, []);

  const decrementQuantity = async (id: string) => {
    const chemicalRef = doc(FIRESTORE_DB, 'Chemicals', id);
    const chemical = chemicalsData.find((item) => item.id === id);
    if (chemical && chemical.quantity > 0) {
      await updateDoc(chemicalRef, { quantity: chemical.quantity - 1 });
      setChemicalsData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
    }
  };

  const incrementQuantity = async (id: string) => {
    const chemicalRef = doc(FIRESTORE_DB, 'Chemicals', id);
    const chemical = chemicalsData.find((item) => item.id === id);
    if (chemical) {
      await updateDoc(chemicalRef, { quantity: chemical.quantity + 1 });
      setChemicalsData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
    }
  };

  return (
    <View style={styles.container}>
      <LogoutButton />
      <FlatList
        data={chemicalsData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card key={item.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.images} />
            </View>
            <Card.Content>
              <Text style={styles.label}>{item.name}</Text>
              <Card.Actions style={styles.buttonContainer}>
                <View style={styles.quantityContainer}>
                  <TouchableOpacity 
                      style={styles.button}
                      onPress={() => decrementQuantity(item.id)}>
                    <Text style={styles.quantityButton}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantity}>{item.quantity}</Text>
                  <TouchableOpacity 
                      style={styles.button}
                      onPress={() => incrementQuantity(item.id)}>
                    <Text style={styles.quantityButton}>+</Text>
                  </TouchableOpacity>
                </View>
              </Card.Actions>
            </Card.Content>
            <Card.Actions>
              <Button
                onPress={() => {

                }}
              >
                View Details
              </Button>
            </Card.Actions>
          </Card>

          
        )}
      />
    </View>
  );
};

export default Chemicals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4E03CB',
  },
  card: {
    width: 155,
    height: 300,
    margin: 10,
    backgroundColor: '#ADD8E6',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 100,
    width: 100,
  },
  label: {
    
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
    marginHorizontal: 20,
    borderRadius: 10,
    color: 'white',
  },
  quantity: {
    fontSize: 18,
    padding: 8,
  },
  button: {
    backgroundColor: 'blue', // Customize the button color
    borderRadius: 20, // Adjust the border radius as needed
    padding: 0 // Add padding to space the text inside the button
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
  },
  images: {
    height: 120, // Adjust the height as needed
    width: 70, // Adjust the width as needed
  },
});
