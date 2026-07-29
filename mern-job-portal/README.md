# 🚀 The Talent Hub — MERN Job Portal

<p align="center">
  A modern full-stack job portal built with the <b>MERN Stack</b>, enabling applicants to find jobs and employers to manage recruitment efficiently.
</p>

---

## 📌 Overview

**The Talent Hub** is a responsive job portal that connects **Job Seekers** with **Employers** through a secure and user-friendly platform.

The application provides authentication, job posting, resume uploads, applicant tracking, employer dashboards, company profiles, and much more.

---

# ✨ Features

## 👨‍💼 Applicant Features

* 🔐 Secure JWT Authentication
* 🔍 Search & Filter Jobs
* 💾 Save Favorite Jobs
* 📄 Upload Resume (PDF/DOC/DOCX)
* 📝 Apply with Cover Letter
* 📊 Track Application Status
* 👤 Manage Personal Profile
* 📱 Responsive UI

---

## 🏢 Employer Features

* 🔐 Secure Employer Login
* 📝 Create Job Listings
* ✏️ Edit & Delete Jobs
* 🔓 Open / Close Job Vacancies
* 👥 View Applicants
* 📄 Download Applicant Resumes
* 📈 Manage Hiring Pipeline
* 🏢 Company Profile & Logo Upload

---

# 🛠 Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* React Router
* Axios
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* bcrypt

---

# 📂 Project Structure

```text
mern-job-portal/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/
│   ├── context/
│   └── App.jsx
│
└── README.md
```

---

# 🔑 Authentication

* Applicant Login
* Employer Login
* JWT Authentication
* Protected Routes
* Role-Based Authorization

---

# 💼 Job Management

### Applicants

* Browse Jobs
* Search Jobs
* Filter Jobs
* Save Jobs
* Apply Jobs

### Employers

* Post Jobs
* Edit Jobs
* Delete Jobs
* Open/Close Jobs
* Manage Applicants

---

# 📄 Resume Management

Applicants can

* Upload Resume
* Replace Resume
* Submit Resume while Applying

Supported Formats

* PDF
* DOC
* DOCX

Maximum File Size

* 5 MB

---

# 🏢 Company Profile

Employers can

* Upload Company Logo
* Company Description
* Website
* Company Information

Displayed directly on job cards.

---

# 📊 Application Workflow

```text
Submitted
      │
      ▼
Under Review
      │
      ▼
Interview
      │
      ├────────► Hired
      │
      └────────► Rejected
```

---

# 🌐 REST API

## Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |
| GET    | /api/auth/me       |
| PUT    | /api/auth/me       |

---

## Jobs

| Method | Endpoint       |
| ------ | -------------- |
| GET    | /api/jobs      |
| GET    | /api/jobs/:id  |
| POST   | /api/jobs      |
| PUT    | /api/jobs/:id  |
| DELETE | /api/jobs/:id  |
| GET    | /api/jobs/mine |

---

## Applications

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | /api/applications/job/:jobId |
| GET    | /api/applications/mine       |
| GET    | /api/applications/job/:jobId |
| PUT    | /api/applications/:id/status |

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/fareehaihsan7/jobportal.git
```

---

## Backend

```bash
cd backend
npm install
```

Create a `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run Server

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# 📷 Screenshots

Add screenshots here.

```
Landing Page

Employer Dashboard

Job Listings

Applicant Dashboard

Employer Profile

Saved Jobs

Login/Register
```

---

# 🚀 Future Improvements

* AI Resume Analyzer


---

# 🔒 Security

* Password Hashing (bcrypt)
* JWT Authentication
* Protected APIs
* Role-Based Authorization
* Secure File Upload Validation

---

# 📱 Responsive Design

Optimized for

* Desktop
* Laptop
* Tablet
* Mobile

---

# 👩‍💻 Author

**Fareeha Ihsan**

MERN Stack Developer

GitHub:
https://github.com/fareehaihsan7

---

# ⭐ Support

If you like this project,

⭐ Star the repository

🍴 Fork it

🐞 Report Issues

💡 Contribute Improvements

---

<p align="center">
Made  using the MERN Stack
</p>
