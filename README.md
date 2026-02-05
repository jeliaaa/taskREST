**TaskREST — Local Dev & Auth Quickstart**

This repository contains a Django REST backend and a Vite + React frontend. The README below explains how to run both, the authentication flow, and provides 6 example requests (curl + Postman-style) for the main auth + tasks operations.

**Prerequisites**:
- **Python 3.10+**: for the backend.
- **Node 16+ / npm**: for the frontend (Vite).
- **Git**, optional.

**Swagger Docs: localhost:8000/api/docs/**


**Backend — Quickstart**:
- **Install & activate venv (Windows PowerShell)**:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

- **Run migrations and start server**:

```powershell
cd backend
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

The backend will be available at http://localhost:8000/ and exposes the API under `/api/v1/` with auth under `/api/v1/auth/`.

**Frontend — Quickstart**:
- Install and run the Vite app:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

Create .env file
```
VITE_BACKEND_APP_URL = "http://localhost:8000"
```


**Auth flow (overview)**:
- Register: POST `/api/v1/auth/register/` — returns `user`, `access`, and `refresh` tokens.
- Login: POST `/api/v1/auth/login/` — returns `user`, `access`, and `refresh` tokens.
- Refresh: POST `/api/v1/auth/refresh/` — exchange `refresh` for a new `access`.
- Me: GET `/api/v1/auth/me/` — protected, requires `Authorization: Bearer <access>`.

Notes about registration fields:
- `register` expects: `username`, `email`, `phone`, `password`, `repassword` (password confirmation).

Task model fields (for requests):
- `title` (required)
- `description` (optional)
- `is_done` (boolean)
- `priority` ("LOW", "MEDIUM", "HIGH") — default `MEDIUM`
- `due_date` (YYYY-MM-DD)

Base URLs used in examples below:
- Backend API base: `http://localhost:8000/api/v1/`
- Auth base: `http://localhost:8000/api/v1/auth/`

---
Example requests (curl + Postman-style)

1) Register (create account)

curl:

```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","phone":"+15551234567","password":"Secret123","repassword":"Secret123"}'
```

Postman: POST `http://localhost:8000/api/v1/auth/register/` → Body: raw JSON (above).

Expected response: `201` with JSON: `{"user":{...}, "access":"<access>", "refresh":"<refresh>"}`.

2) Login (get tokens)

curl:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"Secret123"}'
```

Postman: POST `http://localhost:8000/api/v1/auth/login/` → Body: raw JSON.

Response: `200` with a JSON object containing `user`, `access`, and `refresh` tokens.

3) Refresh access token

curl:

```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"<your-refresh-token-here>"}'
```

Postman: POST `http://localhost:8000/api/v1/auth/refresh/` → Body: raw JSON.

Response: JSON with a new `access` token.

4) Get current user (`me`)

curl (replace `<access>`):

```bash
curl -X GET http://localhost:8000/api/v1/auth/me/ \
  -H "Authorization: Bearer <access>"
```

Postman: GET `http://localhost:8000/api/v1/auth/me/` → Headers: `Authorization: Bearer <access>`.

Response: `200` with user info (`id`, `username`, `email`).

5) Create a task (authenticated)

curl:

```bash
curl -X POST http://localhost:8000/api/v1/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access>" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","due_date":"2026-02-10","priority":"HIGH"}'
```

Postman: POST `http://localhost:8000/api/v1/tasks/` → Headers: `Authorization` + JSON body shown above.

Response: `201` with the created task JSON. `owner` is set automatically by the backend.

6) List tasks (authenticated)

curl:

```bash
curl -X GET http://localhost:8000/api/v1/tasks/ \
  -H "Authorization: Bearer <access>"
```

Postman: GET `http://localhost:8000/api/v1/tasks/` with `Authorization` header.

Response: `200` with an array of task objects belonging to the authenticated user.

---
Tips & Troubleshooting
- If you get 401 responses, check that you included `Authorization: Bearer <access>` and that the token hasn't expired.
- Use the `refresh` token endpoint to get a new `access` token.
- The API exposes schema and Swagger UI at `/api/schema/` and `/api/docs/` when running the backend.

If you want, I can also:
- add Postman collection JSON for import
- add example environment variables or a .env example for frontend/backend
