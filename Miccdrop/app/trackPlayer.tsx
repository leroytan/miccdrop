import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import { useSearchParams } from "expo-router"; // Ensure you have expo-router installed

const LyricsPage = () => {
  const [lyrics, setLyrics] = useState<{ time: number; text: string }[]>([]);
  const [currentTime, setCurrentTime] = useState(0);

  // Extract query parameters
  const searchParams = useSearchParams();
  const songParam = searchParams.get("song");
  const song = songParam ? JSON.parse(songParam) : null;

  // Destructure song details
  const { spotify_id: spotifyId, song_name, artist } = song || {};

  // Fetch and parse the LRC file
  useEffect(() => {
    const loadLrcFile = async () => {
      if (!spotifyId) {
        console.error("No Spotify ID provided!");
        return;
      }

      try {
        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3001/api/v1/getSongWithId?id=${spotifyId}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch song details: ${response.statusText}`);
        }

        const lrcContent = await response.text();
        const parsedLyrics = parseLRC(lrcContent); // Parse LRC file content
        setLyrics(parsedLyrics);
      } catch (error) {
        console.error("Error loading LRC file:", error);
      }
    };

    loadLrcFile();
  }, [spotifyId]);

  // Simulate music progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => (prevTime >= 300 ? 0 : prevTime + 1)); // Loop at 300s
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Parse LRC content into an array of objects
  const parseLRC = (lrc: string) => {
    const lines = lrc.split("\n");
    return lines
      .map((line) => {
        const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.+)/);
        if (match) {
          const minutes = parseInt(match[1], 10);
          const seconds = parseInt(match[2], 10);
          const milliseconds = parseInt(match[3], 10);
          const time = minutes * 60 + seconds + milliseconds / 1000;
          const text = match[4].trim();
          return { time, text };
        }
        return null;
      })
      .filter(Boolean) as { time: number; text: string }[];
  };

  return (
    <View style={styles.container}>
      <Text style={styles.songDetails}>
        {song_name} - {artist}
      </Text>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {lyrics.map((line, index) => (
          <Text
            key={index}
            style={[
              styles.lyricText,
              currentTime >= line.time && currentTime < (lyrics[index + 1]?.time || Infinity)
                ? styles.activeLyric
                : styles.inactiveLyric,
            ]}
          >
            {line.text}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
  },
  lyricText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 10,
    width: Dimensions.get("window").width - 40,
  },
  activeLyric: {
    color: "#1DB954", // Spotify green for active lyric
    fontWeight: "bold",
  },
  inactiveLyric: {
    color: "#FFFFFF", // White for inactive lyrics
    opacity: 0.6,
 
  },
  songDetails: {
    color: "#FFFFFF",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
});