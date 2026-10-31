# Full Stack Open — Part 4 Blog List (4.1–4.23)

One backend project covering Part 4a, 4b, 4c and 4d.

## Requirements
- Node.js 20+
- MongoDB Atlas or local MongoDB
- npm

## Setup (PowerShell)
```powershell
npm install
Copy-Item .env.example .env
```
Edit `.env` and set **different** MongoDB databases for `MONGODB_URI` and `TEST_MONGODB_URI`. Set a long random `SECRET`. Do not commit `.env`.

Run tests:
```powershell
npm test
```

Run development server:
```powershell
npm run dev
```
API: `http://localhost:3003/api/blogs`

## Main API
- `GET /api/blogs` — list blogs
- `POST /api/blogs` — create blog (requires `Authorization: Bearer <token>`)
- `PUT /api/blogs/:id` — update blog
- `DELETE /api/blogs/:id` — delete your own blog (requires token)
- `GET /api/users` — list users with their blogs
- `POST /api/users` — create user
- `POST /api/login` — login and receive JWT

## Exercise coverage
- 4.1–4.7: Blog List API, modular structure and list helper functions
- 4.8–4.12: REST API integration tests with Supertest and test database
- 4.13–4.17: User administration, password hashing, validation and user/blog relationships
- 4.18–4.23: JWT login, token middleware, authenticated blog creation and owner-only deletion

## Important
Tests use `TEST_MONGODB_URI` and clear that database's blog and user collections. Never point it at your development or production database. Verify `npm test` locally before submitting.
