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
│   ├── create_test_user.js        # Script to create a test user + JWT token
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

The backend requires a `.env` file in the `backend/` directory. A template is provided in `.env.example`.

### Setup Steps:

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Copy the example file:
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

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/AI-Notes-Workspace.git
cd AI-Notes-Workspace
```

### 2. Setup the Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values (see Environment Variables section above)

# Start the development server
npm run dev
```

The backend server will start on `http://localhost:5000`.

### 3. Setup the Frontend

```bash
# Navigate to frontend (from project root)
cd frontend/ai-note-saver

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`.

### 4. Database Setup

**Option A — Local MongoDB:**
1. Install MongoDB Community Edition
2. Start the MongoDB service:
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

| Method | Endpoint            | Description         | Auth Required |
|--------|---------------------|---------------------|---------------|
| POST   | `/api/auth/register` | Register a new user | No            |
| POST   | `/api/auth/login`    | Login and get JWT   | No            |
| POST   | `/api/auth/logout`   | Logout (clear cookie) | Yes         |

### Notes

| Method | Endpoint                    | Description                   | Auth Required |
|--------|-----------------------------|-------------------------------|---------------|
| POST   | `/api/add-note`             | Create a new note             | Yes           |
| GET    | `/api/get-notes`            | Get all notes for the user    | Yes           |
| PUT    | `/api/update-note/:noteId`  | Update an existing note       | Yes           |
| POST   | `/api/suggestion`           | Get AI-powered note suggestion| Yes           |

---

## Running Specmatic Contract Tests

Specmatic validates your API against the OpenAPI contract defined in `contracts/notes-api.yaml`.

### Prerequisites
- Java 17+ must be installed (Specmatic runs on the JVM)
- Backend server must be running

### Steps:

1. **Start the backend server** (in one terminal):
   ```bash
   cd backend
   npm run dev
   ```

2. **Create a test user** (first time only):
   ```bash
   cd backend
   node create_test_user.js
   ```
   This will seed the database and output a long-lived JWT token to your terminal screen. Copy this token string.

3. **Run Specmatic tests** (in another terminal):
   Make sure your server is running (`npm run dev`), then open a Windows PowerShell window and run the test suite by passing your copied token:
   ```powershell
   $env:BearerAuth="PASTE_YOUR_COPIED_TOKEN_HERE"; npm run specmatic-test
   ```

4. **View reports**: After tests complete, reports are generated in:

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

### What the CI Pipeline Does:
1. Checks out the code
2. Sets up Node.js and Java
3. Installs dependencies
4. Starts a MongoDB instance (via Docker service container)
5. Creates a test user and generates a JWT token
6. Starts the Express backend server
7. Runs Specmatic contract + resiliency tests
8. Uploads test reports as CI artifacts

### Viewing CI Results:
- Go to your GitHub repo → **Actions** tab → Click on the latest workflow run
- Download the `specmatic-reports` artifact to view HTML reports

---

## License

This project is for educational/assessment purposes.
