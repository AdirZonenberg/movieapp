import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase/Firebase"; // Import your Firebase authentication instance
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter your username/email and password.");
      return;
    }

    try {
      // Sign in with the provided username/email and password
      await signInWithEmailAndPassword(auth, username, password);
      navigation.navigate("Intermediate");
      // Navigate to the main app screen (or any other desired screen)
    // Replace "MainAppScreen" with your main app screen component name
    } catch (error) {
      alert("Login failed. " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Username/Email"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttonContainer,
          isPressed && styles.buttonContainerPressed,
        ]}
        onPress={() => navigation.navigate("Signup")} // Navigate to SignupScreen
      >
        <Text style={styles.buttonTextSingUp}>Sign-Up</Text>
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
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonTextSingUp: {
    color: "black",
    fontSize: 16,
  },
  buttonContainerPressed: {
    backgroundColor: "#0056b3", // Adjust the color for the pressed state
    elevation: 1, // Reduce the shadow elevation on press
  },
});

export default LoginScreen;
