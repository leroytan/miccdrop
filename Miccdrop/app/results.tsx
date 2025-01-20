import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import React, { useEffect, useState } from 'react';
import { Text, Image, View, StyleSheet, Pressable, TouchableOpacity } from 'react-native';

const ResultsPage = () => {
	const searchParams = useSearchParams(); // Retrieve parameters from the route
	const songId = searchParams.get('songId'); // Use get method to retrieve the song parameter
	const score = searchParams.get('score');
	const [loading, setLoading] = useState(true); // State to track loading
	const [name, setName] = useState(''); // State to store song name
	const [image_url, setImageUrl] = useState(''); // State to store image URL
	const [artist, setArtist] = useState(''); // State to store artist name
	console.log(songId)

	useEffect(() => {
		const loadSongInfo = async () => {
			if (!songId) {
				console.error("No Spotify ID provided!");
				return;
			}

			try {
				// Post the songId to the backend to get image data
				const songData = await fetch(
					`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3001/api/v1/getSong`,
					{
						method: 'POST', // Specify the POST method
						headers: {
							'Content-Type': 'application/json', // Set content type
						},
						body: JSON.stringify({ id: songId }), // Pass the songId in the body
					}
				);

				if (!songData.ok) {
					throw new Error(`Failed to fetch song data: ${songData.statusText}`);
				}

				const { name, artist, image_url } = await songData.json(); // Retrieve JSON content
				setName(name);
				setImageUrl(image_url);
				setArtist(artist);
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
			<View style={styles.gradientContainer}>
				<Text style={styles.message}>Loading...</Text>
			</View>
		);
	}


	// Extract song details after loading
	const albumCover = image_url ? image_url : "https://i.scdn.co/image/ab67616d0000b27360cb9332e8c8c7d8e50854b3";
	const songName = name ? name : "You Belong With Me";
	const songArtist = artist ? artist : "Taylor Swift";

	return (
		<LinearGradient
			colors={['#94bbe9', '#fad0c4']}
			style={styles.gradientContainer}
		>
			<Pressable style={styles.backButton} onPress={() => router.back()}>
				<Image
					source={require('../assets/images/backIcon.png')}
					style={styles.backIcon}
				/>
			</Pressable>
			<Image source={{ uri: albumCover }} style={styles.albumCover} />
			<Text style={styles.songName}>{songName}</Text>
			<Text style={styles.artistName}>by {songArtist}</Text>
			<Text style={styles.message}>Congratulations! 🎉</Text>
			<Text style={styles.score}>Your Score: {score}</Text>
			<LinearGradient colors={['#f04be5', '#FFB6B6']} start={[0, 0]}
				end={[1, 2]} style={styles.editButton}>
				<TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
					<Text style={styles.editButtonText}>Back to Home!</Text>
				</TouchableOpacity>
			</LinearGradient>
		</LinearGradient>
	);
};

export default ResultsPage;

const styles = StyleSheet.create({
	editButton: {
		backgroundColor: '#ff6f61',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 8,
		elevation: 5,
		marginBottom: 50

	},
	editButtonText: {
		color: '#fff',
		fontSize: 16,
	},
	gradientContainer: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
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
	artistName: {
		fontSize: 18,
		color: '#666',
		marginBottom: 20,
	},
	message: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#333',
		marginBottom: 10,
	},
	score: {
		fontSize: 20,
		color: '#333',
		marginBottom: 30,
	},
	backButton: {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 1,
		backgroundColor: '#ffffff',
		borderRadius: 15,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},
	backIcon: {
		width: 20,
		height: 20,
		tintColor: '#344e76',
	},
	button: {
		backgroundColor: '#007bff',
		padding: 5,
		borderRadius: 10,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
});
