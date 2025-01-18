import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import useTimer from "../components/useTimer";
import Control from "../components/control";
import { DieWithASmile } from "../assets/lyrics/Die With A Smile"
import { useSearchParams } from "expo-router/build/hooks";
import { goodLuckBabe } from "@/assets/lyrics/01. Good Luck, Babe!";

function App() {
	const [lyrics, setLyrics] = useState<string>("");
	const searchParams = useSearchParams(); // Retrieve parameters from the route
	const song = searchParams.get('song'); // Use get method to retrieve the song parameter
	const songName = song ? JSON.parse(song).name : null;
	const songId = song ? JSON.parse(song).id : null;

	const {
		currentMillisecond,
		setCurrentMillisecond,
		reset,
		play,
		pause,
	} = useTimer(4);

	const { signal, recoverAutoScrollImmediately } = useRecoverAutoScrollImmediately();

	useEffect(() => {
		const loadLrcFile = async () => {
			try {
				setLyrics(goodLuckBabe);

			} catch (error) {
				console.error("Error loading LRC file:", error);
			}
		};

		loadLrcFile();
	}, []);

	const lineRenderer = useCallback(
		({ active, line: { content } }: { active: boolean; line: LrcLine }) => (
			<Line active={active}>{content}</Line>
		),
		[]
	);

	return (
		<Root style={{ backgroundColor: "white" }}>
			<Control
				onPlay={play}
				onPause={pause}
				onReset={reset}
				current={currentMillisecond}
				setCurrent={setCurrentMillisecond}
				recoverAutoScrollImmediately={recoverAutoScrollImmediately}
			/>
			<Lrc
				lrc={lyrics}
				lineRenderer={lineRenderer}
				currentMillisecond={currentMillisecond}
				verticalSpace
				style={lrcStyle}
				recoverAutoScrollSingal={signal}
				recoverAutoScrollInterval={5000}
			/>
		</Root>
	);
}

const Root = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;
`;
const lrcStyle: CSSProperties = {
	flex: 1,
	minHeight: 0,
	fontSize: "16px",
	fontFamily: "monospace",
};
const Line = styled.div<{ active: boolean }>`
  min-height: 10px;
  padding: 5px 20px;

  font-size: 16px;
  text-align: center;
  color: white;

  ${({ active }) => css`
    color: ${active ? "green" : "black"};
  `}
`;

export default App;
