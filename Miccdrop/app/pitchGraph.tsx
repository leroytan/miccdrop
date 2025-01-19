import { Text, View,  Dimensions , Animated, Easing } from "react-native";
import React, {useEffect, useState, useRef} from "react"
import { LineChart } from 'react-native-chart-kit';
import { PitchData } from "../types/pitchData";
const PITCH_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


const graphHeight = 200; 
const minFreq = 100;



const PitchGraph = ({pitchData, currentPitch} : {pitchData: PitchData[], currentPitch : PitchData | null}) => {
  const data: number[] = pitchData.map(x => {
    const pitch = x?.pitch ?? minFreq + 1; // Handle null/undefined values
    return pitch > 783 ? 0 : pitch - minFreq - 1; // Set to 0 if pitch > 783, otherwise transform
  });

  let maxFreq = Math.max(...data)
  maxFreq = (maxFreq == 0) ? 400 : maxFreq
  const verticalPos = useRef(new Animated.Value(0)).current; // for pitch (vertical)
  useEffect(() => {
    // Vertical animation: based on current pitch
    Animated.timing(verticalPos, {
      toValue: mapPitchToPosition(currentPitch), // Map pitch to vertical position
      duration: 100, // adjust duration for smoothness
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

  }, [currentPitch]); // Re-run the animation when pitch or time changes

  const mapPitchToPosition = (pitch : PitchData | null) => {
    // Map the pitch to a position on the Y-axis, assuming the pitch is within a certain range
    if (pitch !== null && pitch !== undefined && (pitch.pitch ?? 0 )!= 0 ) {
      const graphPitchRange = maxFreq - minFreq;
      const normalizedPitch = (maxFreq - (pitch.pitch ?? 0)) / graphPitchRange;
      const newHeight = graphHeight * normalizedPitch;// Vertical position as a percentage of graph height
      return (newHeight > 0) ? Math.min(newHeight, graphHeight): graphHeight;
    
    } else {
      return graphHeight;
    }
  };
  
  

  // Simulate continuous data
  

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LineChart
        data={{
          datasets: [
            {
              data: data.length > 0 ? data : [0], // Handle empty data
            },
          ],
          labels : []
        }}
        width={Dimensions.get('window').width - 20}
        height={graphHeight}
        bezier
        chartConfig={{
          color: (opacity = 3) => `rgba(200, 255, 255, ${opacity})`
        }}
      />
      <Animated.View
                  style={{
                    position: 'absolute',
                    top: verticalPos, // Moves up/down with the pitch
                    left : 30,
                    width: 5, // Adjust size
                    height: 5, // Adjust size
                    backgroundColor: 'pink', // Indicator color
                  }}
                />
    </View>
      
  );
};

export default PitchGraph;