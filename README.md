# Continuum
# Notes App

A full-stack notes application with user authentication and admin features.

🔗 **Live Demo**: https://continuum-snqb.onrender.com/

## Features

- **User Authentication**: Sign up and log in with secure JWT-based authentication
- **Notes Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Persistent Storage**: Notes are saved to SQLite database and persist between sessions
- **Admin Dashboard**: Admin users can view all notes from all users (read-only)
- **Role-Based Access**: Regular users cannot access the admin page

## Admin Credentials

| Email | Password |
|-------|----------|
| `admin@notes.app` | *(provided in submission email)* |
| `superadmin@notes.app` | *(provided in submission email)* |

## Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Frontend** | React 18 + Vite | Fast development, modern tooling, excellent DX |
| **Styling** | Tailwind CSS | Rapid UI development, consistent design system |
| **Backend** | Node.js + Express | Simple, widely adopted, pairs well with React |
| **Database** | SQLite (sql.js) | Zero configuration, file-based, perfect for this scope |
| **Authentication** | JWT + bcrypt | Industry standard, stateless, secure password hashing |
| **Deployment** | Render | Free tier, supports full-stack Node apps |

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                        │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐ │
│  │  Login  │  │ Signup  │  │  Notes  │  │  Admin (admin)  │ │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP/JSON
┌─────────────────────────▼───────────────────────────────────┐
│                     Server (Express)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ /api/auth    │  │ /api/notes   │  │ /api/admin   │       │
│  │ - POST login │  │ - GET /      │  │ - GET /notes │       │
│  │ - POST signup│  │ - POST /     │  │ - GET /users │       │
│  │ - GET /me    │  │ - PUT /:id   │  │ - GET /stats │       │
│  └──────────────┘  │ - DELETE /:id│  └──────────────┘       │
│                    └──────────────┘                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Middleware: JWT Authentication          │    │
│  │              Admin routes: requireAdmin check        │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                    SQLite Database                           │
│  ┌─────────────┐           ┌─────────────────────────┐      │
│  │   users     │           │        notes            │      │
│  │ - id        │◄──────────│ - id                    │      │
│  │ - email     │   FK      │ - user_id               │      │
│  │ - password  │           │ - title                 │      │
│  │ - name      │           │ - content               │      │
│  │ - is_admin  │           │ - created_at            │      │
│  │ - created_at│           │ - updated_at            │      │
│  └─────────────┘           └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
notes-app/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── api/               # API client functions
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── NoteCard.jsx
│   │   │   ├── NoteModal.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/           # React Context for auth state
│   │   │   └── AuthContext.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Notes.jsx      # User's notes (CRUD)
│   │   │   └── Admin.jsx      # Admin dashboard
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/                    # Express Backend
│   ├── db/
│   │   ├── index.js           # Database setup & queries
│   │   └── seed.js            # Seed script for test data
│   ├── middleware/
│   │   └── auth.js            # JWT verification & admin check
│   ├── routes/
│   │   ├── auth.js            # Login, signup, me endpoints
│   │   ├── notes.js           # CRUD for user's notes
│   │   └── admin.js           # Admin-only endpoints
│   ├── .env.example           # Environment variables template
│   ├── index.js               # Express server entry point
│   └── package.json
├── render.yaml                # Render deployment config
├── package.json               # Root package with scripts
└── README.md
```

## Running Locally

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/notes-app.git
   cd notes-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp server/.env.example server/.env
   
   # Edit server/.env with your values:
   ```
   
   ```env
   PORT=3001
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   
   ADMIN1_EMAIL=admin@notes.app
   ADMIN1_PASSWORD=your-admin-password
   ADMIN1_NAME=Admin User
   
   ADMIN2_EMAIL=superadmin@notes.app
   ADMIN2_PASSWORD=your-superadmin-password
   ADMIN2_NAME=Super Admin
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   - Frontend: http://localhost:5173
   - API: http://localhost:3001/api

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new user account |
| POST | `/api/auth/login` | Login and receive JWT token |
| GET | `/api/auth/me` | Get current user info |

### Notes (requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes for current user |
| GET | `/api/notes/:id` | Get single note |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

### Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/notes` | Get all notes from all users |
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/stats` | Get dashboard statistics |

## Deployment

### Deploy to Render

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Render Web Service**
   - Go to [render.com](https://render.com) → New → Web Service
   - Connect your GitHub repository
   - Render will auto-detect settings from `render.yaml`

3. **Set Environment Variables** in Render Dashboard:
   | Variable | Value |
   |----------|-------|
   | `ADMIN1_EMAIL` | `admin@notes.app` |
   | `ADMIN1_PASSWORD` | Your secure password |
   | `ADMIN2_EMAIL` | `superadmin@notes.app` |
   | `ADMIN2_PASSWORD` | Your secure password |

4. **Deploy** - Render will build and deploy automatically

## Design Decisions & Tradeoffs

### SQLite vs PostgreSQL
**Decision**: Used SQLite (sql.js) instead of PostgreSQL.

**Rationale**: 
- Zero configuration needed
- No external database service required
- Simpler deployment for demo purposes
- Sufficient for the scope of this application

**Tradeoff**: On Render's free tier, the database resets on each deploy since the filesystem is ephemeral. For production, PostgreSQL would be preferred.

### JWT in localStorage vs HTTP-only Cookies
**Decision**: Stored JWT in localStorage.

**Rationale**:
- Simpler implementation for SPA
- Works well with the React + Express architecture
- Sufficient security for this demo

**Tradeoff**: HTTP-only cookies would provide better XSS protection for production apps.

### Monorepo Structure
**Decision**: Single repository with client/ and server/ folders.

**Rationale**:
- Easier to manage for a small project
- Simpler deployment to Render as a single service
- Shared configuration at root level

**Tradeoff**: For larger teams, separate repos might offer better CI/CD flexibility.

### No Password in Code
**Decision**: Admin credentials must be provided via environment variables.

**Rationale**:
- Follows security best practices
- Prevents accidental credential exposure in version control
- Allows different credentials per environment

**Tradeoff**: Slightly more setup required, but essential for security.

## Test Accounts

After seeding, the following test accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | Set via `ADMIN1_EMAIL` | Set via `ADMIN1_PASSWORD` |
| Admin | Set via `ADMIN2_EMAIL` | Set via `ADMIN2_PASSWORD` |
| User | john@example.com | testuser123! |
| User | jane@example.com | testuser123! |

## License

MIT
