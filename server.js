// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle user session (generate or retrieve user ID)
app.use((req, res, next) => {
  if (!req.cookies || !req.cookies.userID) {
    const userID = uuidv4();
    res.cookie('userID', userID, { httpOnly: true });
    req.userID = userID;
  } else {
    req.userID = req.cookies.userID;
  }
  next();
});

// Endpoint to handle chat messages
app.post('/api/chat', async (req, res) => {
  const { message, url, metadata } = req.body;
  const userID = req.userID;

  try {
    const response = await axios.post(`https://general-runtime.voiceflow.com/state/${process.env.VOICEFLOW_VERSION_ID}/user/${userID}/interact`, {
      request: {
        type: 'text',
        payload: message
      },
      config: {
        url,
        metadata,
      },
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
