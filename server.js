// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Add headers to handle CORS issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'ADD YOUR WEBSITE URL WHERE THE BOT WILL BE EMBEDDED HERE');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
  const { message, url, metadata } = req.body;
  const userID = req.body.userID; // Using a static userID for testing

  try {
    // Step 1: Check if the session state exists
    const stateResponse = await axios.get(`https://general-runtime.voiceflow.com/state/${process.env.VOICEFLOW_VERSION_ID}/user/${userID}`, {
      headers: {
        'Authorization': `Bearer ${process.env.VOICEFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const stateData = stateResponse.data;
    console.log('State data for user:', userID, stateData); // Log state data

    if (!stateData || Object.keys(stateData).length === 0) {
      // Step 2: If no existing state, send a launch action to initiate the session
      try {
        const launchResponse = await axios.post(`https://general-runtime.voiceflow.com/state/${process.env.VOICEFLOW_VERSION_ID}/user/${userID}/interact`, {
          request: {
            type: 'launch'
          },
          config: {},
        }, {
          headers: {
            'Authorization': `Bearer ${process.env.VOICEFLOW_API_KEY}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('Session launched for user:', userID);
        console.log('Launch response:', launchResponse.data);
      } catch (launchError) {
        console.error('Error launching session for user:', userID, {
          message: launchError.message,
          status: launchError.response ? launchError.response.status : 'No response status',
          data: launchError.response ? launchError.response.data : 'No response data'
        });
      }
    }

    // Step 3: Send the actual metadata payload
    const payload = message || `url: ${metadata?.url}, language: ${metadata?.language}`;

    // Log the payload being sent to Voiceflow
    console.log('Payload sent to Voiceflow:', {
      request: {
        type: 'text',
        payload: payload
      }
    });

    const response = await axios.post(`https://general-runtime.voiceflow.com/state/${process.env.VOICEFLOW_VERSION_ID}/user/${userID}/interact`, {
      request: {
        type: 'text',
        payload: payload
      },
      config: {},
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.VOICEFLOW_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error communicating with Voiceflow:', {
      message: error.message,
      status: error.response ? error.response.status : 'No response status',
      data: error.response ? error.response.data : 'No response data'
    });
    res.status(500).json({ error: 'Failed to communicate with Voiceflow' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
