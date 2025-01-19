import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import { LinearGradient } from "expo-linear-gradient";
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
<<<<<<< HEAD
  const [lyrics, setLyrics] = useState<string>("");
  const searchParams = useSearchParams(); // Extract the query parameters
  const songParam = searchParams.get("song"); // Get the song parameter
  const song = songParam ? JSON.parse(songParam) : null; // Parse the JSON string
  const [currentPitches, setCurrentPitches] = useState<PitchData[]>([]); // Store detected pitch
  const [correctPitchData, setCorrectPitchData] = useState<PitchData[]>([])
const [instrumental, setInstrumental] = useState<any>();
  const { spotify_id: spotifyId, song_name, artist } = song; // Destructure the song object
=======
	const [lyrics, setLyrics] = useState<string>("");
	const searchParams = useSearchParams(); // Extract the query parameters
	const songParam = searchParams.get("song"); // Get the song parameter
	const song = songParam ? JSON.parse(songParam) : null; // Parse the JSON string
	const [currentPitches, setCurrentPitches] = useState<PitchData[]>([]); // Store detected pitch
	let correctPitchData: PitchData[] = [];

	const { spotify_id: spotifyId, song_name, artist } = song; // Destructure the song object
>>>>>>> 834c4211d2e9c0ce8fa3503ca53f6a00501def4f


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

<<<<<<< HEAD
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
=======
			try {
				// Fetch song details from the backend
				const response = await fetch(
					`http://${process.env.EXPO_PUBLIC_LOCALHOST}:3001/api/v1/getSongWithId?id=${spotifyId}`
				);
>>>>>>> 834c4211d2e9c0ce8fa3503ca53f6a00501def4f

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


<<<<<<< HEAD
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
=======
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
						},
					}
				);

				if (!response.ok) {
					throw new Error(`Failed to fetch song pitch: ${response.statusText}`);
				}

				const pitchContent = await response.text(); // Retrieve plain text content
				const parsed = await parseCSV(pitchContent)
				correctPitchData = parsed;

			} catch (error) {
				console.error("Error loading pitch file:", error);
			}
		};

		loadCSV();

	}, []);

	const lineRenderer = ({ active, line: { content } }: { active: boolean; line: LrcLine }) => (

		<Text style={[styles.line, active && styles.activeLine]}>{content}</Text>

	);


	return (
		<LinearGradient
			colors={["#fbc2eb", "#a6c1ee"]}
			style={styles.root}
		>
			<Text style={styles.headerText}>{song_name}</Text>
			<Text style={styles.subHeaderText}>by {artist}</Text>
			{spotifyId !== null && <AudioPlayer songID={spotifyId} setCurrentPitches={setCurrentPitches} />}
			<Control
				onPlay={play}
				onPause={pause}
				onReset={reset}
				current={currentMillisecond}
				setCurrent={setCurrentMillisecond}
			/>
			<View style={styles.lrcContainer}>
				<LyricComponent lrc={lyrics} currentTime={currentMillisecond} />
			</View>
			<Pressable
				style={styles.resultButtonContainer}
				onPress={() =>

					router.push({
						pathname: "/results",
						params: { songId: JSON.stringify(spotifyId), score: scoring(correctPitchData, currentPitches) },
					})
				}
			>
				<LinearGradient colors={['#f04be5', '#FFB6B6']} start={[0, 0]}
					end={[1, 2]} style={styles.button}>
						<Text style={styles.resultButtonText}>View Results</Text>
				</LinearGradient>

			</Pressable>
		</LinearGradient>
	);
>>>>>>> 834c4211d2e9c0ce8fa3503ca53f6a00501def4f
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: '#ff6f61',
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
	},
	root: {
		flex: 1,
		padding: 20,
	},
	headerText: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#344e76",
		textAlign: "center",
		marginBottom: 5,
	},
	subHeaderText: {
		fontSize: 20,
		color: "#576c89",
		textAlign: "center",
		marginBottom: 20,
	},
	lrcContainer: {
		flex: 1,
		backgroundColor: "rgba(255, 255, 255, 0.8)",
		borderRadius: 15,
		padding: 20,
		marginBottom: 20,
	},
	line: {
		fontSize: 18,
		textAlign: "center",
		color: "#344e76",
		paddingVertical: 5,
	},
	activeLine: {
		color: "#f06292",
		fontWeight: "bold",
	},
	resultButtonContainer: {
		alignItems: "center",
	},
	resultButtonText: {
		fontSize: 18,
		color: "#ffffff",
		fontWeight: "bold",
	},
});

export default TrackPlayer;