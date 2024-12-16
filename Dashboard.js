import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, ScrollView, Alert, Linking, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';

const Dashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user: routeUser } = route.params || {};


  const [items, setItems] = useState([]); 
  const [filteredItems, setFilteredItems] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [user, setUser] = useState(routeUser || null); 


  // Fetch items from AsyncStorage
  const fetchItems = async () => {
    setLoading(true);
    try {
      const savedItems = await AsyncStorage.getItem('items');
      if (savedItems) {
        const parsedItems = JSON.parse(savedItems);
        setItems(parsedItems); 
        setFilteredItems(parsedItems); 
      }
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }else{
      }
    } catch (error) {
      console.error('Error loading items from storage:', error);
    } finally {
      setLoading(false);
    }
  };

  

  // Handle updates when navigating back with an updated item
  useEffect(() => {
    if (route.params?.updatedItem) {
      fetchItems();
      const updatedItem = route.params.updatedItem;
      const updatedItems = items.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      );
      setItems(updatedItems);
      setFilteredItems(updatedItems);

      // Save the updated items to AsyncStorage
      AsyncStorage.setItem('items', JSON.stringify(updatedItems)).catch((error) =>
        console.error('Error updating item in storage:', error)
      );
    }
  }, [route.params?.updatedItem]);

  // Call fetchItems when the component mounts
  useEffect(() => { fetchItems();},[]);

  // Function to handle item press (navigate to item details)
  const handleItemPress = (item) => {
    navigation.navigate('ItemDetails', {
      title: item.title,
      category: item.category,
      price: item.price,
      description: item.description, 
      item: item,
    });
  };

  // Function to handle adding a new item
  const handleAddNewItem = async (newItem) => {
    const updatedItems = [...items, newItem]; 
    setItems(updatedItems); 
    setFilteredItems(updatedItems);

    // Save the updated list to AsyncStorage
    try {
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving item to storage:', error);
    }
  };

  // Function to handle deleting an item
  const handleDeleteItem = async (id) => {
    const filteredItemsList = items.filter((item) => item.id !== id); 
    setItems(filteredItemsList);
    setFilteredItems(filteredItemsList); 

    try {
      await AsyncStorage.setItem('items', JSON.stringify(filteredItemsList));
    } catch (error) {
      console.error('Error deleting item from storage:', error);
    }
  };

  // Function to mark an item as sold
  const handleMarkAsSold = async (id) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, status: 'Sold' } : item
    );
    setItems(updatedItems);
    setFilteredItems(updatedItems);

    try {
      await AsyncStorage.setItem('items', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error updating item status in storage:', error);
    }
  };

  // Function to filter items based on search query
  const handleSearch = (query) => {
    setSearchQuery(query);  
    const lowercasedQuery = query.toLowerCase();
    const filtered = items.filter(
      (item) =>
        item.title.toLowerCase().includes(lowercasedQuery) ||
        item.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredItems(filtered); 
  };

  // Function to open Messenger
  const handleOpenMessenger = (facebookLink) => {
    if (facebookLink) {
      const messengerUrl = `https://m.me/${facebookLink}`;
      Linking.openURL(messengerUrl).catch((err) =>
        Alert.alert('Error', 'Failed to open Messenger: ' + err.message)
      );
    } else {
      Alert.alert('Info', 'No Messenger link available.');
    }
  };

  // Function to handle log out
  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('user'); 
      navigation.replace('Login'); 
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  // Render each item in the FlatList
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handleItemPress(item)}>
        <Image source={{ uri: item.image.uri }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>{item.price}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
          <Text style={[styles.itemStatus, item.status === 'Sold' && styles.soldStatus]}>
            {item.status || 'Available'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Facebook Messenger Button */}
      {item.facebookLink && (
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => handleOpenMessenger(item.facebookLink)}
        >
          <Text style={styles.chatButtonText}>Message Seller</Text>
        </TouchableOpacity>
      )}

      {/* Delete Button */}
      <View style={styles.ownerButtons}>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteItem(item.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Set header right button for log out
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleLogOut} style={styles.logOutButton}>
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Welcome, {user?.name || 'Guest'}</Text>
      <Text style={styles.subHeader}>Your Items</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {filteredItems.length > 0 ? (
        <FlatList
          data={filteredItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2} 
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.grid}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#800000" style={styles.loader} /> : null
          }
        />
      ) : (
        <Text style={styles.noItemsText}>No items to display.</Text>
      )}

      {/* Button to add a new item */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddItem', { user, onAddItem: handleAddNewItem })}
      >
        <Text style={styles.addButtonText}>+ Add New Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  grid: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemContainer: {
    width: '48%', 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  itemImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemDetails: {
    padding: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#800000',
  },
  itemCategory: {
    fontSize: 12,
    color: '#888',
  },
  loader: {
    marginVertical: 20,
  },
  noItemsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  addButton: {
    backgroundColor: '#800000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  logOutButton: {
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 8,
    marginLeft: 15,
    marginTop: 5,   
  },
  logOutText: {
    color: '#fff',
    fontSize: 16,
  },
  chatButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
   marginHorizontal: 10,

  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
  },

});

export default Dashboard;
