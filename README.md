# VF embedded bot template README
## A Template for setting up a voiceflow integration app for a live embedded bot into a webpage
---
### Overview
An Application to intergrate a custom UI to a wordpress site controlling a voiceflow bot. This can have the ability to capture the users browsers language as well as capturing the exact url the user is on within the website, controlling how the converstion is handled on the voiceflow end, allowing for very custom converstion flow. 




### Technical Overview
This template helps you set up an integration between a Voiceflow chatbot and a custom user interface (UI) embedded into a webpage, such as a WordPress site. The server application serves as the backend that facilitates communication between a chatbot created in Voiceflow and users interacting with it on your website.

#### Main Function of the `server.js` File
The `server.js` file defines a server application that acts as the backend for a chatbot integrated with Voiceflow. Below is an overview of its key features:

#### Dependencies and Configurations
- **Express**: Used to create the server and handle HTTP requests.
- **Axios**: Used to make HTTP requests to Voiceflow's API.
- **CORS**: Used to handle Cross-Origin Resource Sharing (CORS) issues, allowing the chatbot to function seamlessly across different origins.
- **dotenv**: Loads environment variables from a `.env` file to keep sensitive data secure.

#### Middleware Setup
- **CORS Handling**: The server uses `cors()` to allow requests from any origin. Additional headers are added to allow specific methods and headers from the site where the bot is embedded.
- **JSON Parsing**: `express.json()` middleware is used to parse incoming JSON request bodies.

#### Chat Handling Endpoint (`/api/chat`)
- **Handling User Messages**: Handles `POST` requests to manage communication between the chatbot UI and Voiceflow.
- **Session State Check**:
  - Checks if a session state exists for the given `userID` by making a `GET` request to Voiceflow's state endpoint.
  - If no session exists, sends a launch action to initiate the session.
- **Sending User Messages or Metadata**:
  - Constructs a payload containing either the user message or metadata and sends it to Voiceflow via a `POST` request.
- **Error Handling**: Logs any errors that occur during communication with Voiceflow and responds with an error message to the client if needed.

#### Server Listening
The server listens on the port defined in the `.env` file or defaults to port `5000` if no environment variable is specified.

#### Key Features
- **Session Initialization**: Automatically checks if a session exists and starts a new session if necessary.
- **CORS Configuration**: Ensures proper handling of requests originating from your website.
- **Dynamic Metadata Handling**: Sends metadata such as page URL and language on page load, enabling the bot to adapt responses based on the user's context.

This backend setup ensures that the bot can receive user messages, initiate sessions when needed, and relay data between Voiceflow and users, while addressing browser compatibility via CORS settings.

#### Website Integration (WordPress-Based)
1. **Footer Script Setup**
   - Add the code from `footer-code.js` to the footer of your WordPress site using a code snippets plugin or similar tool.
   - Ensure the script is wrapped in `<script>` tags.

2. **Add Chat Placeholder**
   - To embed the chat on specific pages, add the following placeholder HTML element:
     ```html
     <div id="chat-placeholder"></div>
     ```
   - Insert this element on each page where you want the chatbot to be embedded.

### Setup Instructions for Creating a New Version of the Voiceflow Chatbot Integration Template

1. **Clone the Template Repository**
   - Clone this template repository to create a new project using HTTPS, SSH, or GitHub CLI.
   - Example: `git clone <repository_url>`

2. **Install Dependencies**
   - Navigate to the project directory.
   - Run `npm install` to install all the necessary dependencies.

3. **Create and Set Up Environment Variables**
   - Create a new `.env` file in the project root.
   - Copy the contents from the provided `.env example file` and update it with your specific details:
     - Set `PORT` to your desired server port (e.g., `5000`).
     - Replace `VOICEFLOW_VERSION_ID` with your Voiceflow project version ID.
     - Replace `VOICEFLOW_API_KEY` with your Voiceflow API key.

4. **Deploy the Application**
   - You can choose to deploy the app using Heroku or any other deployment platform:
     - For Heroku:
       - Log in using `heroku login`.
       - Run `heroku create` to create a new Heroku app.
       - Push the repository to Heroku using `git push heroku main`.
   - Alternatively, use Docker or any server hosting service to deploy your backend.

5. **Update Frontend Script for Integration**
   - Embed the chatbot UI on the desired web pages.
   - Ensure the URL for the deployed backend endpoint is correctly set in the global JavaScript frontend script (replace the placeholder with your deployed backend URL).

6. **Test the Application**
   - Open the deployed web page containing the chatbot UI.
   - Verify the following:
     - The initial welcome message is received correctly.
     - User inputs are sent and responses are received.
     - Metadata (e.g., URL and language) is handled correctly on page load.

7. **Customize for Your Use Case**
   - Modify the frontend UI and backend logic as needed for your specific requirements.
   - Update Voiceflow conversational flows to match the features and scenarios you need.

8. **Commit Changes**
   - After making modifications, make sure to commit and push your changes:
     - `git add .`
     - `git commit -m "Custom modifications for project"`
     - `git push origin main`


