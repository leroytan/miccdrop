
import { Audio } from 'expo-av';
import { PitchData } from '../types/pitchData';
import * as Papa from "papaparse"


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

  

  

  export async function parseCSV(fileContent  :any): Promise<PitchData[]>  {
    try {
    
      // Parse CSV data
      const parsedData: PitchData[] = [];
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (result) => {
          result.data.forEach((row: any) => {
            parsedData.push({
              time: row['Time (ms)'],
              pitch: row['Pitch (Hz)'],
              clarity: row['Clarity'],
            });
          });
        },
      });

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
  