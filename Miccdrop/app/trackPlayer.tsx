import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import useTimer from "../components/useTimer";
import Control from "../components/control";
import { useSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";

function TrackPlayer() {
  const [lyrics, setLyrics] = useState<string>("");
  const searchParams = useSearchParams(); // Retrieve parameters from the route
  const song = searchParams.get("song"); // Use get method to retrieve the song parameter
  const songName = song ? JSON.parse(song).name : null;
  const songId = song ? JSON.parse(song).id : null;
  console.log(songName);

  const {
    currentMillisecond,
    setCurrentMillisecond,
    reset,
    play,
    pause,
  } = useTimer(10);

  useEffect(() => {
    const loadLrcFile = async () => {
      try {
        const response = await fetch(`/lyrics/${songId}.lrc`);
        // Check if the response is okay
        if (!response.ok) {
          throw new Error(`Failed to fetch .lrc file: ${response.statusText}`);
        }

        // Parse the .lrc file as text
        const lrcContent = await response.text();

        // Set the lyrics state with the fetched content
        setLyrics(lrcContent);
      } catch (error) {
        console.error("Error loading LRC file:", error);
      }
    };

    loadLrcFile();
  }, [songId]);


  const lineRenderer = ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
    <Text style={[styles.line, active && styles.activeLine]}>{content}</Text>
  );

  return (
    <View style={styles.root}>
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
          // Navigate to the results page with the song parameter and score
          router.push({
            pathname: "/results",
            params: { song: JSON.stringify(song), score: 3700 },
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
