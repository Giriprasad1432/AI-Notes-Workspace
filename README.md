# AI Notes Workspace

An AI-powered note-taking application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). The app lets users create, edit, and manage notes with **AI-powered suggestions** using the Groq LLM API. Contract testing is powered by **Specmatic**.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React + Vite                      |
| Backend    | Node.js + Express.js (v5)         |
| Database   | MongoDB (via Mongoose)            |
| AI         | Groq API (Llama 3.3 70B model)    |
| Auth       | JWT (JSON Web Tokens) + bcrypt    |
| Testing    | Specmatic (Contract Testing)      |
| Deployment | Vercel                            |

---

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v18 or above) — [Download](https://nodejs.org)
- **MongoDB** — Either:
  - Install locally: [MongoDB Community Edition](https://mongodb.com)
  - Or use a free cloud instance: [MongoDB Atlas](https://mongodb.com)
- **Git** — [Download](https://git-scm.com)
- **Java 17+** (required for Specmatic) — [Download](https://adoptium.net)

---

## Project Structure

```text
AI-Notes-Workspace/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── contracts/
│   │   ├── notes-api.yaml         # OpenAPI contract (Specmatic reads this)
│   │   └── notes-api_examples/    # Specmatic test examples
│   │       ├── create_note_example.json
│   │       ├── create_note_only_title.json
│   │       ├── create_note_only_content.json
│   │       └── create_note_validation_error.json
│   ├── controller/
│   │   ├── authContrtoller.js     # Login, Register, Logout logic
│   │   └── noteController.js      # Add, Get, Update notes + AI suggestions
│   ├── middleware/
│   │   └── authMiddleWare.js      # JWT authentication middleware
│   ├── models/
│   │   ├── authModel.js           # User & Login Mongoose schemas
│   │   └── Note.js                # Note Mongoose schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth API routes
│   │   └── noteRoutes.js          # Notes API routes
│   ├── build/
│   │   └── reports/               # Specmatic test reports (auto-generated)
│   ├── .env.example               # Template for environment variables
│   ├── package.json               # Backend dependencies & scripts
│   ├── server.js                  # Express app entry point
│   └── specmatic.yaml             # Specmatic configuration
├── frontend/
│   └── ai-note-saver/             # React frontend app
├── .github/
│   └── workflows/
│       └── specmatic-tests.yml    # CI pipeline for Specmatic tests
├── .gitignore
├── vercel.json                    # Vercel deployment configuration
└── README.md                      # This file
```

---

## Environment Variables

### Backend

The backend requires a `.env` file in the `backend/` directory. A template is provided in `.env.example`.

**Setup Steps:**

1. Navigate to the backend directory:

   **Windows (PowerShell):**
   ```powershell
   cd backend
   ```

   **Linux / macOS:**
   ```bash
   cd backend
   ```

2. Copy the example file:

   **Windows (PowerShell):**
   ```powershell
   Copy-Item .env.example .env
   ```

   **Linux / macOS:**
   ```bash
   cp .env.example .env
   ```

3. Fill in the values:

| Variable       | Description                                    | Example Value                                      |
|----------------|------------------------------------------------|----------------------------------------------------|
| `MONGODB_URI`  | MongoDB connection string                      | `mongodb://localhost:27017/AI_NOTES_WORKSPACE`     |
| `JWT_SECRET`   | Secret key used to sign JWT auth tokens        | `my_super_secret_key_123`                          |
| `GROQ_API_KEY` | API key from [Groq Console](https://groq.com) for AI features | `gsk_xxxxxxxxxxxx`               |
| `PORT`         | Port number for the Express server             | `5000`                                             |

> **Note**: To get a Groq API key, sign up at [://groq.com](https://groq.com), go to API Keys, and create a new key.

### Frontend

The frontend reads the backend URL from the `VITE_API_URL` environment variable [INDEX]. If the variable is not set, it automatically falls back to `http://localhost:5000` for local development [INDEX].

To override the URL (e.g. pointing at a staging server), create a `.env` file in `frontend/ai-note-saver/`:

```env
VITE_API_URL=https://example.com
```

For standard local development, no frontend `.env` file is needed — the fallback applies automatically [INDEX].
---

## Getting Started

### 1. Clone the Repository

**Windows (PowerShell) / Linux / macOS:**
```bash
git clone https://github.com
cd AI-Notes-Workspace
```

---

### 2. Setup the Backend

**Windows (PowerShell):**
```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edit .env with your values (see Environment Variables section above)
npm run dev
```

**Linux / macOS:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (see Environment Variables section above)
npm run dev
```

The backend server will start on `http://localhost:5000`.

---

### 3. Setup the Frontend

**Windows (PowerShell):**
```powershell
cd frontend\ai-note-saver
npm install
npm run dev
```

**Linux / macOS:**
```bash
cd frontend/ai-note-saver
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

### 4. Database Setup

**Option A — Local MongoDB:**

1. Install MongoDB Community Edition
2. Start the MongoDB service:

   **Windows (PowerShell):**
   ```powershell
   mongod
   ```

   **Linux / macOS:**
   ```bash
   mongod
   ```

3. Use the default connection string: `mongodb://localhost:27017/AI_NOTES_WORKSPACE`

**Option B — MongoDB Atlas (Cloud):**

1. Create a free account at [MongoDB Atlas](https://mongodb.com)
2. Create a new cluster (free tier is fine)
3. Go to **Database Access** → Add a database user
4. Go to **Network Access** → Allow your IP (or `0.0.0.0/0` for development)
5. Go to **Clusters** → Click **Connect** → Choose **Connect your application**
6. Copy the connection string and paste it as `MONGODB_URI` in your `.env` file
7. Replace `<password>` with your database user's password

---

## API Endpoints

### Authentication

| Method | Endpoint             | Description           | Auth Required |
|--------|----------------------|-----------------------|---------------|
| POST   | `/api/auth/register` | Register a new user   | No            |
| POST   | `/api/auth/login`    | Login and get JWT     | No            |
| POST   | `/api/auth/logout`   | Logout (clear cookie) | Yes           |

### Notes

| Method | Endpoint                   | Description                    | Auth Required |
|--------|----------------------------|--------------------------------|---------------|
| POST   | `/api/add-note`            | Create a new note              | Yes           |
| GET    | `/api/get-notes`           | Get all notes for the user     | Yes           |
| PUT    | `/api/update-note/:noteId` | Update an existing note        | Yes           |
| POST   | `/api/suggestion`          | Get AI-powered note suggestion | Yes           |

### Health Check & Coverage Tracking (Specmatic Actuator)

| Method | Endpoint             | Description                                          | Auth Required |
|--------|----------------------|------------------------------------------------------|---------------|
| GET    | `/actuator/health`   | Returns `{ "status": "UP" }` to verify server readiness | No            |
| GET    | `/actuator/mappings` | Returns Spring-style route maps for coverage tracking | No            |
---

## Running Specmatic Contract Tests Locally

Specmatic validates your API against the OpenAPI contract defined in `contracts/notes-api.yaml` [INDEX].

### Prerequisites

- Java 17+ must be installed (Specmatic runs on the JVM).
- Backend server must be running on `http://localhost:5000`.

### Steps

1. **Start the backend server** (in one terminal):

   **Windows (PowerShell):**
   ```powershell
   cd backend
   npm run dev
   ```

   **Linux / macOS:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Run Specmatic tests** (in a second terminal):

   Because security tracking is configured natively inside `specmatic.yaml` [INDEX], it automatically maps authentication tokens using an embedded environment fallback model [INDEX]. You can run the test suite instantly with zero manual arguments on any operating system shell [INDEX]:

   **Windows (PowerShell):**
   ```powershell
   npm run specmatic-test
   ```

   **Linux / macOS (Bash):**
   ```bash
   npm run specmatic-test
   ```

3. **View reports**: After the tests complete, reports are generated in the following directory layout:

```text
backend/build/reports/specmatic/
```

- `test/html/index.html` — Interactive, human-readable HTML report dashboard [INDEX]
- `TEST-All-Tests.xml` — JUnit XML execution matrix log file used by CI tools [INDEX]

### What Gets Tested?

- **Contract Tests**: Specmatic auto-generates requests based on your OpenAPI spec and checks if your API responds correctly [INDEX].
- **Resiliency Tests**: Specmatic sends malformed requests (wrong types, extra fields, missing fields) to test how well your API handles unexpected input [INDEX].
- **Example-Based Tests**: The specific examples in `contracts/notes-api_examples/` are also executed as exact test cases [INDEX].

---

## CI/CD Pipeline

This project uses **GitHub Actions** to automatically run Specmatic contract tests on every push and pull request targeting your submission branch [INDEX].

The workflow file is located at `.github/workflows/specmatic-tests.yml` [INDEX].

### What the CI Pipeline Does

1. Checks out the code from your repository [INDEX].
2. Sets up Node.js and Java execution dependencies [INDEX].
3. Installs backend production packages [INDEX].
4. Starts a MongoDB instance via a native Docker service container [INDEX].
5. Starts the Express backend server in the background [INDEX].
6. Pulls route maps from the actuator endpoint and executes Specmatic contract + resiliency tests [INDEX].
7. Uploads test report logs as accessible CI artifacts [INDEX].

### Viewing CI Results

- Go to your GitHub repo → **Actions** tab → Click on the latest workflow run [INDEX].
- Download the `specmatic-reports` zip archive folder to view reports locally [INDEX].

---

## License

This project is for educational/assessment purposes.
