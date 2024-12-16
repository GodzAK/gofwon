import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const EditItem = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { itemId } = route.params;
  const [updatedItem, setUpdatedItem] = useState({
    title: '',
    category: '',
    price: '',
    description: '',
    facebookLink: ''
  });
  const [user, setUser] = useState(null);


  // Fetch current item data from AsyncStorage
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const savedItems = await AsyncStorage.getItem('items');
        const items = JSON.parse(savedItems) || [];
        const currentItem = items.find((item) => item.id === itemId);
        if (currentItem) {
          setUpdatedItem(currentItem);
        }
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    };
    fetchItem();
  }, [itemId]);

  const handleInputChange = (field, value) => {
    setUpdatedItem({ ...updatedItem, [field]: value });
  };

  const handleSave = async () => {
    const { title, category, price, description, facebookLink, image } = updatedItem;
  
    if (!title || !category || !price || !description || !facebookLink) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }
  
    const parsedPrice = parseFloat(price.trim());
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price.");
      return;
    }
  
    try {
      updatedItem.price = `₱${parsedPrice.toFixed(2)}`;
  
      // Ensure image exists in the item object, or set it to a default
    updatedItem.image = updatedItem.image || { uri: '' }; 

      const items = JSON.parse(await AsyncStorage.getItem('items')) || [];
      const updatedItems = items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
  
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
      navigation.navigate('ItemDetails', { updatedItem });
  
    } catch (error) {
      Alert.alert('Error', 'Failed to save changes.');
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={updatedItem.title}
        onChangeText={(value) => handleInputChange('title', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Category"
        value={updatedItem.category}
        onChangeText={(value) => handleInputChange('category', value)}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={updatedItem.price}
        onChangeText={(value) => handleInputChange('price', value)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={updatedItem.description}
        onChangeText={(value) => handleInputChange('description', value)}
        multiline={true}
        numberOfLines={4}
      />

      <TextInput
        style={styles.input}
        placeholder="Facebook Link"
        value={updatedItem.facebookLink}
        onChangeText={(value) => handleInputChange('facebookLink', value)}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#800000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditItem;
