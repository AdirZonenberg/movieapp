import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase/Firebase"; // Import your Firebase authentication instance
import { db } from "../firebase/Firebase"; // Import your Firestore instance

const IntermediateScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState(null);

  const handleSignOut = async () => {
    try {
      // Sign out the user
      await auth.signOut();

      // Navigate back to the Signup screen
      navigation.navigate("Signup"); // Replace "Signup" with your signup screen component name
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  const handleContinueToApp = () => {
    navigation.navigate("Home");
    // Navigate to the Home screen or any other desired screen in your app
    // Replace "Home" with your home screen component name
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")} // Replace with your university image
        style={styles.universityImage}
      />
      <Text style={styles.text}>Welcome to the IMDB App!</Text>
      <Text style={styles.text}>App Information:</Text>
      <Text style={styles.text}>Name: Adir </Text>
      <Text style={styles.text}>Last Name: Zonenberg</Text>
      <Text style={styles.text}>Email: adir.zonenberg@gmail.com</Text>
      <Text style={styles.text}>
        Department: Software engineer, Ariel University
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleContinueToApp}>
        <Text style={styles.buttonText}>Continue to App</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign-out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  universityImage: {
    width: 200,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default IntermediateScreen;
