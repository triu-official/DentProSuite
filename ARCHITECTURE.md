# DentProSuite Architecture

## Overview
DentProSuite is a hybrid, offline-capable platform designed for dental clinics. It can be deployed in two modes:
1. **Local / Self-Hosted Mode**: A stable Express backend interacting with a local file-based database.
2. **Cloud Mode**: A web-facing app ready to integrate with Appwrite for authentication, database, and storage.

## Components
### 1. Frontend
- Built with **Vue 3, Vite, Pinia, Vue Router, Tailwind CSS**.
- **Offline First**: Uses IndexedDB (`idb`) to cache reads and queue writes. It detects online state and replays queued API requests automatically.
- **Mobile Ready**: Architecture uses environment variables and relative APIs, making it compatible with future Capacitor (Android/iOS) wrappers.

### 2. Backend
- Built with **Node.js, Express, Zod, and Helmet**.
- **Data Abstraction**: Uses a `StorageAdapter` pattern. `DatabaseService` serves either a `LocalJsonAdapter` (JSON filesystem DB) or `AppwriteAdapter` (Cloud DB) based on the `STORAGE_MODE` env var.
- **Security**: Hardened with strict request validation, CORS checks, Rate Limiting, and unified error handling.

## Offline Data Strategy
- `offlineStorage.ts` acts as the intermediary.
- Actions like filling forms or scheduling appointments check for network state. If offline, the request configuration is persisted to an IndexedDB `sync-queue`.
- Upon `navigator.onLine` returning `true`, the `syncQueue` processes pending actions in FIFO order.
