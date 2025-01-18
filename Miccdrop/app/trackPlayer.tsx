import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import useTimer from "../components/useTimer";
import Control from "../components/control";
import { useSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
import AudioPlayer from "./AudioPlayer";


function TrackPlayer() {
  const [lyrics, setLyrics] = useState<string>("");
  

  const {
    currentMillisecond,
    setCurrentMillisecond,
    reset,
    play,
    pause,
  } = useTimer(10);


  const searchParams = useSearchParams();
  const spotifyId = searchParams.get("spotify_id"); // Retrieve spotify_id parameter
  
  useEffect(() => {
    const loadLrcFile = async () => {
      if (!spotifyId) {
        console.error("No Spotify ID provided!");
        return;
      }
  
      try {
        // Fetch song details from the backend
        const response = await fetch(
          `http://${process.env.EXPO_PUBLIC_LOCALHOST}:3001/api/v1/getSongWithId?id=${spotifyId}`
        );
  
        if (!response.ok) {
          throw new Error(`Failed to fetch song details: ${response.statusText}`);
        }

        const lrcContent = await response.text(); // Retrieve plain text content
        console.log(lrcContent)
        setLyrics(lrcContent); // Set the lyrics state with the content
        } catch (error) {
        console.error("Error loading LRC file:", error);
      }
    };
  
    loadLrcFile();
  }, [spotifyId]);


  const lineRenderer = ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
    <Text style={[styles.line, active && styles.activeLine]}>{content}</Text>

  );


  return (
    <View style={styles.root}>
		{spotifyId !== null && <AudioPlayer songID = {spotifyId}/>}
      <Control
        onPlay={play}
        onPause={pause}
        onReset={reset}
        current={currentMillisecond}
        setCurrent={setCurrentMillisecond}
      />
      <ScrollView style={styles.lrcContainer}>
        <Lrc
          lrc={lyrics}
          lineRenderer={lineRenderer}
          currentMillisecond={currentMillisecond}
          verticalSpace
          recoverAutoScrollInterval={5000}
        />
      </ScrollView>
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/results",
            params: { songId: JSON.stringify(spotifyId), score: 3700 },
          })
        }
      >
        <Text style={styles.resultButton}>Result</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  lrcContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  line: {
    fontSize: 16,
    textAlign: "center",
    color: "black",
    paddingVertical: 5,
  },
  activeLine: {
    color: "green",
  },
  resultButton: {
    color: "blue",
    textAlign: "center",
    fontSize: 16,
    margin: 10,
  },
});

export default TrackPlayer;
