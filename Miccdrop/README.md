# MiccDrop

**Sing loud, sing proud, sing off-key — and then make it better.**

MiccDrop is a cross-platform vocal practice app that turns any room into a karaoke booth. The Expo-powered mobile client pairs real-time pitch tracking with synced lyrics, while an Express/Supabase backend streams instrumentals, lyrics, and pitch guides pulled straight from the cloud. The result is a latency-friendly practice loop that lets singers pick a track, perform alongside the instrumental, visualize pitch accuracy, and review a score the moment the song ends.

---

## Core Features
- 🎤 **Dual-auth onboarding** – create an account with username/password or use Google Sign-In via `@react-native-google-signin/google-signin`.
- 🎧 **Song discovery** – browse Supabase-backed catalogs (Top Picks, Trending, Recents) and use live search via `@rneui/themed` to jump into any track.
- 🪄 **Live lyric + pitch coach** – track player fetches karaoke `.lrc` files, renders them with `react-native-lyric`, and overlays real-time pitch graphs driven by `@siteed/expo-audio-stream` + `pitchy`.
- 🧠 **Smart scoring** – compares recorded notes against reference CSV pitch curves, penalizing semitone drift and surfacing a normalized score for every performance.
- 📊 **Performance recap** – post-song summary shows album art, metadata, and the computed score, with a quick path back to explore the catalog again.

---

## Experience Flow
1. **Sign in / create account** – hits `/api/v1/signInDefault`, `/signInWithGoogle`, or `/createAccount` on the server, which wraps Supabase Auth + bcrypt.
2. **Pick a song** – `/api/v1/getAllSongs` returns metadata (name, artist, Spotify art) used by `app/songSelector.tsx`.
3. **Perform** – `trackPlayer.tsx` fetches lyrics (`/api/v1/getSongWithId`), instrumental WAVs (`/api/v1/getInstrumental`), and pitch guides (`/api/v1/getPitch`). Live audio chunks are streamed, pitch-checked, and graphed.
4. **Score + review** – `scoring.tsx` compares the performance to the reference dataset and `results.tsx` fetches display info via `/api/v1/getSong`.

---

## Architecture

### Mobile app (Expo Router + React Native)
- Organized under `app/` with file-based routes for auth, tabbed navigation, and full-screen experiences (song selector, player, results).
- Uses `expo-av` for playback, `@siteed/expo-audio-stream` for microphone capture, `pitchy` for detection, and `react-native-chart-kit` for the live pitch graph.
- Shared UI helpers (gradient buttons, themed text) live in `components/`, while hooks handle theming and timers.

### Backend service (Express + Supabase)
- `server/server.js` exposes REST endpoints for auth, catalog access, and media delivery.
- Supabase Database stores `users` (credentials) and `songs` (metadata + URLs). Bcrypt handles password hashing.
- Supabase Storage buckets (`lyrics`, `instrumentals`, `pitches`) hold karaoke assets. Bootstrapping helpers (`linkLyricsToSongs`, etc.) map bucket files to DB rows.

### Data assets
- `spotifyData.json` contains sample Spotify metadata used when seeding the catalog.
- Lyrics, instrumental WAVs, and pitch CSVs are accessed on-demand through signed URLs rather than bundling large files into the client.

---

## Tech Stack

| Layer | Tools |
| --- | --- |
| UI / Navigation | Expo Router, React Native 0.76, Expo SDK 52, `@expo/vector-icons`, `@rneui/themed` |
| Audio / Analysis | `expo-av`, `@siteed/expo-audio-stream`, `pitchy`, `react-native-lyric`, `react-native-chart-kit` |
| Auth & Data | Express 4, Supabase JS client, bcrypt, Google Sign-In |
| Tooling | TypeScript, Jest + `jest-expo`, Expo CLI, Nodemon |

---

## Getting Started

### Prerequisites
- Node.js ≥ 18 and npm (or Yarn 1.22)
- Xcode + iOS Simulator (macOS) and/or Android Studio/Emulator
- Expo CLI (`npx expo start` works without a global install)
- Supabase project with the following resources:
  - `users` table (`id`, `username`, `email`, `password`)
  - `songs` table (`spotify_id`, `song_name`, `artist`, `images`, `lyrics_url`, `instrumental_url`, `pitch_url`)
  - Storage buckets: `lyrics`, `instrumentals`, `pitches`

### Install dependencies
```bash
cd Miccdrop
npm install
```

### Environment variables
Create a `.env` at the project root (loaded by both Expo and the Node server):

| Name | Used by | Description |
| --- | --- | --- |
| `EXPO_PUBLIC_LOCALHOST` | Expo client | Hostname/IP for the Express server (use your LAN IP, e.g. `192.168.0.42`) |
| `EXPO_PUBLIC_IOS_CLIENT_ID` | Expo client | iOS OAuth client ID for Google Sign-In |
| `supabaseUrl` | Server | Supabase project URL |
| `supabaseKEY` | Server | Supabase anon/public key (for user-facing queries) |
| `supabaseSERVICEKEY` | Server | Supabase service role key (needed to map storage objects) |

> When running on a physical device, `EXPO_PUBLIC_LOCALHOST` must be reachable over the network (no `localhost`).

### Run the backend
```bash
cd Miccdrop
npx nodemon server/server.js   # or: node server/server.js
```
The server listens on port `3001` by default. Ensure your Supabase keys are loaded before starting.

### Run the mobile app
```bash
# from Miccdrop/
npx expo start        # launches the Metro bundler + QR code
npm run android       # build & install on Android emulator/device
npm run ios           # run on iOS simulator
npm run web           # experimental web build
```

### Tests & linting
```bash
npm test              # runs Jest via jest-expo
npm run lint          # Expo lint
```

---

## API Reference

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/v1/signInDefault` | POST | Username/password login (bcrypt-verified) |
| `/api/v1/signInWithGoogle` | POST | Google Sign-In fallback/creation |
| `/api/v1/createAccount` | POST | Registers a new user |
| `/api/v1/getAllSongs` | GET | Returns catalog metadata for the selector |
| `/api/v1/getSongWithId?id=` | GET | Streams the `.lrc` lyric file for a song |
| `/api/v1/getSong` | POST | Returns song name, artist, and artwork |
| `/api/v1/getInstrumental?id=` | POST | Streams the instrumental WAV |
| `/api/v1/getPitch?id=` | POST | Streams the reference pitch CSV |

All routes expect the Supabase URL/key env vars to be set and will respond with JSON (or the raw asset) plus standard HTTP status codes.

---

## Project Structure

```
Miccdrop/
├── app/                 # Expo Router routes (auth, tabs, track player, results)
├── assets/              # Logos, gradients, background art, audio placeholders
├── components/          # Shared UI + hooks (timer, controls, themed text)
├── constants/           # Color palette definitions
├── hooks/               # Color scheme + theme helpers
├── server/server.js     # Express API + Supabase integration
├── types/               # Shared TypeScript interfaces (e.g., PitchData)
├── spotifyData.json     # Sample Spotify metadata
└── scripts/             # Utility scripts (reset-project)
```

---

## Pitch & Scoring Details
- Microphone audio is sampled at 16 kHz, chunked every 10 ms, and normalized to `Float32Array` buffers.
- `pitchy` computes frequency + clarity; valid ranges (C2–C6) update the live pitch graph via `react-native-chart-kit`.
- Reference CSVs (time, pitch, clarity) come from Supabase storage and feed the `PitchGraph` overlay plus the scoring function.
- `app/scoring.tsx` converts both reference and recorded pitches into semitone offsets relative to A4 (440 Hz) and sums the squared difference, yielding a lower-is-better aggregate that is formatted for the results view.

---

## Useful Commands
| Command | Description |
| --- | --- |
| `npm run start` | Expo dev server (`npx expo start`) |
| `npm run android / ios / web` | Platform-specific Expo launches |
| `npm run reset-project` | Resets the Expo scaffold back to a blank `app/` |
| `npm test` | Jest test runner |
| `npm run lint` | Expo lint |

---

## Next Steps
- Wire up Supabase Auth tokens instead of manual fetch calls once security hardening is needed.
- Persist performance history per user (the profile page is currently mocked).
- Expand the scoring page to surface the pitch graph and lyric timeline for deeper feedback.

Happy singing! 🎶
