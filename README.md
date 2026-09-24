# KeffaCode

A programming learning and practice platform: short tutorials, coding problems with
a browser editor and real test cases, saved progress, and an admin dashboard for
adding content.

It is inspired by the _shape_ of sites like GeeksforGeeks — read → practice → submit →
track progress — but the design, code and content here are original. Do not paste in
another site's articles, images or branding.

**Stack:** React + React Router + Tailwind CSS · Node.js + Express · PostgreSQL

---

## Run it locally

### 1. Database

With Docker:

```bash
docker compose up -d
```

Or create the database yourself in an existing PostgreSQL install:

```bash
createdb keffacode
```

### 2. API

```bash
cd server
cp .env.example .env        # then set DATABASE_URL and JWT_SECRET
npm install
npm run db:setup            # creates tables and loads demo content
npm run dev                 # http://localhost:4001
```

Seeded accounts:

| Role    | Email                | Password    |
| ------- | -------------------- | ----------- |
| admin   | admin@keffacode.rw   | admin1234   |
| learner | learner@keffacode.rw | learner1234 |

### 3. Web app

```bash
cd client
npm install
npm run dev                 # http://localhost:5173
```

Vite proxies `/api` to the API, so no base URL appears in the components.

---

## How it fits together

```
client/                      React + Tailwind
  src/
    context/AuthContext.jsx  token in localStorage, current user, login/register/logout
    lib/api.js               the only place that calls fetch
    components/              Navbar, CodeEditor, Markdown, Difficulty, CategoryRail
    pages/                   Home, Tutorials, Problems, Profile, Admin, Search, auth

server/                      Express + pg
  db/schema.sql              tables
  db/setup.js                schema + demo tutorials, problems and test cases
  src/lib/db.js              pg pool
  src/lib/runner.js          runs submitted code in a child process with a timeout
  src/middleware/auth.js     JWT signing, requireAuth, requireAdmin
  src/routes/                auth, tutorials, problems, categories, search, profile, admin
```

### Data model

`users` → `submissions` ← `problems` → `test_cases`
`categories` → `tutorials` → `tutorial_progress` ← `users`

### API

| Method          | Path                                                    | Who       |
| --------------- | ------------------------------------------------------- | --------- |
| POST            | `/api/auth/register`, `/api/auth/login`                 | anyone    |
| GET             | `/api/auth/me`                                          | signed in |
| GET             | `/api/categories`                                       | anyone    |
| GET             | `/api/tutorials`, `/api/tutorials/:slug`                | anyone    |
| POST            | `/api/tutorials/:slug/complete`                         | signed in |
| GET             | `/api/problems`, `/api/problems/:slug`                  | anyone    |
| POST            | `/api/problems/:slug/run`, `/api/problems/:slug/submit` | signed in |
| GET             | `/api/search?q=&type=`                                  | anyone    |
| GET             | `/api/profile`                                          | signed in |
| GET             | `/api/admin/stats`, `/api/admin/users`                  | admin     |
| POST/PUT/DELETE | `/api/admin/tutorials`, `/api/admin/problems`           | admin     |

---

## Read this before you deploy

`server/src/lib/runner.js` executes learner-submitted JavaScript in a child Node
process with an empty environment and a 2-second kill timer. That is enough for a
classroom on a trusted network. It is **not** enough for the public internet: the
child can still read the filesystem and open sockets.

Before opening it up, run the child inside a container with no network, a read-only
filesystem and memory/CPU limits (Docker, gVisor or Firecracker), or hand execution
to a service built for it (Judge0, Piston). The function signature of `runTests`
stays the same — only the `spawn` call changes.

Two other things to do before production: move the JWT out of `localStorage` into an
httpOnly cookie, and rate-limit `/run` and `/submit`.

## Where to take it next

- More languages: store a `language` column on submissions and add a runner per language
- Discussion threads under each problem
- Editorial solutions unlocked after a passing submission
- A submissions history page with the code of each attempt
- Full-text search using the `tsvector` indexes already in `schema.sql` instead of `ILIKE`
