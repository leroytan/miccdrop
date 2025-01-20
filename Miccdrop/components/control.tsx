import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

function Control({
	handlePlay,
	handlePause,
	handleStop,
	current,
	setCurrent,
}: {
	handlePlay: () => void;
	handlePause: () => void;
	handleStop: () => void;
	current: number;
	setCurrent: (c: number) => void;
}) {
	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={handlePlay}>
				<Image
					source={require("../assets/images/play-button-arrowhead.png")}
					style={styles.icon} />
			</TouchableOpacity>
			<TouchableOpacity onPress={handlePause}>
			<Image
					source={require("../assets/images/pause.png")}
					style={styles.icon} />
			</TouchableOpacity>
			<TouchableOpacity onPress={handleStop}>
			<Image
					source={require("../assets/images/stop-button.png")}
					style={styles.icon} />
			</TouchableOpacity>
			<TextInput
				style={styles.input}
				value={current.toString()}
				onChangeText={(text) => setCurrent(Number(text))}
				editable={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		// round corners
		borderRadius: 15,
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
	icon: {
		width: 20,
		height: 20,
		tintColor: '#344e76',
	},
	input: {
		fontFamily: 'monospace',
		fontSize: 16,
		borderWidth: 1,
		borderColor: '#ccc',
		padding: 10,
		borderRadius: 5,
		width: 60,
		textAlign: 'center',
	},
});

export default Control;
