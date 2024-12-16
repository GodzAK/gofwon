import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Image, View, Text, StyleSheet } from "react-native"; 
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import CreateAccountPage from "./CreateAccountPage";
import Dashboard from "./Dashboard";
import AddItem from "./AddItem";
import ItemDetails from "./ItemDetails";
import EditItem from './EditItem'; 

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen 
          name="HomePage" 
          component={HomePage} 
          options={{
            headerTitle: () => (
              <View style={styles.headerContainer}>
                <Image
                  source={require('./assets/logo3.png')} 
                  style={styles.logo}
                />
                <Text style={styles.title}>UBuy & Sell</Text>
              </View>
            ),
          }} 
        />
        <Stack.Screen 
          name="CreateAccount" 
          component={CreateAccountPage} 
          options={{ title: "Create Account" }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginPage} 
          options={{ title: "Log In" }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ title: "Dashboard" }} 
        />
        <Stack.Screen 
          name="AddItem" 
          component={AddItem} 
          options={{ title: "Add Item" }} 
        />
        <Stack.Screen 
          name="ItemDetails" 
          component={ItemDetails} 
          options={{ title: "Item Details" }}
        />
        <Stack.Screen 
          name="EditItem" 
          component={EditItem} 
          options={{ title: "Edit Item" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center", 
  },
  logo: {
    width: 35,
    height: 59,
    marginRight: 2, 
    marginLeft:-11,
    marginTop: 6

  },
  title: {
    fontSize: 20, 
    fontWeight: "bold",
    color: "#000", 
  },
});
