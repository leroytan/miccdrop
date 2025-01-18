import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  Image,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

export default function AccountCreationScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleCreateAccount = async () => {
    try {
      const results = await fetch(`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3001/api/v1/createAccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (results.ok) {
        Alert.alert("Success", "Account created successfully!");
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login");
      } else {
        const errorData = await results.json();
        Alert.alert("Error", errorData.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Account creation error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleLogin = () => {
    return router.push("/login");
  };

  return (
    <LinearGradient
      colors={["#FFDEE9", "#B5FFFC", "#FCE1FF"]}
      style={styles.background}
      start={[0, 0]}
      end={[1, 1]}
    >
      <View style={styles.container}>
        <Image
          source={require("@/assets/images/miccdrop_logo.jpeg")}
          style={styles.logo}
        />
        <Text style={styles.title}>Welcome to MiccDrop!</Text>
        <Text style={styles.tagline}>
        Sing Loud, Sing Proud, Sing Off-Key!
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#aaa"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#aaa"
            secureTextEntry
          />
        </View>
        <LinearGradient
          colors={["#f04be5", "#FFB6B6"]}
          start={[0, 0]}
          end={[1, 2]}
          style={styles.createButton}
        >
          <TouchableOpacity onPress={handleCreateAccount}>
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>
        </LinearGradient>
        <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    padding: 16,
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center",
  },
  input: {
    width: "70%",
    padding: 12,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  createButton: {
    backgroundColor: "#ff6f61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  loginContainer: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
    marginTop:10
  },
  loginText: {
    fontSize: 13,
    color: "#555",
  },
  loginLink: {
    fontSize: 13,
    color: "#f04be5", 
    textDecorationLine: "underline", 
  },


});
