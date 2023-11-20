import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { FIRESTORE_DB } from '../../firebaseConfig'; // Make sure to provide the correct path to your firebaseConfig
import { getDocs, deleteDoc, doc, collection, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { Card, Button } from 'react-native-paper';
import Search from '../../components/Search';
import LogoutButton from '../screens/LogoutButton';

interface InventoryItem {
  id: string;
  [key: string]: any;
  PartName: string;
  PartNumber: string;
  Location: string;
  Manufacturer: string;
  Quantity: string;
  Image: string;
  onRemove: () => Promise<void>;
}

const Inventory: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false); // State for refresh control

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'Inventory'));
    const data: InventoryItem[] = [];
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      data.push({
        id: doc.id,
        ...doc.data() as InventoryItem,
        onRemove: () => removeItem(doc.id),
      });
    });
    setInventoryData(data);
  };

  const removeItem = async (itemId: string): Promise<void> => {
    await deleteDoc(doc(FIRESTORE_DB, 'Inventory', itemId));
    setInventoryData((prevData) => prevData.filter((item) => item.id !== itemId));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <LogoutButton />
      <View style={styles.searchInputContainer}>
        <Search setSearchTerm={setSearchTerm} />
      </View>
      <FlatList
        style={styles.flatList}
        data={inventoryData.filter(
          (item) =>
            Object.values(item)
              .join('')
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          
            <TouchableOpacity style={styles.cardButton}>
            <Card key={item.id} style={styles.card}>
              <Card.Content>
                {/* Iterate over the keys of the item to display them */}
                {Object.keys(item).map((key) => {
                  if (key !== 'id' && key !== 'Image' && key !== 'onRemove') {
                    return (
                      <View key={key} style={styles.fieldContainer}>
                        <Text style={styles.label}>{key}:</Text>
                        <Text style={styles.value}>{item[key]}</Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </Card.Content>
              {/* Conditionally render the image if it exists */}
              {item.Image && (
                <Image style={styles.cardImage} source={{ uri: item.Image }} />
              )}
              <Card.Actions>
                {/* Render the Remove button */}
                <Button
                  style={styles.removeButton}
                  icon="delete"
                  onPress={item.onRemove}
                >
                  Remove
                </Button>
              </Card.Actions>
            </Card>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};


export default Inventory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4E03CB',
  },
  PageTitle: {
    fontSize: 28,
    justifyContent: 'center',
  },
  flatList: {
    marginTop: 100,
  },
  itemContainer: {
    flexDirection: 'column',
    paddingTop: 30,
    paddingLeft: 0,
    marginLeft: 0,
    padding: 30,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  cardImage: {
    position: 'absolute',
    marginRight: 15,
    marginTop: 15,
    top: 0,
    right: 0,
    height: 150,
    width: 130,
  },
  value: {
    fontSize: 18,
  },
  removeButton: {
    backgroundColor: 'red',
    marginRight: 10,
  },
  searchInputContainer: {
    position: 'absolute',
    top: 5,
    // marginTop: StatusBar.currentHeight,
    paddingHorizontal: 45,
    borderRadius: 10,
    paddingVertical: 10,
    width: '95%',
    backgroundColor: 'white'
  },
  card: {
    width: 320,
    height: 250,
    margin: 10,
    backgroundColor: '#ADD8E6',
  },
  cardButton: {
    display: 'flex'
  },
  detailsButton: {
    position: 'absolute',
    bottom: 10,
    marginLeft: 20,
    height: 41,
    width: 100,
    justifyContent: 'center',
    backgroundColor: '#8d8d99',
  }
});
