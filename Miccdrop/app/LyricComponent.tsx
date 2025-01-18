import React, { useCallback } from 'react';
import { Text } from 'react-native';
import { Lyric } from 'react-native-lyric';

const LyricComponent = ({ lrc, currentTime } :any) => {
  const lineRenderer = useCallback(
    ({ lrcLine: { millisecond, content }, index, active } : any) => (
      <Text
        style={{ textAlign: 'center', color: active ? 'white' : 'gray' }}>
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
      lineHeight={16}
      lineRenderer={lineRenderer}
    />
  );
};

export default LyricComponent;
