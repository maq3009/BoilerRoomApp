import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig';
import {
  getDocs,
  collection,
  DocumentData,
  QueryDocumentSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { Card, Button } from 'react-native-paper';
import LogoutButton from './LogoutButton';

interface ChemicalItem {
  id: string;
  name: string;
  quantity: number;
  image: string;
}

const Chemicals: React.FC = () => {
  const [chemicalsData, setChemicalsData] = useState<ChemicalItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Chemicals'));
      const data: ChemicalItem[] = [];
      querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setChemicalsData(data);
    };
    fetchData();
  }, []);

  const decrementQuantity = async (id: string) => {
    const chemicalRef = doc(FIRESTORE_DB, 'Chemicals', id);
    const chemical = chemicalsData.find((item) => item.id === id);
    if (chemical && chemical.quantity > 0) {
      await updateDoc(chemicalRef, { quantity: chemical.quantity - 1 });
    }
  };

  const incrementQuantity = async (id: string) => {
    const chemicalRef = doc(FIRESTORE_DB, 'Chemicals', id);
    const chemical = chemicalsData.find((item) => item.id === id);
    if (chemical) {
      await updateDoc(chemicalRef, { quantity: chemical.quantity + 1 });
    }
  };

  return (
    <View style={styles.container}>
      <LogoutButton/>
      <FlatList
        data={chemicalsData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card key={item.id} style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Card.Content>
              <Text style={styles.label}>{item.name}</Text>
              <Card.Actions style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => decrementQuantity(item.id)}>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => incrementQuantity(item.id)}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
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
    width: 150,
    margin: 10,
    backgroundColor: '#ADD8E6',
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
  quantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 18,
  },
});
