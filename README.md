# DentProSuite

DentProSuite is a role-based, offline-capable dental clinic management platform.

It supports two operating models:
- **Cloud Mode**: Vue frontend on Vercel + Appwrite backend capability.
- **Local Mode**: Self-hosted Express backend leveraging a robust offline-capable local storage engine.

## Features
- **Roles:** Admin, Dentist, Reception, and Patient workflows.
- **Offline-first Foundation:** Workflows are persisted to a local sync queue when offline.
- **Appointments & Billing:** Track daily summaries and patient schedules.
- **Form Studio:** No-code intake and consent form builder.

## Documentation
- [Architecture & Design](./ARCHITECTURE.md)
- [Deployment & Configuration](./DEPLOYMENT.md)
- [Mobile & Capacitor Readiness](./MOBILE.md)

## Quick Start
1. `cd backend && npm install && npm start`
2. `cd frontend && npm install && npm run dev`
