# DentProSuite

A modular dental practice management system supporting dual modes: Appwrite cloud integration or a purely local SQLite-backed experience.

## Prerequisites

- **Node.js >= 20.0.0**
- npm >= 9.x

## Quick Start (Local Full Stack)

This repository uses **npm workspaces** to manage packages efficiently.

### 1. Installation

Run this from the **root directory**:

```bash
npm install
```

### 2. Environment Setup

```bash
# Backend
cp backend/.env.example backend/.env
# Frontend
cp frontend/.env.example frontend/.env
```

Edit the `.env` files as needed. Defaults work out of the box for local development.

### 3. Backend Setup

From the **root directory**:

```bash
npm run seed -w backend        # (optional) seed demo data
npm run typecheck -w backend   # verify types
npm run test -w backend        # run tests
npm run dev -w backend         # start dev server on :3001
```

### 4. Frontend Setup

From the **root directory** in a new terminal:

```bash
npm run test -w frontend       # run tests
npm run dev -w frontend        # start dev server on :5173
```

## Project Structure

```
DentProSuite/
├── backend/          # Express + TypeScript API server
│   ├── src/
│   │   ├── auth/           # JWT token helpers
│   │   ├── controllers/    # Route handlers
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── routes/         # Express route definitions
│   │   ├── seed/           # Demo data seeding
│   │   ├── storage/        # Storage adapter system
│   │   │   └── adapters/   # SQLite, JSON, Appwrite adapters
│   │   ├── utils/          # Environment validation
│   │   └── server.ts       # Entry point
│   └── tests/              # Backend test suite
├── frontend/         # Vue 3 + Vite SPA
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── pages/          # Route pages
│   │   ├── router/         # Vue Router config
│   │   ├── services/       # API client, Appwrite, offline sync
│   │   ├── stores/         # Pinia stores
│   │   └── lib/            # Utility re-exports
│   └── tests/              # Frontend test suite
├── shared/           # Shared types & validation schemas
├── data/             # Runtime data (SQLite DB, JSON files)
└── docs/             # Architecture documentation
```

## Storage Modes

The system supports three storage backends via the `STORAGE_ADAPTER` environment variable:

| Mode         | Backend        | Persistence     | Use Case                  |
|-------------|----------------|-----------------|---------------------------|
| `local`     | SQLite         | `data/dentpro.sqlite` | Default local production  |
| `local-json`| JSON files     | `data/*.json`          | Lightweight / testing     |
| `appwrite`  | Appwrite Cloud | Appwrite Database      | Cloud / multi-instance    |

Set in `backend/.env`:
```
STORAGE_ADAPTER=local       # SQLite (default)
# STORAGE_ADAPTER=local-json  # JSON files
# STORAGE_ADAPTER=appwrite    # Appwrite cloud
```

## Appwrite Integration

Appwrite is fully optional. When `STORAGE_ADAPTER=appwrite`:

**Backend** uses `node-appwrite` (server SDK) for all data operations via `AppwriteAdapter`.

**Frontend** uses the Appwrite Web SDK for safe client-side reads when enabled:
- Set `VITE_APPWRITE_ENDPOINT`, `VITE_APPWRITE_PROJECT_ID`, `VITE_APPWRITE_DATABASE_ID` in `frontend/.env`

The app works fully with or without Appwrite — local mode requires no Appwrite config.

## Scripts

### Backend
| Script       | Command                          |
|-------------|----------------------------------|
| `dev`       | `tsx watch src/server.ts`        |
| `build`     | `tsc`                            |
| `start`     | `node dist/backend/src/server.js`|
| `test`      | `vitest run`                     |
| `typecheck` | `tsc --noEmit`                   |
| `seed`      | `tsx src/seed/index.ts`          |
| `clean`     | Removes `dist/` directory        |

### Frontend
| Script       | Command                          |
|-------------|----------------------------------|
| `dev`       | `vite`                           |
| `build`     | `vue-tsc -b && vite build`       |
| `preview`   | `vite preview`                   |
| `test`      | `vitest run`                     |

## Deployment

### Vercel (Frontend)

The frontend includes `vercel.json` for zero-config Vercel deployment:

```bash
npm install -g vercel
cd frontend
vercel --prod
```

Set `VITE_API_URL` to your deployed backend URL in Vercel environment variables.

### Docker (Backend)

```bash
docker build -f backend/Dockerfile -t dentprosuite-backend .
docker run -p 3001:3001 dentprosuite-backend
```

## License

GNU General Public License v3.0
