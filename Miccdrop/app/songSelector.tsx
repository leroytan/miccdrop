import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { router, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

type Song = {
  song_name: string;
  spotify_id: string;
  lyrics_url: string;
  images: string;
  artist: string;
};

const SongItem = ({ item }: { item: Song }) => (
	<View key={item.spotify_id} style={styles.songItem}>
		<Image
			source={{ uri: item.images }}
			style={styles.albumCover}
		/>
		<View style={styles.songInfo}>
			<Text style={styles.songName}>{item.song_name}</Text>
			<Text style={styles.artistName}>{item.artist}</Text>
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
  const [query, setQuery] = useState('');
  const [songs, setSongs] = useState<Song[]>([]);
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSongs = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/v1/getAllSongs', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }); // Use the correct base URL
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      
      const data = await response.json(); // Parse the response as JSON
      console.log("Parsed Data:", data);
  
      if (data.status === 'success') {
        setSongs(data.data);
        setResults(data.data); // Show all songs initially
      } else {
        console.error('Failed to fetch songs:', data.message);
      }
      } catch (error) {
      console.error('Error fetching songs:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSongs();
  }, []);

  const updateSearch = (query: string) => {
    setQuery(query);
    const filteredResults = songs.filter((song) =>
      song.song_name.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filteredResults);
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
					? songs.map((item: Song) => <SongItem key={item.spotify_id} item={item} />)
					: results.map((item: Song) => <SongItem key={item.spotify_id} item={item} />)}
			</ScrollView>
		</LinearGradient>
	);
}

export default SongScroller;

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
