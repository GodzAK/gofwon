import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';


const ItemDetails = () => {
  const [user, setUser] = useState(null);
  const route = useRoute(); 
  const navigation = useNavigation(); 
  const [item, setItem] = useState(route.params?.item || {});


  useEffect(() => 
    { if (route.params?.updatedItem) {
       setItem(route.params.updatedItem); 
      }
     }, [route.params?.updatedItem]);
      const handleEdit = () => { 
        navigation.navigate("EditItem", { itemId: item.id });
       };
       const handleMessageSeller = () => {
        if (item.facebookLink) {
          const facebookUrl = `https://m.me/${item.facebookLink}`; 
          Linking.openURL(facebookUrl)
            .catch(err => alert("Failed to open Facebook link: " + err.message)); 
        } else {
          alert("No Facebook link available.");
        }
      };


  return (
    <View style={styles.container}>
    {item.image && item.image.uri ? (
      <Image source={{ uri: item.image.uri }} style={styles.image} />
    ) : (
      <Image source={require('./assets/adaptive-icon.png')} style={styles.image} />
    )}

    <Text style={styles.title}>{item.title}</Text>
    <Text style={styles.price}>{item.price}</Text>
    <Text style={styles.category}>{item.category}</Text>
    <Text style={styles.description}>{item.description}</Text>

      <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
        <Text style={styles.editButtonText}>Edit Item</Text>
      </TouchableOpacity>

      {item.facebookLink ? (
        <TouchableOpacity onPress={handleMessageSeller} style={styles.facebookButton}>
          <Text style={styles.facebookButtonText}>Message Seller on Facebook</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  price: {
    fontSize: 20,
    color: '#800000',
    marginVertical: 5,
  },
  category: {
    fontSize: 16,
    marginVertical: 5,
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  editButton: {
    backgroundColor: '#800000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  facebookButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ItemDetails;
