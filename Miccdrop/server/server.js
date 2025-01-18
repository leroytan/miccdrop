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

app.use(express.json());

// Example route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

//// ACCOUNT FUNCTIONS
// 1. Account Creation
app.post("/api/v1/signInDefault", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      message: "Username and password are required."
    });
  }

  try {
    // Fetch user from the database
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    console.log('Fetched user:', user);

    if (error || !user) {
      return res.status(404).json({
        status: "error",
        message: "User does not exist. Please sign up first.",
      });
    }

    // Validate the provided password
    if (!user.password) {
      return res.status(400).json({
        status: "error",
        message: "Password not found for this user.",
      });
    }
    /**
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        status: "error",
        message: "Invalid password."
      });
    }
    */
    console.log('Fetched user:', user);
    console.log("rrah")
    // Return success with user details (excluding sensitive information)
    return res.status(200).json({
      status: "success",
      data: {
        user_uuid: user.id,
        username: user.username,
        email: user.email
      }
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
        message: "Email is required",
      });
    }
  
    try {
      // Check if the user already exists
      let { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
  
      if (error) {
        if (error.code === 'PGRST116') {
          // 'PGRST116' means no rows were found
          return res.status(404).json({
            status: "error",
            message: "User does not exist. Please sign up first.",
          });
        } else {
          throw error; // Handle other Supabase-related errors
        }
      }
  
      // If user exists, return the user's details
      return res.status(200).json({
        status: "success",
        data: {
          user_uuid: user.id,
          username: user.username,
          email: user.email
        }
      });
      } catch (err) {
      console.error("Error during Google Sign-In:", err);
      return res.status(500).json({
        status: "error",
        message: "An error occurred during sign-in. Please try again.",
      });
    }
});
  