import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from "@react-navigation/native";

const AddItem = ({ route, navigation }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Books");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [facebookLink, setFacebookLink] = useState(""); 
  const [permission, setPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const { onAddItem } = route.params; 

  useEffect(() => {
    const getPermission = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermission(status === 'granted');
    };
    getPermission();
  }, []);

  const pickImage = async () => {
    if (permission === null) {
      Alert.alert("Please wait", "Permission status is still loading.");
      return;
    }

    if (!permission) {
      Alert.alert("Permission Required", "Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the image URI
    } else {
      console.log("Image selection canceled");
    }
  };

  const handleUpload = () => {
    if (title && category && price && description && image && facebookLink) {
      setLoading(true);
      const newProduct = {
        id: Math.random().toString(),
        title,
        category,
        price: `₱${price}`,
        description,
        image: { uri: image },
        facebookLink, // Add Facebook link to the new item
      };
  
      // Call onAddItem passed from the Dashboard screen to append new item
      onAddItem(newProduct);
  
      // Reset fields
      setTitle("");
      setCategory("Books");
      setPrice("");
      setDescription("");
      setImage(null);
      setFacebookLink(""); // Reset Facebook link field
  
      setLoading(false);
      Alert.alert("Success", "Item uploaded successfully!");
      navigation.goBack();
    } else {
      Alert.alert("Missing Information", "Please fill in all fields.");
    }
  };
  

  const selectCategory = (category) => {
    setCategory(category);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload a New Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      
      {/* Category Buttons */}
      <Text style={styles.label}>Select Category</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, category === "Books" && styles.selectedButton]}
          onPress={() => selectCategory("Books")}
        >
          <Text style={[styles.buttonText, category === "Books" && styles.selectedButtonText]}>Books</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, category === "Clothes" && styles.selectedButton]}
          onPress={() => selectCategory("Clothes")}
        >
          <Text style={[styles.buttonText, category === "Clothes" && styles.selectedButtonText]}>Clothes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, category === "Electronics" && styles.selectedButton]}
          onPress={() => selectCategory("Electronics")}
        >
          <Text style={[styles.buttonText, category === "Electronics" && styles.selectedButtonText]}>Electronics</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
      />
      
      {/* Facebook Link Input */}
      <TextInput
        style={styles.input}
        placeholder="Facebook(username) (ex.GodsManson999)"
        value={facebookLink}
        onChangeText={setFacebookLink}
      />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.imageButtonText}>Pick Image</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

      {loading ? (
        <ActivityIndicator size="large" color="#800000" />
      ) : (
        <Button title="Upload Item" onPress={handleUpload} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  selectedButton: {
    backgroundColor: "#800000",
  },
  buttonText: {
    color: "#000",  // Black text color for the button
  },
  selectedButtonText: {
    color: "#fff",  // White text color for the selected button
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "#800000",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imageButtonText: {
    color: "#fff",
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default AddItem;
