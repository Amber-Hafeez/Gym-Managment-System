<div align="center">

# 🏋️ FITZONE

### Gym & Fitness Club Management System

A complete web app for gym front desks to manage members, membership plans, classes, attendance and payments.

**[🌐 Live Demo](<https://gym-managment-system-zhlt.vercel.app/>)** · **[💻 GitHub](<https://github.com/Amber-Hafeez/Gym-Managment-System>)**

</div>

---

## 📖 Overview

FITZONE is a Pakistan-focused gym management system built as a 1-month Full-Stack Web Development Internship project. It replaces paper registers with a fast, responsive dashboard where the gym owner and trainers can run daily operations in one place.

---

## ✨ Features

### 🔐 Authentication & Roles
- Secure login with Supabase Auth (Admin and Trainer roles)
- Trainer signup with admin approval (Approve / Reject)
- Role-based sidebar and protected routes

### 👥 Member Management
- Add, edit, view and delete members
- Member photo upload
- Search members by name or phone
- Member profile with plan, attendance, payments and streak

### 💳 Plans & Payments
- Monthly, Quarterly, Half-Yearly and Yearly plans
- Assign a plan with auto-calculated expiry date
- Mark payments (Cash / Card) and renew plans
- Full payment history per member

### 📅 Classes & Booking
- Admin class schedule (create, edit, cancel)
- Trainer "My Classes" view
- Class booking with automatic waitlist
- Waitlist auto-promotion when a booked member cancels
- Live seat counts with Supabase Realtime

### ✅ Attendance
- One-click member check-in
- Expired members are blocked with a clear message
- Attendance history on each profile

### 📊 Dashboard & Extras
- Active members, expiring-in-7-days list, today's check-ins, monthly revenue
- 🔥 Streak Tracker on member profiles
- 🔔 Fee Reminder Banner when a plan expires within 3 days
- Responsive landing page with plans, gallery, Login and Sign Up

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Backend & Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Security | Row-Level Security (RLS) |
| Live updates | Supabase Realtime |
| File storage | Supabase Storage |
| Data fetching | TanStack Query |
| Deployment | Vercel |

---

## 👤 User Roles

| Role | Access |
| --- | --- |
| Admin | Members, plans, classes, trainers, payments, attendance, dashboard |
| Trainer | Own classes and class attendance |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repo-link>
cd gym-management-system
npm install
```

### 2. Add environment variables

Copy `.env.example` to `.env` and add your Supabase keys:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Set up the database

In the Supabase SQL Editor, run the files in `supabase/migrations/` in order, from `0001` to `0013`:

| Files | Contents |
| --- | --- |
| 0001 - 0007 | Tables (profiles, members, plans, classes, class_bookings, attendance, payments) |
| 0008 | Storage bucket for member photos |
| 0009 | Database functions |
| 0010 | Row-Level Security policies |
| 0011 | Triggers (plan end date, waitlist promotion) |
| 0012 | Constraints |
| 0013 | Admin check for trainer functions |

### 4. Create the Admin account

Create one user in Supabase Auth, then add its row in the `profiles` table with role `admin`.

### 5. Run the app

```bash
npm run dev
```

---

## 📁 Folder Structure

```
gym-management-system/
├── src/
│   ├── components/    reusable UI pieces
│   ├── pages/         one folder per screen
│   ├── hooks/         TanStack Query hooks
│   └── lib/           supabaseClient.js
├── supabase/
│   └── migrations/    SQL files (tables, policies, functions, triggers)
├── .env.example
├── vercel.json
└── README.md
```

---

## ☁️ Deployment

The frontend is deployed on Vercel. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Vercel project's Environment Variables. `vercel.json` rewrites all routes to the app so page refresh works on every page.

---

## 🧑‍💻 Developer

Full-Stack Web Development Internship Project developed by **Sawaiba Amber**.

---

## 📋 Developer Responsibilities

- Frontend development.
- Responsive UI implementation.
- Supabase authentication and database setup.
- Row-Level Security policies and database functions.
- Real-time class booking with waitlist logic.
- Image upload with Supabase Storage.
- Testing and debugging.
- GitHub version control.
- Deployment and documentation.

---

## 📄 License

This project is developed for educational, internship, and portfolio purposes.

License details may be updated in the future.