import React, { Component, useState } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const songNames = require('../spotifyData.json');

// Define types for the artist structure
type Artist = {
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	name: string;
	type: string;
	uri: string;
};

// Define types for the album structure
type Album = {
	album_type: string;
	artists: Artist[];
	available_markets: string[];
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	images: {
		url: string;
		width: number;
		height: number;
	}[];
	name: string;
	release_date: string;
	release_date_precision: string;
	total_tracks: number;
	type: string;
	uri: string;
};

// Define types for the main track structure
type Track = {
	album: Album;
	artists: Artist[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
	};
	external_urls: {
		spotify: string;
	};
	href: string;
	id: string;
	is_local: boolean;
	name: string;
	popularity: number;
	preview_url: string | null;
	track_number: number;
	type: string;
	uri: string;
};

const SongItem = ({ item }: { item: Track }) => (
	<View key={item.id} style={styles.songItem}>
		<Image
			source={{ uri: item.album.images[0].url }}
			style={styles.albumCover}
		/>
		<View style={styles.songInfo}>
			<Text style={styles.songName}>{item.name}</Text>
			<Text style={styles.artistName}>{item.artists[0].name}</Text>
		</View>
		<Pressable
			style={styles.playButton}
			onPress={() =>
				router.push({
					pathname: '/trackPlayer',
					params: { song: JSON.stringify(item) },
				})
			}
		>
			<Image
				source={require('../assets/images/playIcon.png')}
				style={styles.playIcon}
			/>
		</Pressable>
	</View>
);

function SongScroller() {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Track[]>([]);
	const updateSearch = (query: string) => {
		setQuery(query);
		const results = searchSongs(query);
		setResults(results);
	};

	// currently only searches the first artist
	const searchSongs = (query: string): Track[] => {
		return songNames.filter((song: Track) =>
			song.name.toLowerCase().includes(query.toLowerCase()) ||
			song.artists[0].name.toLowerCase().includes(query.toLowerCase())
		);
	};

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
			<Text style={styles.headerText}>🎵 Popular Songs 🎵</Text>
			<SearchBar
				placeholder="Search for a song..."
				onChangeText={updateSearch}
				value={query}
				containerStyle={styles.searchBarContainer}
				inputContainerStyle={styles.searchBarInput}
				inputStyle={styles.searchBarText}
			/>
			<ScrollView contentContainerStyle={styles.songList}>
				{query.length === 0
					? songNames.map((item: Track) => <SongItem key={item.id} item={item} />)
					: results.map((item: Track) => <SongItem key={item.id} item={item} />)}
			</ScrollView>
		</LinearGradient>
	);
}


export default SongScroller

const styles = StyleSheet.create({
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
	gradientContainer: {
		flex: 1,
		paddingHorizontal: 20,
		paddingVertical: 10,
	},
	headerText: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#344e76',
		textAlign: 'center',
		marginVertical: 15,
	},
	searchBarContainer: {
		backgroundColor: 'transparent',
		borderTopWidth: 0,
		borderBottomWidth: 0,
		marginBottom: 15,
	},
	searchBarInput: {
		backgroundColor: '#ffffff',
		borderRadius: 20,
		paddingHorizontal: 10,
		borderWidth: 0, // Remove border
		shadowColor: 'transparent', // Remove shadow
	},
	searchBarText: {
		color: '#344e76', // Customize text color
	},
	songList: {
		flexGrow: 1,
	},
	songItem: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		borderRadius: 10,
		padding: 15,
		marginBottom: 10,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
	},
	albumCover: {
		width: 60,
		height: 60,
		borderRadius: 5,
		marginRight: 10,
	},
	songInfo: {
		flex: 1,
	},
	songName: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#344e76',
	},
	artistName: {
		fontSize: 14,
		color: '#576c89',
	},
	playButton: {
		padding: 10,
		backgroundColor: '#ff9a9e',
		borderRadius: 20,
	},
	playIcon: {
		width: 20,
		height: 20,
		tintColor: '#ffffff',
	},
})
