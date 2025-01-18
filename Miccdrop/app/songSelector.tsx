import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { router } from 'expo-router';

type Song = {
  song_name: string;
  spotify_id: string;
  lyrics_url: string;
};

const SongItem = ({ item }: { item: Song }) => (
  <View key={item.spotify_id} style={styles.item}>
    <View>
      <Text style={styles.songName}>{item.song_name}</Text>
      <Text style={styles.spotifyId}>Spotify ID: {item.spotify_id}</Text>
    </View>
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/trackPlayer',
          params: { spotify_id: item.spotify_id }, // Pass song data as parameters
        })
      }
    >
      <Text style={styles.playButton}>Play</Text>
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

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#121212' }}>
      <Text style={styles.text}>Current Category: Popular Songs</Text>
      <View style={styles.view}>
        <SearchBar
          placeholder="Search for a song!"
          onChangeText={updateSearch}
          value={query}
          lightTheme
        />
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {results.map((item: Song) => (
            <SongItem key={item.spotify_id} item={item} />
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

export default SongScroller;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    margin: 5,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1',
    borderRadius: 10,
  },
  view: {
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white',
  },
  songName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  spotifyId: {
    fontSize: 12,
    color: '#666',
  },
  playButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});
