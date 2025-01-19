require('dotenv').config();

const express = require("express");
const { createClient } = require('@supabase/supabase-js');
const cors = require("cors"); // Import CORS middleware
const bcrypt = require("bcrypt"); 

const app = express();
const port = 3001;

// Enable CORS for all origins
app.use(cors()); 
// Load environment variables and log them for debugging
console.log('SUPABASE_URL:', process.env.supabaseUrl);
console.log('SUPABASE_KEY:', process.env.supabaseKEY);

// Validate Supabase configuration
if (!process.env.supabaseKEY || !process.env.supabaseKEY) {
  console.error('Supabase URL or Key is missing.');
  process.exit(1); // Exit if critical environment variables are missing
}

const supabase = createClient(process.env.supabaseUrl, process.env.supabaseKEY);
const supabaseServiceRoleKey = process.env.supabaseSERVICEKEY
const supabaseServiceRole = createClient(process.env.supabaseUrl, supabaseServiceRoleKey)

app.use(express.json());

// Example route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//Sign In
app.post("/api/v1/signInDefault", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username and password are required.",
    });
  }

  try {
    let { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !user) {
      return res.status(404).json({
        status: "error",
        message: "User does not exist. Please sign up first.",
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password.",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        user_uuid: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during sign-in:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during sign-in. Please try again.",
    });
  }
});


app.post("/api/v1/signInWithGoogle", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      status: "error",
      message: "Email is required.",
    });
  }

  try {
    // Check if the user already exists
    let { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // If user doesn't exist, create a new account
        const { data: newUser, error: createError } = await supabase
          .from("users")
          .insert([{ email, username: email.split("@")[0], password: null }]) // Generate username from email
          .select()
          .single();

        if (createError) {
          throw createError;
        }

        return res.status(201).json({
          status: "success",
          data: {
            user_uuid: newUser.id,
            username: newUser.username,
            email: newUser.email,
          },
        });
      } else {
        throw error; // Handle other Supabase-related errors
      }
    }

    // If user exists, return their details
    return res.status(200).json({
      status: "success",
      data: {
        user_uuid: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error during Google Sign-In:", err);
    return res.status(500).json({
      status: "error",
      message: "An error occurred during sign-in. Please try again.",
    });
  }
});

//Account Creation
app.post("/api/v1/createAccount", async (req, res) => {
  console.log(req.body);
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
          }
        ])
        .select();

      if (error) {
          throw error;
      }

      const user = data[0];

      return res.status(200).json({
          status: "success",
          data: {
              user_uuid: user.user_uuid,
              username: user.username
          }
      });
  } catch (err) {
      console.error(err);
      return res.status(500).json({
          status: "error",
          message: err.message
      });
  }

});

//Song selection API
const linkLyricsToSongs = async () => {
  const bucketName = "lyrics"; // Replace with your bucket name

  try {
    console.log("Linking lyrics to songs...");
    const { data: files, error: listError } = await supabaseServiceRole.storage
      .from(bucketName)
      .list();
    console.log(files)
    if (listError) {
      console.error("Error listing files in bucket:", listError);
      return; // Exit the function on error
    }

    for (const file of files) {
      const fileName = file.name; 
      const spotifyId = fileName.replace(".lrc", ""); 

      const { data: publicUrlData, error: urlError } = supabaseServiceRole.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (urlError) {
        console.error(`Error generating URL for file ${fileName}:`, urlError);
        continue;
      }

      // Update the songs table with the lyrics URL
      const { error: updateError } = await supabase
        .from("songs")
        .update({ lyrics_url: publicUrlData.publicUrl })
        .eq("spotify_id", spotifyId); // Match Spotify ID in the songs table

      if (updateError) {
        console.error(
          `Error updating song with Spotify ID ${spotifyId}:`,
          updateError
        );
        continue;
      }

      console.log(`Updated song with Spotify ID ${spotifyId} successfully.`);
    }

    console.log("Lyrics successfully linked to songs.");
  } catch (err) {
    console.error("Error linking lyrics to songs:", err);
  }
};
linkLyricsToSongs();



app.get("/api/v1/getAllSongs", async (req, res) => {
  try {
    console.log("Fetching songs from database...");
    const { data, error } = await supabase
      .from("songs")
      .select("*");
    
    if (error) {
      console.error("Error fetching songs:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while fetching songs.",
      });
    }
    
    console.log("Fetched data:", data);
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    console.error("Unexpected error fetching songs:", err);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
});


app.get("/api/v1/getSongWithId", async (req, res) => {
  const { id } = req.query; // Extract 'id' from the query parameters

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Spotify ID is required.",
    });
  }

  try {
    const { data, error } = await supabase
      .from("songs")
      .select("lyrics_url") // Only fetch the `lyrics_url` field
      .eq("spotify_id", id)
      .single();

    if (error) {
      console.error("Error fetching song:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while fetching the song.",
      });
    }

    if (!data || !data.lyrics_url) {
      return res.status(404).json({
        status: "error",
        message: "Lyrics file not found for the given song.",
      });
    }

    const lrcResponse = await fetch(data.lyrics_url);
    if (!lrcResponse.ok) {
      throw new Error(`Failed to fetch LRC file: ${lrcResponse.statusText}`);
    }

    const lrcContent = await lrcResponse.text();

    return res.status(200).send(lrcContent);
  } catch (err) {
    console.error("Unexpected error fetching song:", err);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
});

app.get("/api/v1/getSong", async (req, res) => {
  const { id } = req.query; // Extract 'id' from the query parameters

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Spotify ID is required.",
    });
  }

  try {
    // Fetch the song details from the database
    const { data, error } = await supabase
      .from("songs")
      .select("song_name, artist, images") // Include 'song_name', 'lyrics_url', 'image_url', 'artist'
      .eq("spotify_id", id)
      .single();

    if (error) {
      console.error("Error fetching song:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while fetching the song.",
      });
    }

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "Song not found.",
      });
    }


    return res.status(200).json({
      status: "success",
      song_name: data.song_name,
      artist: data.artist,
      image_url: data.images
    });
  } catch (err) {
    console.error("Unexpected error fetching song:", err);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
});



//Pitch detection API

const linkInstrumentalToSong = async () => {
  const bucketName = "instrumentals"; // Replace with your bucket name

  try {
    console.log("Linking instrumentals to songs...");
    const { data: files, error: listError } = await supabaseServiceRole.storage
      .from(bucketName)
      .list();
    console.log(files)
    if (listError) {
      console.error("Error listing files in bucket:", listError);
      return; // Exit the function on error
    }

    for (const file of files) {
      const fileName = file.name; 
      const spotifyId = fileName.replace(".wav", ""); 

      const { data: publicUrlData, error: urlError } = supabaseServiceRole.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      if (urlError) {
        console.error(`Error generating URL for file ${fileName}:`, urlError);
        continue;
      }

      // Update the songs table with the lyrics URL
      const { error: updateError } = await supabase
        .from("songs")
        .update({ instrumental_url: publicUrlData.publicUrl })
        .eq("spotify_id", spotifyId); 

      if (updateError) {
        console.error(
          `Error updating song with Spotify ID ${spotifyId}:`,
          updateError
        );
        continue;
      }

      console.log(`Updated song with Spotify ID ${spotifyId} successfully.`);
    }

    console.log("Instrumentals successfully linked to songs.");
  } catch (err) {
    console.error("Error linking instrumentals to songs:", err);
  }
};
linkInstrumentalToSong();


app.post("/api/v1/getInstrumental", async (req, res) => {
  const { id } = req.query; // Extract 'id' from the query parameters
  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Spotify ID is required.",
    });
  }

  try {
    // Fetch the instrumental URL from the database
    const { data, error } = await supabase
      .from("songs")
      .select("instrumental_url")
      .eq("spotify_id", id)
      .single();

    if (error) {
      console.error("Error fetching song:", error);
      return res.status(500).json({
        status: "error",
        message: "An error occurred while fetching the song.",
      });
    }

    if (!data || !data.instrumental_url) {
      return res.status(404).json({
        status: "error",
        message: "WAV file not found for the given song.",
      });
    }

    const instrumentalUrl = data.instrumental_url;

    const axios = require("axios");
    const response = await axios.get(instrumentalUrl, { responseType: "arraybuffer" });

    res.setHeader("Content-Type", "audio/wav");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${id}.wav"`
    );

    return res.send(response.data);
  } catch (err) {
    console.error("Unexpected error fetching WAV file:", err);
    return res.status(500).json({
      status: "error",
      message: "An unexpected error occurred.",
    });
  }
});
