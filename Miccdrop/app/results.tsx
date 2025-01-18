import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, Pressable } from 'react-native';

const ResultsPage = () => {
	// Placeholder data
	const searchParams = useSearchParams(); // Retrieve parameters from the route
	const song = searchParams.get('song'); // Use get method to retrieve the song parameter
	const score = searchParams.get('score');
	const [parsedSong, setParsedSong] = useState(null); // State to hold parsed song data
	const [loading, setLoading] = useState(true); // State to track loading

	useEffect(() => {
		const loadSongData = async () => {
			try {
				if (song) {
					const parsed = JSON.parse(song);
					setParsedSong(parsed); // Save parsed song data
				}
			} catch (error) {
				console.error('Error parsing song data:', error);
			} finally {
				setLoading(false); // Stop loading once data is processed
			}
		};

		loadSongData();
	}, [song]);

	if (loading) {
		// Show a loading indicator while data is being processed
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Loading...</Text>
			</View>
		);
	}

	// Extract song details after loading
	const albumCover =
		parsedSong?.album?.images?.[0]?.url || 'https://example.com/default-image.jpg';
	const songName = parsedSong?.name || 'Unknown Song';
		
	return (
		<View style={styles.container}>
			<Image source={{ uri: albumCover }} style={styles.albumCover} />
			<Text style={styles.songName}>{songName}</Text>
			<Text style={styles.message}>Congratulations! 🎉</Text>
			<Text style={styles.score}>Your Score: {score}</Text>
			<Pressable
				style={styles.button}
				onPress={() => router.push('/(tabs)/explore')}
			>
				<Text style={styles.buttonText}>Try another song!</Text>
			</Pressable>
			<Pressable
				style={styles.button}
				onPress={() => router.push({ "pathname": '/trackPlayer', "params": { "song": song } })}
			>
				<Text style={styles.buttonText}>Play Again!</Text>
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
