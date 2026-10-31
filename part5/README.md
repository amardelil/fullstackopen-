# Full Stack Open Part 5 — Blog List Frontend (5.1–5.28)

This is the React frontend for the Blog List backend from Part 4. It brings the Part 5 exercises together in one application.

## Requirements
- Node.js 20+
- Part 4 backend running on `http://localhost:3003`
- A user account created through `POST /api/users`

## Install (PowerShell)
```powershell
npm install
Copy-Item .env.example .env
```

The Vite proxy forwards `/api` requests to `http://localhost:3003`. If your backend uses another port, change `VITE_BACKEND_URL` in `.env` and restart Vite.

## Run
Terminal 1 — start Part 4 backend:
```powershell
cd ..\part4
npm run dev
```

Terminal 2 — start Part 5 frontend:
```powershell
cd ..\part5
npm run dev
```
Open `http://localhost:5173`.

## Create a user
Use your Part 4 backend to create a user. Example request:
```json
{
  "username": "amar",
  "name": "Amar",
  "password": "change-this-password"
}
```
Send it to `POST http://localhost:3003/api/users` using Postman or Thunder Client. Then log in through the frontend.

## Tests
Component tests (5.13–5.16):
```powershell
npm test
```

End-to-end tests (5.17–5.23 and updated 5.28):
1. Set `E2E_USERNAME` and `E2E_PASSWORD` in `.env` to an existing test account.
2. Start the Part 4 backend and make sure that account can log in.
3. Run:
```powershell
npx playwright install chromium
npm run test:e2e
```
E2E tests create and remove their own blog posts where possible. Use a dedicated test account and test database.

## Exercise map
- 5.1–5.4: login, persistent login/logout, creating blogs, notifications
- 5.5–5.12: togglable forms, reusable components, blog details, likes, sorting and deletion
- 5.13–5.16: Vitest + React Testing Library component tests
- 5.17–5.23: Playwright end-to-end scenarios
- 5.24–5.26: React Router navigation, blog detail and create views
- 5.27: component tests for unauthenticated, non-owner and owner views
- 5.28: end-to-end scenarios for login, create, like and delete

## Notes
- The frontend expects the Part 4 backend to provide `/api/blogs`, `/api/login`, `/api/users` and JWT-protected blog creation/deletion.
- Do not commit `.env`.
- The Playwright suite requires a working backend and test user; component tests do not.
