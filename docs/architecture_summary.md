# DentProSuite Architecture Summary & Migration Plan

## 1. Current Architecture Summary
- **Frontend**: Vue 3 with Vite, Pinia, Vue Router. Tailwind CSS. Features role-based dashboards (Admin, Reception, Dentist, Patient). PWA capable using `vite-plugin-pwa`. Data access patterns are loose using raw `fetch()` directly in Pinia stores and Vue components.
- **Backend**: Express + TypeScript. Route groups: `auth`, `patients`, `appointments`, `forms`, `billing`. Uses JSON-file storage by default, located in a parent `../data` folder. There's a stubbed `AppwriteAdapter`. Middleware includes helmet, cors, standard express error handling.
- **Data/Storage**: Abstracted behind a `StorageAdapter` interface but currently relies heavily on JSON file writing (`LocalJsonAdapter`).
- **Offline/Local-first**: Basic IndexedDB wrapper in `offlineStorage.ts` for a sync queue (`sync-queue`) and generic caching (`cached-data`).

## 2. Product Scope Summary
A modular, dual-mode (Cloud/Appwrite vs. Local/Self-Hosted) Practice Management System. It must securely handle clinic staff workflows (appointments, billing, forms) and patient portal interaction. Vercel deployment for the frontend, with Capacitor-compatible structure for the future.

## 3. Current Strengths
- Good starting domain model (`shared/types/index.ts`).
- Basic storage adapter interface exists (`StorageAdapter.ts`).
- Offline queuing foundation is present (`idb` wrapping in `offlineStorage.ts`).

## 4. Current Weaknesses
- Data access in the frontend is directly hardcoded with `fetch()` and scattered across stores and components.
- The `LocalJsonAdapter` is rudimentary, lacks transactions, and isn't scalable or highly concurrent.
- The `AppwriteAdapter` on the backend is just a stub.
- No Appwrite Client SDK integration on the frontend.
- Missing robust input validation (Zod is in `package.json` but needs application across routes).
- Missing robust role-based route protection on both frontend and backend APIs.

## 5. Critical Risks by Severity
- **High**: No real database for local mode. Concurrent writes to JSON files could easily corrupt data or lose updates.
- **High**: Sensitive API endpoints might lack strict authorization/role checks.
- **Medium**: Hardcoded API endpoints across frontend components (prevents seamless Appwrite/Hybrid switching).
- **Medium**: Lack of true domain validation (types exist, but runtime validation is minimal).

## 6. Coupling Map
- Frontend Components <-> Backend HTTP endpoints (direct `fetch` usage).
- Need an abstraction layer (e.g. `apiClient`) on the frontend to seamlessly switch or mediate Appwrite vs Backend requests.

## 7. Recommended Migration Strategy
1. **Frontend Abstraction**: Create a centralized API/Service layer on the frontend. Replace raw `fetch` with SDKs (Appwrite Client where appropriate, Axios/Fetch wrapper for Backend).
2. **Backend Storage Enhancement**: Replace `LocalJsonAdapter` with `SqliteAdapter` as the primary `local` storage mechanism. Build out the `AppwriteAdapter` implementation.
3. **Offline Sync Robustness**: Upgrade `offlineStorage.ts` into a true sync coordinator that pushes to the Express Backend.
4. **Security & Validation**: Add Zod validation to all controllers. Implement strict JWT + Role checking middleware.

## 8. Prioritized Implementation Plan
1. Fix Vercel Build (Done)
2. Phase 2: Add `sqlite3` to backend. Write `SqliteAdapter`. Complete `AppwriteAdapter` via `node-appwrite`.
3. Phase 3: Add `appwrite` client SDK to frontend. Refactor frontend stores to use a centralized API service. Strengthen offline queue in `offlineStorage.ts`.
4. Phase 4: Security audits, Zod schemas, Environment configurations, Testing.