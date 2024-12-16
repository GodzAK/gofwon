import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, Image } from "react-native";

const LoginPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const emailRegex = /@(ubmail|ub.edu.ph)$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please use a valid UB email address (either @ubmail or @ub.edu.ph).");
      return;
    }

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all the fields.");
      return;
    }

    fetch("http://192.168.0.139/ubuyandsell/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigation.navigate("Dashboard", { user: data.user });
        } else {
          Alert.alert("Login Failed", data.message);
        }
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Network request failed.");
      });
  };

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo3.png')} style={styles.logo} />
      <Text style={styles.header}>Log In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center", 
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    width: "100%",
  },
  loginButton: {
    backgroundColor: "#800000",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LoginPage;
