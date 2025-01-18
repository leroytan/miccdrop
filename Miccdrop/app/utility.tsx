import React, { SetStateAction} from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { PitchData } from '../types/pitchData';
import * as fs from "fs"
import * as Papa from 'papaparse';
import { Platform } from 'react-native';


export const askPermission = async () => {
    const permission = await Audio.requestPermissionsAsync();
  
    if (permission.status === "granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        
      });}
  }
  
  export const setUpSound = async (songID : string) => { 
    // const response = await fetch(`/assets/audios/${songID}.wav`);
    // if (!response.ok) {
    //   throw new Error('Failed to load audio file');
    // }

    // // Convert the Blob into a URI using URL.createObjectURL
    // const audioBlob = await response.blob();
    // const audioURL = URL.createObjectURL(audioBlob); // Create a URL from the Blob

    // // Load the sound using the URI created from the Blob
    // const { sound } = await Audio.Sound.createAsync(
    //   { uri: audioURL } // Pass the URI to Audio.Sound.createAsync
    // );
    // return sound 
    const { sound } = await Audio.Sound.createAsync( require("../assets/audios/1GEBsLDvJGw7kviySRI6GX.wav") 
    ); 
  return sound 
  }

  

  

  export async function parseCSV(songID: string): Promise<PitchData[]>  {
    try {
    //   // Read the file as text using expo-file-system
    //   let fileContent = "";
    //   const filePath = `${FileSystem.documentDirectory}/assets/data/1GEBsLDvJGw7kviySRI6GX.csv`
    //   // const filePath = `/assets/pitches/${songID}.csv`;
    //   if (Platform.OS === 'web') {
    //     // Web: Use FileReader to read the file
    //     const response = await fetch(filePath);
    //     if (!response.ok) {
    //       throw new Error(`Failed to fetch file: ${response.statusText}`);
    //     }
    //     fileContent = await response.text();
    //   } else {
    //     // Mobile: Use expo-file-system to read the file
        
    // // Read the file as text
    //     fileContent = await FileSystem.readAsStringAsync(filePath);
    //   }
  
      // // Parse CSV data
      // const parsedData: PitchData[] = [];
      // Papa.parse(fileContent, {
      //   header: true,
      //   skipEmptyLines: true,
      //   dynamicTyping: true,
      //   complete: (result) => {
      //     result.data.forEach((row: any) => {
      //       parsedData.push({
      //         time: row['Time (ms)'],
      //         pitch: row['Pitch (Hz)'],
      //         clarity: row['Clarity'],
      //       });
      //     });
      //   },
      // });
      //dummy
      const parsedData: PitchData[] = [];
      let currentPitch = Math.floor(Math.random() * (500 - 260 + 1)) + 260;

      for (let i = 0; i < 300; i++) {
        // Change pitch every 10 elements (representing 0.1 seconds)
        if (i % 10 === 0) {
          currentPitch = Math.floor(Math.random() * (500 - 260 + 1)) + 260;
        }
        parsedData.push({ pitch: currentPitch, clarity: 100 });
      }

      return parsedData;
    } catch (error) {
      console.error('Error reading or parsing CSV file:', error);
      return [];
    }
  };
  
  export function getDurationFormatted(millis : number) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  