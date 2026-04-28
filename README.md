# 🌍 AI Travel Planner

A modern, full-stack travel planning application designed to provide users with intelligent trip itineraries, destination insights, and booking management. The platform features beautiful animations, an intuitive user interface, and an AI-assisted chat system.

## ✨ Features

- **🗺️ Interactive Destinations:** Browse through popular destinations, hotels, and local activities.
- **🤖 AI Trip Assistant:** Get personalized travel recommendations through an integrated AI chatbot interface.
- **📅 Custom Itineraries:** Generate dynamically scheduled trip plans complete with hotels and daily activities.
- **🛒 Trip Cart System:** Seamlessly plan out your journey, manage bookings, and review detailed trip summaries.
- **✨ Smooth Animations:** Powered by GSAP for a highly responsive, premium, and fluid user experience.

## 🛠️ Technology Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- GSAP (GreenSock Animation Platform) for rich micro-interactions and smooth page transitions

**Backend:**
- Node.js & Express.js (REST API)
- SQLite Database & Sequelize ORM
- Cors & Dotenv for environment configuration

## 🚀 System Architecture

The project is split into two independent pieces that communicate over local network ports:

1. **The Backend (API)**: A Node.js & Express server running on port `5000`. It connects to a local SQLite database (`database.sqlite`) via Sequelize to serve JSON data containing hotels, restaurants, and activities.
2. **The Frontend**: A static web application (HTML, CSS, JS) that relies on the backend. When loaded, `database.js` makes `fetch()` requests directly to `http://localhost:5000/api/...` to populate the user interface with real data.

## ⚙️ How to Run the Project Locally

To run the project completely end-to-end, you must start *both* the backend and the frontend.

### Step 1: Start the Backend Server
The frontend cannot load any data unless the backend server is running first.

1. Open your terminal (Command Prompt, PowerShell, or VS Code terminal).
2. Install the necessary dependencies if you haven't already:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. You should see two confirmation messages in the console:
   - `Server running on port 5000`
   - `SQLite Database Connected via Sequelize...`

*(Leave this terminal window open in the background. Closing it will shut down the API.)*

### Step 2: Open the Frontend

**Option A (The Easiest Way - VS Code Live Server):**
If you are using Visual Studio Code:
1. Go to the Extensions tab (`Ctrl+Shift+X`).
2. Search for and install the **"Live Server"** extension by Ritwick Dey.
3. Open `login.html` or `HP/index.html` inside VS Code.
4. Click the **"Go Live"** button located at the bottom right corner of the VS Code window.
5. Your default browser will automatically open the project at `http://127.0.0.1:5500`.

**Option B (The Manual Way):**
Since the frontend relies heavily on vanilla HTML/JS, you can run it directly from your file system.
1. Open your File Explorer.
2. Navigate to the root folder of the project.
3. Double-click the `login.html` file to open it in Chrome, Edge, or Firefox.

## 🐛 Troubleshooting

- **"No Hotels Found" or empty data in the UI**: This usually means the frontend cannot reach the backend. Verify that your terminal from Step 1 is still open and running without errors.
- **Port already in use error**: If you get a crash saying port `5000` is in use, another terminal is already running the server. You must find it and stop it (`Ctrl+C`), or restart your computer to clear lingering processes.
