import { ActivityIndicator, Text, StyleSheet, View } from "react-native";
import React, { SetStateAction, useEffect, useState, Dispatch, useCallback, useRef } from 'react';
import { Audio } from 'expo-av';
import { useAudioRecorder } from '@siteed/expo-audio-stream';
import { AudioRecording } from "@siteed/expo-audio-stream";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { askPermission, getDurationFormatted, parseCSV, setUpSound } from "./utility";
import { PitchData } from "../types/pitchData";
import { AudioDataEvent } from "@siteed/expo-audio-stream"
import { PitchDetector } from "pitchy"
import { RecordingConfig } from "@siteed/expo-audio-stream";
import PitchGraph from "./pitchGraph";
import { Slider } from "@rneui/themed";
import { parse } from "papaparse";



export const SAMPLE_RATE = 16000
const AUDIO_CHUNK_LENGTH = SAMPLE_RATE * 0.01
const MAX_POINTS = 300
const detector = PitchDetector.forFloat32Array(AUDIO_CHUNK_LENGTH); // 10 milliseconds
detector.minVolumeDecibels = -20;
export default function AudioPlayer({ songID, setCurrentPitches, instrumental, setInstrumental }
  : { songID: string, setCurrentPitches: Dispatch<SetStateAction<PitchData[]>>, 
    instrumental : any , setInstrumental: Dispatch<SetStateAction<any>>
  }) {

  const [recording, setRecording] = useState<AudioRecording | null>();
  const [currentPitch, setCurrentPitch] = useState<PitchData | null>(null); // Store detected pitch
  const [acapellaChunk, setAcapellaChunk] = useState<PitchData[]>([]);
  let correctPitchData: PitchData[] = [];
  const [instrumentalLoaded, setInstrumentalLoaded] = useState(false);
  let currentAudioChunkIndex = 0;
  const [volume, setVolume] = useState(0.5); // Default volume (1.0 is max)

  useEffect(() => {
    askPermission();
    async function initializeSound() {
      try {
        const soundObject = await setUpSound(songID);
        setInstrumental(soundObject); // Update the state after setup is complete
        setInstrumentalLoaded(true);
      } catch (error) {
        console.error("Error setting up sound:", error);
      }
    }
    initializeSound()
    const loadCSV = async () => {
      try {
        // Fetch song details from the backend
        const response = await fetch(
          `http://localhost:3001/api/v1/getPitch?id=${songID}`,
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
    handleStart()

  }, []);

  useEffect(() => {
    if (instrumentalLoaded) {
      // Perform the function when isLoaded turns true
      handleStart()
    }
  }, [instrumentalLoaded]);

  useEffect(() => {
    return instrumental
      ? () => {

        handleStop();
      }
      : undefined;
  }, [instrumental]);

  const {
    startRecording, stopRecording, pauseRecording, resumeRecording, isPaused, durationMs: duration,
    size, compression, isRecording, analysisData } = useAudioRecorder()

  const onAudioData = useCallback(async (event: AudioDataEvent) => {
    try {
      let { data, position, eventDataSize } = event;
      currentAudioChunkIndex = currentAudioChunkIndex + 1;
      if (eventDataSize === 0) {
        console.warn(`Invalid data size=${eventDataSize}`);
        return;
      }
      if (data instanceof Int16Array) {
        data = Float32Array.from(data, sample => sample / 32768)
      }

      if (data instanceof Float32Array) {
        // reshape data
        let reshapedData = new Float32Array(AUDIO_CHUNK_LENGTH);

        if (data.length > AUDIO_CHUNK_LENGTH) {
          // Copy the most recent data if buffer exceeds max length
          const startOffset = data.length - AUDIO_CHUNK_LENGTH;
          reshapedData = data.slice(startOffset);
        } else {
          // Concatenate buffer if under max length
          reshapedData.set(data)
        }
        const [pitch, clarity] = detector.findPitch(reshapedData, SAMPLE_RATE);
        if (clarity > 0.9 && pitch > 65 && pitch < 1047) { // between c2 and c6
          setCurrentPitch({ "pitch": pitch, "clarity": clarity });
          setCurrentPitches((prevPitches) => {
            return [...prevPitches, { "pitch": pitch, "clarity": clarity }];
          });
        } else {
          setCurrentPitch({ "pitch": 0, "clarity": 0 });
          setCurrentPitches((prevPitches) => {
            return [...prevPitches, { "pitch": 0, "clarity": 0 }];
          });
        }

        const parsedData = correctPitchData.slice(currentAudioChunkIndex, MAX_POINTS + currentAudioChunkIndex + 1)
        setAcapellaChunk(parsedData)

      } else if (typeof data === 'string') {
        // Handle Base64 audio data if needed
        console.warn(`Unexpected Base64 data received.`);
      }
    } catch (error) {
      console.error(`Error while processing audio data`, error);
    }
  }, []);

  const config: RecordingConfig = {
    sampleRate: 16000,
    channels: 1,
    encoding: 'pcm_16bit',
    interval: 10,
    enableProcessing: true,
    pointsPerSecond: 1000,
    algorithm: 'rms',
    features: { energy: true, rms: true },
    onAudioStream: (a) => onAudioData(a),
    onAudioAnalysis: async (data) => {
      console.log('Processing:', data);
    }
  }

  const handleStart = async () => {
    if (instrumentalLoaded) {
      const { granted } = await Audio.requestPermissionsAsync();
      if (granted) {
        const result = await startRecording(config);
        console.log('Recording started with config:', result);
        // Only start the instrumental sound if it's not already playing
        if (instrumental && !isRecording) {
          await instrumental.playAsync();
        }
      }
    }

  };
  const handleStop = async () => {
    const result: AudioRecording | null = await stopRecording();
    setRecording(result);
    await instrumental.stopAsync();
    await instrumental.unloadAsync();
    setInstrumentalLoaded(false);
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (instrumental) {
      await instrumental.setVolumeAsync(value);
    }
  };

  const newPitch = [{ "pitch": 300, "clarity": 100 }, { "pitch": 300, "clarity": 100 }, { "pitch": 400, "clarity": 100 }, { "pitch": 300, "clarity": 100 }]
  return (
    <View >
      <View >
        <Text style={{ color: 'black', textAlign: 'center' }}>Voice Memo</Text>
      </View>
      <View>
        {!instrumentalLoaded && (<ActivityIndicator size="large" color="#0000ff" />)}

      </View>
      <Text>
        frequency : {currentPitch && currentPitch["pitch"]} Hz
        <br />
        confidence : {currentPitch && currentPitch["clarity"]}
      </Text>
      <View>
        <PitchGraph pitchData={acapellaChunk} currentPitch={currentPitch} />

      </View>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#1EB1FC"
      />


    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  slider: {
    width: 300,
    height: 20,
  },
  label: {
    fontSize: 10,
    marginBottom: 10,
  },
});