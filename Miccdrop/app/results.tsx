import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, Pressable } from 'react-native';

const ResultsPage = () => {
	// Placeholder data
	const searchParams = useSearchParams(); // Retrieve parameters from the route
	const songId = searchParams.get('spotifyId'); // Use get method to retrieve the song parameter
	const score = searchParams.get('score');
	const [parsedSong, setParsedSong] = useState(null); // State to hold parsed song data
	const [loading, setLoading] = useState(true); // State to track loading
	const [image, setImage] = useState(null);
	const [name, setName] = useState(null);
	useEffect(() => {
		const loadSongInfo = async () => {
			if (!songId) {
				console.error("No Spotify ID provided!");
				return;
			}

			try {
				// Fetch song details from the backend TO CHANGE
				const songName = await fetch(
					`http://localhost:3001/api/v1/getSongWithId?id=${songId}`
				);

				if (!songName.ok) {
					throw new Error(`Failed to fetch song name: ${songName.statusText}`);
				}

				const songImage = await fetch(
					`http://localhost:3001/api/v1/getSongWithId?id=${songId}`
				);
				// new endpoint
				if (!songImage.ok) {
					throw new Error(`Failed to fetch song image: ${songImage.statusText}`);
				}

				setName(songName); // Set the lyrics state with the content
				setImage(songImage); // Set the lyrics state with the content
			} catch (error) {
				console.error("Error loading LRC file:", error);
			} finally {
				setLoading(false); // Update loading state to false
			}
		};

		loadSongInfo();
	}, [songId]);
	
	if (loading) {
		// Show a loading indicator while data is being processed
		return (
			<View style={styles.container}>
				<Text style={styles.message}>Loading...</Text>
			</View>
		);
	}


	// Extract song details after loading
	const albumCover = image ? image : "https://i.scdn.co/image/ab67616d0000b27360cb9332e8c8c7d8e50854b3";

	const songName = name;
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
				onPress={() => router.push({ "pathname": '/trackPlayer', "params": { "songId": songId } })}
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
		padding: 10,
		borderRadius: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
