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
  res.header('Access-Control-Allow-Origin', 'https://www.mkgdigital.es');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware to parse JSON bodies
app.use(express.json());

// Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
  const { message, url, metadata } = req.body;
  const userID = req.body.userID || 'test-user-id'; // Using a static userID for testing

    // Create a payload that includes metadata in a JSON string
    const payload = message || `Hello, url: ${metadata?.url}, language: ${metadata?.language}`;

    // Log the payload being sent to Voiceflow
    console.log('Payload sent to Voiceflow:', {
      request: {
        type: 'text',
        payload: payload
      }
    });

    try {
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
