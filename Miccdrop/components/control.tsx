import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function Control({
  onPlay,
  onPause,
  onReset,
  current,
  setCurrent,
  recoverAutoScrollImmediately,
}: {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  current: number;
  setCurrent: (c: number) => void;
  recoverAutoScrollImmediately: () => void;
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPlay} style={styles.button}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPause} style={styles.button}>
        <Text style={styles.buttonText}>Pause</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onReset} style={styles.button}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={current.toString()}
        onChangeText={(text) => setCurrent(Number(text))}
      />
      <TouchableOpacity onPress={recoverAutoScrollImmediately} style={styles.button}>
        <Text style={styles.buttonText}>Recover Auto Scroll</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10, // Only works in React Native 0.71+. For older versions, use margins.
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#dedede',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    width: 60,
    textAlign: 'center',
  },
});

export default Control;
