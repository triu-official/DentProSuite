# Deployment Guide

DentProSuite supports flexible deployment configurations.

## Frontend (Vercel)
The frontend is optimized for serverless edge deployment using Vercel.
1. Push your repository to GitHub.
2. Import the `frontend` directory into Vercel as a Vue/Vite project.
3. Configure the Environment Variables in Vercel settings:
   - `VITE_API_URL`: Your backend endpoint (e.g., `https://api.yourdomain.com`).
4. A `vercel.json` rewrite handles SPA (Single Page Application) routing automatically.

## Backend (Local / Self-Hosted)
The backend is a Node.js Express server.
1. Navigate to the `backend` directory.
2. Copy `.env` and adjust the variables:
   - `JWT_SECRET`: Generate a secure string.
   - `FRONTEND_URL`: `https://your-vercel-frontend-url.vercel.app`
   - `PORT`: Define the listener port.
   - `STORAGE_MODE`: Set to `local` for JSON-file DB, or `appwrite` for cloud connections.
3. Start the application:
   ```bash
   npm install
   npm run start
   ```

## Appwrite Integration (Cloud Database Mode)
To use Appwrite instead of local JSON files:
1. Set `STORAGE_MODE=appwrite`.
2. Configure Appwrite variables in `.env`:
   - `APPWRITE_ENDPOINT`, `APPWRITE_PROJECT_ID`, `APPWRITE_API_KEY`, `APPWRITE_DATABASE_ID`.
3. The `DatabaseService` will automatically switch from the `LocalJsonAdapter` to the `AppwriteAdapter`.
