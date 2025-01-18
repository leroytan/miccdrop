import React from 'react';
import { Text, Image, View, StyleSheet, Pressable } from 'react-native';

const ResultsPage = () => {
  // Placeholder data
  const albumCover = 'https://i.scdn.co/image/ab67616d0000b273f907de96b9a4fbc04accc0d5';
  const songName = 'God\'s Plan';
  const score = 49600;

  return (
    <View style={styles.container}>
      {/* Album Cover */}
      <Image source={{ uri: albumCover }} style={styles.albumCover} />
      {/* Song Name */}
      <Text style={styles.songName}>{songName}</Text>
      {/* Congratulatory Message */}
      <Text style={styles.message}>Congratulations! 🎉</Text>
      {/* Player's Score */}
      <Text style={styles.score}>Your Score: {score}</Text>
      {/* Button to return to the home page */}
      <Pressable
        style={styles.button}
        onPress={() => console.log('Back to Home pressed')}
      >
        <Text style={styles.buttonText}>Go to Home</Text>
      </Pressable>
    </View>
  );
};

export default ResultsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  albumCover: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  songName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 18,
    color: '#4caf50',
    marginBottom: 10,
  },
  score: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
