# DentProSuite

A modular practice management system supporting dual modes: Appwrite integration or a purely localized SQLite-backed experience.

## Quick Start (Local Full Stack)

1. **Environment Setup**
   Copy `.env.example` to `.env` in both `backend/` and `frontend/` and configure appropriately.

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run test
   npm start # (or npm run dev if nodemon is setup)
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Key Architectural Decisions

- **Storage Adapter**: The Express API routes data through a common `StorageAdapter` interface. By default, it will use `SqliteAdapter` allowing zero-configuration data retention. Setting `STORAGE_ADAPTER=appwrite` switches it to communicate directly with an Appwrite instance via `node-appwrite`.
- **Offline Sync & PWA**: The Vue 3 app uses a specialized `DataService` capable of caching requests (IndexedDB) and queuing mutating actions when offline.
- **Vercel Readiness**: The frontend includes `vercel.json` forcing Single Page Application routing, enabling one-click deploy to Vercel without a hard requirement on the backend (if using purely Appwrite or a remote deployed backend URL).