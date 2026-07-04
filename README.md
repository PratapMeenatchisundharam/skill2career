# Skill2Career — AI Career Guidance Agent

A full-stack career guidance web app: skill-based job search, company-specific ATS resume generation,
interview preparation, a resume builder with PDF/Word export, bookmarks, applied-job tracking, and
AI-powered career guidance.

## Tech Stack

- **Frontend:** React 18 (Vite), React Router
- **Backend:** Node.js + Express
- **Database:** Lightweight file-based JSON store (`backend/data/db.json`) — **no MongoDB installation required**, so the project runs immediately. (See "Switching to MongoDB" below if you want to use it instead.)
- **Auth:** JWT + bcrypt
- **AI:** Built-in rule-based career guidance out of the box; automatically switches to the real OpenAI API if you add a key (see below)
- **Resume export:** `pdfkit` (PDF) and `docx` (Word)
- **Jobs data:** Curated mock dataset (`backend/data/jobs.json`) simulating a real job-search API — swap in a real provider (Adzuna, JSearch, LinkedIn) later by editing `backend/routes/jobs.js`

## Project Structure

```
skill2career/
├── backend/          Express API (port 5000)
│   ├── data/          Mock jobs/companies/courses + auto-created db.json
│   ├── middleware/     JWT auth middleware
│   ├── routes/         auth, jobs, companies, resume, bookmarks, applied, courses, ai
│   ├── utils/          db helper, resume PDF/DOCX generator, AI service
│   └── server.js
└── frontend/         React + Vite app (port 5173)
    └── src/
        ├── pages/       Login, Register, Dashboard, JobSearch, InterviewPrep, ResumeBuilder, Bookmarks, AppliedJobs
        ├── components/  Navbar, JobCard, CursorEffect, PrivateRoute
        ├── context/      AuthContext (JWT storage)
        └── styles/       index.css (theme + animations)
```

## Quick Start (first-time setup)

You need **Node.js 18+** installed. Then, from the project root in VS Code's terminal:

```bash
# 1. Install dependencies for both frontend and backend
npm run setup
```

Then run both servers (use two terminals):

**Terminal 1 — backend:**
```bash
cd backend
npm run start
```
Runs on http://localhost:5000

**Terminal 2 — frontend:**
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173 — open this URL in your browser.

### Optional: run both with one command

From the project root:
```bash
npm run install:all  # installs backend + frontend deps
npm run dev           # runs both servers together
```

Alternatively, on Windows, you can use the helper scripts:
```cmd
setup.bat
run-dev.bat
```

> If PowerShell says the path does not exist when you type `cd backend`, you are already inside the backend folder. From the project root, use the commands above instead of changing directories a second time.

> If the backend is running alone, `http://localhost:5000/` may show `Cannot GET /` because this server only exposes API routes. Open `http://localhost:5173/` to use the React UI.

## Using the App

1. **Register** a new account (Full Name, Email, Password) — stored securely with a bcrypt-hashed password.
2. On the **Dashboard**, add your skills and preferred role.
3. Use **Job Search** to find openings matching your skills, with company location and salary estimates.
4. Use **Resume Builder** to enter your education/experience/projects, target a specific company, and generate an ATS-friendly resume — download as PDF or Word.
5. Use **Interview Prep** to view technical + HR questions, tips, and sample answers for any company (curated data for Google, Amazon, Microsoft, TCS, Infosys, Adobe, Wipro; a smart generic set is created automatically for any other company name).
6. **Bookmark** jobs and **track applications** from the Job Search page; view them under Bookmarks / Applied.
7. Ask the **AI Career Guide** on the Dashboard for personalized advice.

## Enabling Real AI Responses (optional)

By default, `getCareerGuidance` in `backend/utils/aiService.js` returns smart, rule-based guidance — the feature works with zero configuration. To use live OpenAI responses instead:

1. Open `backend/.env`
2. Set `OPENAI_API_KEY=your_key_here`
3. Restart the backend server

## Switching to MongoDB (optional)

This project ships with a simple JSON file database so it runs with zero setup. If you'd like to use real MongoDB instead:
1. Install `mongoose`: `npm install mongoose --prefix backend`
2. Replace the functions in `backend/utils/db.js` with Mongoose models/queries
3. Add `MONGODB_URI` to `backend/.env` and connect in `server.js`

## Notes

- All data (users, resumes, bookmarks, applied jobs) is stored in `backend/data/db.json`, created automatically on first run.
- Job listings and company interview data are curated mock datasets designed to demonstrate the full feature set. Swap in a real job-search API key (Adzuna/JSearch) inside `backend/routes/jobs.js` when ready for production data.
