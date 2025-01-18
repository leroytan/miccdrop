export interface PitchData {
    time? : number | null;
    pitch: number | null; // Pitch in Hz or null if not detected
    clarity: number | null; // Clarity between 0 and 1 or null
}