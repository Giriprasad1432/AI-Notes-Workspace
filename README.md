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

- **Node.js** (v18 or above) — [Download](https://nodejs.org/)
- **MongoDB** — Either:
  - Install locally: [MongoDB Community Edition](https://www.mongodb.com/try/download/community)
  - Or use a free cloud instance: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Git** — [Download](https://git-scm.com/)
- **Java 17+** (required for Specmatic) — [Download](https://adoptium.net/)

---

## Project Structure

```
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
| `GROQ_API_KEY` | API key from [Groq Console](https://console.groq.com/) for AI features | `gsk_xxxxxxxxxxxx`               |
| `PORT`         | Port number for the Express server             | `5000`                                             |

> **Note**: To get a Groq API key, sign up at [console.groq.com](https://console.groq.com/), go to API Keys, and create a new key.

### Frontend

The frontend reads the backend URL from the `VITE_API_URL` environment variable. If the variable is not set, it automatically falls back to `http://localhost:5000` for local development.

To override the URL (e.g. pointing at a staging server), create a `.env` file in `frontend/ai-note-saver/`:

```env
VITE_API_URL=https://your-backend-domain.example.com
```

For standard local development, no frontend `.env` file is needed — the fallback applies automatically.

---

## Getting Started

### 1. Clone the Repository

**Windows (PowerShell) / Linux / macOS:**
```bash
git clone https://github.com/<your-username>/AI-Notes-Workspace.git
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

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
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

### Health Check (Specmatic Actuator)

| Method | Endpoint           | Description                              | Auth Required |
|--------|--------------------|------------------------------------------|---------------|
| GET    | `/actuator/health` | Returns `{ "status": "UP" }` when live   | No            |

---

## Running Specmatic Contract Tests

Specmatic validates your API against the OpenAPI contract defined in `contracts/notes-api.yaml`.

### Prerequisites

- Java 17+ must be installed (Specmatic runs on the JVM)
- Backend server must be running on `http://localhost:5000`

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

2. **Run Specmatic tests** (in a second terminal).

   You need a valid long-lived Bearer token. The token is passed via the `BearerAuth` environment variable. Specmatic will also use the default fallback token embedded in `specmatic.yaml` if this variable is not set.

   **Windows (PowerShell):**
   ```powershell
   $env:BearerAuth="YOUR_TOKEN_STRING"; npm run specmatic-test
   ```

   **Linux / macOS (Bash):**
   ```bash
   BearerAuth="YOUR_TOKEN_STRING" npm run specmatic-test
   ```

   > **Tip**: Obtain a token by calling `POST /api/auth/login` with valid credentials, then copy the JWT from the response (or from the cookie if using `httpOnly` cookies).

3. **View reports**: After the tests complete, reports are generated in:

   ```
   backend/build/reports/specmatic/
   ```
   - `html/index.html` — Human-readable HTML report
   - `TEST-All-Tests.xml` — JUnit XML report (used by CI tools)

### What Gets Tested?

- **Contract Tests**: Specmatic auto-generates requests based on your OpenAPI spec and checks if your API responds correctly.
- **Resiliency Tests**: Specmatic sends malformed requests (wrong types, extra fields, missing fields) to test how well your API handles unexpected input.
- **Example-Based Tests**: The specific examples in `contracts/notes-api_examples/` are also executed as exact test cases.

---

## CI/CD Pipeline

This project uses **GitHub Actions** to automatically run Specmatic contract tests on every push and pull request.

The workflow file is located at `.github/workflows/specmatic-tests.yml`.

### What the CI Pipeline Does

1. Checks out the code
2. Sets up Node.js and Java
3. Installs dependencies
4. Starts a MongoDB instance (via Docker service container)
5. Starts the Express backend server
6. Runs Specmatic contract + resiliency tests
7. Uploads test reports as CI artifacts

### Viewing CI Results

- Go to your GitHub repo → **Actions** tab → Click on the latest workflow run
- Download the `specmatic-reports` artifact to view HTML reports

---

## License

This project is for educational/assessment purposes.
