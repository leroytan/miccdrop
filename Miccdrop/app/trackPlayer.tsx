import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, ScrollView } from "react-native";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import useTimer from "../components/useTimer";
import Control from "../components/control";
import { useSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
import AudioPlayer from "./AudioPlayer";
import LyricComponent from "./LyricComponent";
import { PitchData } from "@/types/pitchData";
import { parseCSV } from "./utility";
import { scoring } from "./scoring";


function TrackPlayer() {
  const [lyrics, setLyrics] = useState<string>("");
  const searchParams = useSearchParams(); // Extract the query parameters
  const songParam = searchParams.get("song"); // Get the song parameter
  const song = songParam ? JSON.parse(songParam) : null; // Parse the JSON string
  const [currentPitches, setCurrentPitches] = useState<PitchData[]>([]); // Store detected pitch
  const [correctPitchData, setCorrectPitchData] = useState<PitchData[]>([])
const [instrumental, setInstrumental] = useState<any>();
  const { spotify_id: spotifyId, song_name, artist } = song; // Destructure the song object


  const {
    currentMillisecond,
    setCurrentMillisecond,
    reset,
    play,
    pause,
  } = useTimer(1.02);

  
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


  useEffect(() => {

          const loadCSV = async () => {
            try {
              // Fetch song details from the backend
              const response = await fetch(
                `http://localhost:3001/api/v1/getPitch?id=${spotifyId}`,
                {
                  method: 'POST', // Specify the method
                  headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer sth sth`,
                  },
                }
              );
        
              if (!response.ok) {
                throw new Error(`Failed to fetch song pitch: ${response.statusText}`);
              }
      
              const pitchContent = await response.text(); // Retrieve plain text content
              const parsed = await parseCSV(pitchContent)
              setCorrectPitchData(parsed)
              
              } catch (error) {
              console.error("Error loading pitch file:", error);
            }
          };
  
          loadCSV();
          
      }, [spotifyId]); 

  const lineRenderer = ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (

    <Text style={[styles.line, active && styles.activeLine]}>{content}</Text>

  );


  return (
    <View style={styles.root}>
		{spotifyId !== null && <AudioPlayer 
    songID = {spotifyId} 
    setCurrentPitches = { setCurrentPitches} 
    instrumental = {instrumental}
    setInstrumental = {setInstrumental}/>}
      <Control
        onPlay={play}
        onPause={pause}
        onReset={reset}
        current={currentMillisecond}
        setCurrent={setCurrentMillisecond}
      />
      <ScrollView style={styles.lrcContainer}>
        <LyricComponent lrc={lyrics} currentTime={currentMillisecond}/>
      </ScrollView>
      <Pressable
        onPress={() => {
            //stop instrumental
            instrumental.stopAsync();
		        instrumental.unloadAsync();

          router.push({
            pathname: "/results",
            params: { songId: JSON.stringify(spotifyId), score: scoring(correctPitchData, currentPitches) },
          })
        }}
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