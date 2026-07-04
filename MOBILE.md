# Mobile App (Capacitor) Readiness

DentProSuite frontend has been structured to easily wrap into native iOS and Android apps using **Capacitor**.

## Current Implementation Status
- **Responsive UI:** Built with Tailwind for all screen sizes.
- **No Hardcoded URLs:** Configured to read from environment variables (`import.meta.env.VITE_API_URL`).
- **Offline Capable:** Forms and appointments can be completed offline and sync'd when the app reconnects to the network, a necessity for reliable mobile operation.

## Future Steps to Generate APK/IPA
1. In the `frontend` directory, install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   npm install @capacitor/android @capacitor/ios
   ```
2. Build the Vite project `npm run build`.
3. Add native platforms:
   ```bash
   npx cap add android
   npx cap add ios
   ```
4. Copy the `dist` web assets into the native shells:
   ```bash
   npx cap sync
   ```
5. Open Android Studio / XCode to compile and publish.
