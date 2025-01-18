import React, { Component, useState } from 'react';
import { Text, Image, View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { router, useRouter } from 'expo-router';

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

// Define the full data as an array of tracks
type TrackData = Track[];

const SongItem = ({ item }: { item: Track }) => (
  <View key={item.id} style={styles.item}>
    <Image
      source={{ uri: item.album.images[0].url }}
      style={{ width: 80, height: 80 }}
    />
    <Text>{item.name}</Text>
    <Text>{item.artists[0].name}</Text>
    <Pressable onPress={() =>
          router.push({
            pathname: '/trackPlayer',
            params: { song: JSON.stringify(item) }, // Pass parameters here
          })}>
      <Image
        source={require('C:/Users/ansel/miccdrop/Miccdrop/assets/images/playIcon.png')}
        style={{ width: 40, height: 40 }}
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
    <View style={{ flex: 1 }}>
      <Text style={styles.text}>Current Category: Popular Songs</Text>
      <View style={styles.view}>
        <SearchBar
          placeholder="Search for a song!"
          onChangeText={updateSearch}
          value={query}
        />
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {query.length === 0
            ? songNames.map((item: Track) => <SongItem key={item.id} item={item} />)
            : results.map((item: Track) => <SongItem key={item.id} item={item} />)}
        </ScrollView>
      </View>
    </View>
  );
}


export default SongScroller

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 30,
    margin: 2,
    borderColor: '#2a4944',
    borderWidth: 1,
    backgroundColor: '#d2f7f1'
  },
  view: {
    margin: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white'
  },
})
