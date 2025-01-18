import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Pressable, Text } from "react-native";
import { Lrc, LrcLine, useRecoverAutoScrollImmediately } from "react-lrc";
import useTimer from "../components/useTimer";
import Control from "../components/control";
import { DieWithASmile } from "../assets/lyrics/Die With A Smile"
import { useSearchParams } from "expo-router/build/hooks";
import { hello } from "@/assets/lyrics/Hello";
import { router } from "expo-router";

function trackPlayer() {
	const [lyrics, setLyrics] = useState<string>("");
	const searchParams = useSearchParams(); // Retrieve parameters from the route
	const song = searchParams.get('song'); // Use get method to retrieve the song parameter
	const songName = song ? JSON.parse(song).name : null;
	const songId = song ? JSON.parse(song).id : null;
	console.log(songName);
	console.log(songId);

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
				const response = await fetch(`/lyrics/${songId}.lrc`);
				// Check if the response is okay
				if (!response.ok) {
					throw new Error(`Failed to fetch .lrc file: ${response.statusText}`);
				}

				// Parse the .lrc file as text
				const lrcContent = await response.text();

				// Set the lyrics state with the fetched content
				setLyrics(lrcContent);
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
			<Pressable onPress={() =>
				// Navigate to the results page with the song parameter and score! Placeholder
				router.push({
					pathname: '/results',
					params: { song: JSON.stringify(song), score: 3700 },
				})}>
				<Text style={
					{
						color: "blue",
						textAlign: "center",
						fontSize: 16,
						margin: 10,
					}
				}>Result</Text>
			</Pressable>
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

export default trackPlayer;
