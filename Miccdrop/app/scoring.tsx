import { PitchData } from "@/types/pitchData"

export const scoring = (correct : PitchData[], sangNotes : PitchData[]) => {


	const getFrequencyDifferenceScore = (freq1 : PitchData, freq2: PitchData) => {
		const pitch1 = freq1?.pitch ?? 0 ;
		const pitch2 = freq2?.pitch ?? 0;
		const semitones = 12; // Number of semitones in an octave	
		const A4 = 440; // Reference frequency for A4
		if (pitch1 && pitch2) {
			// Calculate semitone positions relative to A4
			const notePos1 = 12 * Math.log2(pitch1 / A4);
			const notePos2 = 12 * Math.log2(pitch2 / A4);
		
			// Absolute difference in semitones (may include fractional differences)
			const semitoneDiff = Math.abs(notePos1 - notePos2);
		
			// Distance within the octave (to ensure the "wrap-around" effect)
			const wrappedDiff = Math.min(semitoneDiff % semitones, semitones - (semitoneDiff % semitones));
		
			// Scale the score to penalize larger differences exponentially
			return wrappedDiff ** 2; // Quadratic growth for large differences
		} else { 
			return 0
		}
		
	  };
	
	  // Calculate the score for each pair of frequencies
	  const scores : number[] = correct.map((freq1, i) => {
		const freq2 = sangNotes[i];
		return getFrequencyDifferenceScore(freq1, freq2);
	  });
	
	  return scores.reduce((a, b) => a + b).toFixed(2);
}