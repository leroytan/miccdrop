import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin'


export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleDefaultSignIn = async () => {
    try {
      const results = await fetch(`http://172.31.214.28:3001/api/v1/signInDefault`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        }),
      })

    if (results.ok) {
      Alert.alert('Success', 'Logged in successfully');
      setUsername('');
      setPassword('');
      router.push('/(tabs)/explore'); // Navigate to the explore page
    } else {
      const errorData = await results.json();
      Alert.alert('Login Failed', errorData.message);
    }
    } catch (error) {
      console.error('Sign up error:', error);
      Alert.alert('Username taken', 'Choose another username!',
        [{ text: 'Please try again', onPress: () => console.log('Alert closed') }]);
      setUsername('');
      setPassword('');
    } 
  };
  
  const handleGoogleSignIn = async () => {
    try {
      GoogleSignin.configure({
        iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      })
      // Ensure Google Play Services are available (Android)
      await GoogleSignin.hasPlayServices();
  
      // Trigger Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      const data = userInfo.data
      const user = data.user
      const email = user.email
      try {
        const results = await fetch(`http://172.31.214.28:3001/api/v1/signInWithGoogle`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email
          }),
        })
  
        if (results.ok) {
          Alert.alert('Success', 'Logged in successfully');
          setUsername('');
          setPassword('');
          router.push('/(tabs)/explore'); 
        } else {
          const errorData = await results.json();
          Alert.alert('Login Failed', errorData.message);
        }
      } catch (error) {
        console.error('Sign up error:', error);
        setUsername('');
        setPassword('');
      } 
    
    } catch (error) {
      console.error(error);
  
      // Handle errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in process.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
          Alert.alert('Sign-In In Progress', 'A sign-in process is already in progress.');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Alert.alert('Error', 'Google Play Services are not available.');
      } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };
  
  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/miccdrop_logo.jpeg')}
        style={styles.logo}
      />
      <ThemedText type="title" style={styles.title}>Login</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleDefaultSignIn} />
      <ThemedText type="default" style={styles.title}> or </ThemedText>
      <GoogleSigninButton onPress={handleGoogleSignIn}/>
    </ThemedView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 32,
  },
  title: {
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
});