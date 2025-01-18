import { Text, View,  Animated, Easing } from "react-native";
import React, {useEffect, useState} from "react"
import { LineChart, Grid, YAxis } from 'react-native-svg-charts';
import { PitchData } from "../types/pitchData";
const PITCH_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];


const getNoteName = (frequency: number): string => {
    if (frequency < 20 || frequency > 2000) {
      return ''; // Frequency outside of typical pitch range
    }
    const noteIndex = Math.round(12 * Math.log2(frequency / 440.0)) % 12;
    return PITCH_NOTES[noteIndex];
  };


const graphHeight = 200; 
const graphWidth = 800; 
const minFreq = 260;
const maxFreq = 500; 


const PitchGraph = ({pitchData, currentPitch} : {pitchData: PitchData[], currentPitch : PitchData | null}) => {

  const [verticalPos, setVerticalPos] = useState(new Animated.Value(0)); // for pitch (vertical)
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
      const newHeight = graphHeight * normalizedPitch - 20;// Vertical position as a percentage of graph height
      return (newHeight > 0) ? Math.min(newHeight, graphHeight): graphHeight;
    
    } else {
      return graphHeight;
    }
  };
  const data = pitchData.map(x => x.pitch)

  const verticalContentInset = { top: 10, bottom: 10 }
  const axesSvg = { fontSize: 10, fill: 'grey' };
  return (
    <View >
       <View style={{ height: graphHeight, width : graphWidth, flexDirection: 'row' }}>
                <YAxis
                    data={data}
                    min={minFreq}
                    max={maxFreq}
                    contentInset={verticalContentInset}
                    svg={axesSvg}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                        style={{ flex: 1 }}
                        data={data}
                        gridMin={minFreq}
                        gridMax={maxFreq}
                        contentInset={verticalContentInset}
                        svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                        <Grid/>
                    </LineChart>
                    <Animated.View
                  style={{
                    position: 'absolute',
                    top: verticalPos, // Moves up/down with the pitch
                    left : graphWidth-15,
                    width: 5, // Adjust size
                    height: 5, // Adjust size
                    backgroundColor: 'red', // Indicator color
                  }}
                />
                </View>

                
            </View>

    </View>
  );
};

export default PitchGraph;