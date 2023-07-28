// SignupScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";

import { auth, db, app } from "../firebase/Firebase"; // Import getAuth instead of auth
import {
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
const SignupScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");

  const handleSignup = async () => {
    if (!firstName || !lastName) {
      alert("Please enter your first name and last name.");
      return;
    }

    if (!email.includes("@")) {
      alert("Invalid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters long.");
      return;
    }

    if (parseInt(age) < 18) {
      alert("You must be 18 or older to sign up.");
      return;
    }

    try {
      // Create a new user account with email and password using Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user; // Extract the user from the userCredential object

      // Create a new user document in Firestore
      await addDoc(collection(db, "users"), {
        firstName,
        lastName,
        email,
        age: parseInt(age),
        // Add any other user data you want to store in the document
      });
      navigation.navigate("Login"); // Replace "LoginScreen" with the name of your login screen component

      // Navigate to the next screen or perform any other actions upon successful signup
      // For example, you can use navigation.navigate() to navigate to the next screen
    } catch (error) {
      alert("Signup failed. " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={setFirstName}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={setLastName}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        onChangeText={setAge}
        value={age}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignupScreen;
