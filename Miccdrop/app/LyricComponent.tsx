import React, { useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Lyric } from 'react-native-lyric';

const LyricComponent = ({ lrc, currentTime } :any) => {
  const lineRenderer = useCallback(
    ({ lrcLine: { millisecond, content }, index, active } : any) => (
      <Text
        style={[styles.line, active && styles.activeLine]}>
        {content}
      </Text>
    ),
    [],
  );

  return (
    <Lyric
      style={{ height: 500 }}
      lrc={lrc}
      currentTime={currentTime}
      lineHeight={70}
      activeLineHeight={90}
      autoScroll={true}
      lineRenderer={lineRenderer}
      autoScrollAfterUserScroll={4000}
    />
  );
};

const styles = StyleSheet.create({
  line: {
		fontSize: 20,
		textAlign: "center",
		color: "#344e76",
		paddingVertical: 5,
	},
	activeLine: {
		color: "#f06292",
		fontWeight: "bold",
	},
});

export default LyricComponent;
