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
  Platform,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

const { height } = Dimensions.get("window");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleDefaultSignIn = async () => {
    try {
      const results = await fetch(`http://172.31.27.63:3001/api/v1/signInDefault`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      // Read the response body only once
      const responseData = await results.json();
  
      if (results.ok) {
        console.log("Response Data:", responseData);  
        Alert.alert("Success", responseData.message || "Logged in successfully!");
        setUsername("");
        setPassword("");
        router.push("/(tabs)/explore");
      } else {
        console.log("Error Response Data:", responseData);
        Alert.alert("Login Failed", responseData.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setTimeout(() => {
        Alert.alert("Error", "Something went wrong. Please try again.");
      }, 0);
      setUsername("");
      setPassword("");
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      });
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { email } = userInfo.data.user;

      const results = await fetch(`http://172.31.27.63:3001/api/v1/signInWithGoogle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (results.ok) {
        Alert.alert("Success", "Logged in successfully");
        setUsername("");
        setPassword("");
        router.push("/(tabs)/explore");
      } else {
        const errorData = await results.json();
        Alert.alert("Login Failed", errorData.message);
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const handleCreateAccount = () => {router.push("/accountcreation")};

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
        <ThemedText type="title" style={styles.title}>
          Login
        </ThemedText>
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
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#aaa"
          />
        </View>
        <LinearGradient colors={['#f04be5', '#FFB6B6']} start={[0, 0]}
        end={[1, 2]} style={styles.editButton}>
          <TouchableOpacity onPress={handleDefaultSignIn}>
            <Text style={styles.editButtonText}>Login</Text>
          </TouchableOpacity>
        </LinearGradient>

        {Platform.OS !== "web" && (
          <>
            <ThemedText type="default" style={styles.orText}>
              or
            </ThemedText>
            <LinearGradient colors={['#f04be5', '#FFB6B6']} start={[0, 0]}
              end={[1, 2]} style={styles.editButton}>
              <TouchableOpacity onPress={handleGoogleSignIn}>
                <Text style={styles.editButtonText}>Sign in with Google</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}
      </View>
      <View style={styles.createAccountContainer}>
        <Text style={styles.createAccountText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleCreateAccount}>
          <Text style={styles.createAccountLink}>Create one</Text>
        </TouchableOpacity>
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
    marginTop: -40,
    marginBottom:10
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 35,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
    alignItems: "center"
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
  button: {
    backgroundColor: "#FFDEE9",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
  },
  orText: {
    marginVertical: 16,
    fontSize: 16,
    color: "#555",
  },
  googleButton: {
    width: "100%",
    height: 48,
  },
  editButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    marginBottom:50

  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  createAccountContainer: {
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "center",
  },
  createAccountText: {
    fontSize: 13,
    color: "#555",
  },
  createAccountLink: {
    fontSize: 13,
    color: "#f04be5", 
    textDecorationLine: "underline", 
  },


});
