# 🏛️ Heritage Learning Hub
### A Digital Platform for Indian Culture, History & Heritage Education

> **Tagline:** *"Discover. Learn. Preserve. Celebrate India's Heritage."*

---

## 📌 Executive Overview

**Heritage Learning Hub** is an advanced, full-stack digital educational platform engineered to preserve, celebrate, and teach Indian cultural heritage. Built to the standards of national cultural bodies, it provides authentic, curriculum-aligned, and verifiable knowledge about India's monumental architecture, living traditions, classical performing arts, and ancient civilizations.

Every heritage record on this platform is backed by official sources including the **Archaeological Survey of India (ASI)**, **UNESCO World Heritage Centre**, and the **Ministry of Culture, Government of India**.

---

## 🌟 Key Features & Functional Modules

### 1. 🏛️ Public Discovery & Heritage Catalog
- **Central Monumental Repository:** In-depth documentation of UNESCO World Heritage Sites (Taj Mahal, Ajanta Caves, Konark Sun Temple, Hampi, Rani ki Vav, Dholavira, etc.) and Intangible Cultural Heritage (Garba of Gujarat, Durga Puja of Kolkata, Bharatanatyam, Madhubani Folk Art).
- **Search & Multi-Dimensional Filtering:** Real-time search across names, dynasties, and periods; filter by Category (Monuments, Festivals, Traditions, Architecture, Art and Crafts, Historical Events) and Indian States.
- **Detailed Heritage Dossier:** High-resolution imagery, architectural taxonomy, historical time period, cultural significance, bulleted archaeological facts, and direct links to government research portals.
- **Personal Bookmarking:** Authenticated bookmarking with instant toast notifications and cross-session persistence.

### 2. 📚 Academic Learning Modules & Pedagogy
- **Topic-Wise Curriculums:** Deep-dives into Nagara vs. Dravidian Temple Architecture, Bronze Age Harappan Engineering, and Vedic Chanting traditions.
- **Interactive Lesson Reader:** Multi-lesson viewer featuring summaries, estimated reading times, and curriculum key takeaways.
- **Downloadable NCERT & ASI Study Materials:** Direct access to official syllabus chapters, field trip manuals, and dossiers.

### 3. 🎯 Interactive Quiz & Assessment Engine
- **Categorized Tests:** Quizzes across varying difficulties (*Easy*, *Medium*, *Hard*) with countdown timers.
- **Automatic Scoring & Explanations:** Real-time percentage calculation, pass/fail thresholds, and comprehensive question-by-question historical explanations.
- **Academic Progress Tracking:** Quiz scores and timestamps saved directly to the database.

### 4. 🎓 Personalized Student Dashboard
- **Scholar Profile:** Visualizes academic grade, school/institution, and earned achievement badges (*Temple Architecture Explorer*, *Quiz Champion*, *Platform Guardian*).
- **Analytics Visualizations:** Interactive **Recharts** charts showing historical quiz score trajectories.
- **Recently Explored & Bookmarks:** Quick-resume browsing for saved monuments and lesson modules.

### 5. 👨‍🏫 Teacher & Faculty Portal
- **Educational Learning Plans:** Interactive lesson planner for designing custom curricula, assigning study modules, and establishing learning goals.
- **Classroom Resource Hub:** Syllabi, architectural blueprints, and classroom handouts.
- **Question Bank Inspection:** Review question sets for student assignments.

### 6. 🛡️ Executive Administration Console
- **Platform Analytics:** Real-time KPI counters (Total Users, Students, Teachers, Heritage Records, Modules, Quizzes).
- **Visual Analytics:** Dynamic domain breakdown bar chart and state geographic coverage pie chart.
- **Content Management System (CRUD):** Add, update, and remove heritage entries with official source citations.
- **Role-Based Access Control (RBAC):** Search user accounts, toggle roles (`student`, `teacher`, `admin`), and activate/suspend accounts.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React.js (Vite), Tailwind CSS, React Router v6, Lucide React Icons, Axios, React Hot Toast, Recharts |
| **Backend** | Node.js, Express.js, RESTful Architecture, CORS, Morgan |
| **Database** | MongoDB with Mongoose (Dual-mode resilient engine with persistent storage fallback) |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs password hashing, RBAC Middleware |
| **Design Aesthetics** | Indian Heritage Theme: Deep Royal Blue (`#0F2C59`), Saffron Orange (`#EA580C`), Heritage Gold (`#D4AF37`), Cream (`#FDFBF7`) |

---

## 🚀 Getting Started & Installation

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)
- **MongoDB** (Local instance on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI in `.env`)

### Step 1: Install Dependencies
From the project root:
```bash
npm run install:all
```
*(Or install individually: `cd backend && npm install`, then `cd frontend && npm install`)*

### Step 2: Database Setup & Seeding
Seed the database with authentic Indian monuments, modules, quizzes, and demo accounts:
```bash
npm run seed
```

### Step 3: Launch the Application
Start the backend server:
```bash
npm run server
```
*(Backend runs on `http://localhost:5000`)*

In a separate terminal, start the frontend client:
```bash
npm run client
```
*(Frontend runs on `http://localhost:5173`)*

---

## 🔑 Demo Test Accounts

For demonstration, academic presentations, or grading, use these pre-seeded credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@heritagehub.in` | `Admin@12345` | Full administrative console, content CRUD, user management |
| **Teacher** | `teacher@heritagehub.in` | `Teacher@123` | Educator portal, lesson plans, teaching materials |
| **Student** | `student@heritagehub.in` | `Student@123` | Student dashboard, quiz assessments, personal bookmarks |

*(You can also use the **Quick Academic Test Account** buttons on the Login page for one-click access!)*

---

## 🏛️ Authentic Official Source References

All heritage data is cross-referenced with authorized national portals:
- **Ministry of Culture, Government of India**: [https://indiaculture.gov.in/](https://indiaculture.gov.in/)
- **Archaeological Survey of India (ASI)**: [https://asi.nic.in/](https://asi.nic.in/)
- **UNESCO World Heritage Centre**: [https://whc.unesco.org/](https://whc.unesco.org/)
- **UNESCO Intangible Cultural Heritage**: [https://ich.unesco.org/](https://ich.unesco.org/)
- **Incredible India Portal**: [https://www.incredibleindia.gov.in/](https://www.incredibleindia.gov.in/)
- **Indian Culture Digital Repository**: [https://www.indianculture.gov.in/](https://www.indianculture.gov.in/)

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student or teacher account
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/profile` - Get logged-in user profile (`Bearer <token>`)
- `PUT /api/auth/profile` - Update bio, institution, or avatar

### Heritage Catalog (`/api/heritage`)
- `GET /api/heritage` - Query heritage catalog (supports `search`, `category`, `state`, `sort`, `page`, `limit`)
- `GET /api/heritage/meta/filters` - Fetch unique categories and Indian states
- `GET /api/heritage/:id` - Retrieve single heritage record & related items
- `POST /api/heritage` - *(Admin)* Create heritage record with source citations
- `PUT /api/heritage/:id` - *(Admin)* Update heritage record
- `DELETE /api/heritage/:id` - *(Admin)* Delete heritage record

### Learning Modules (`/api/modules`)
- `GET /api/modules` - Browse subject modules (filter by `category`, `level`, `search`)
- `GET /api/modules/:id` - Retrieve module details, lesson list, and PDFs
- `POST /api/modules` - *(Teacher/Admin)* Create new educational module

### Interactive Quizzes (`/api/quizzes`)
- `GET /api/quizzes` - List available quizzes
- `GET /api/quizzes/:id` - Retrieve quiz questions for test-taking
- `POST /api/quizzes/:id/submit` - Submit answers, calculate score, and record progress

### Academic Progress & Bookmarks
- `GET /api/progress` - Student progress metrics, quiz history, recent views
- `POST /api/progress/complete-module` - Mark a module as completed
- `POST /api/progress/recent-view` - Track recently viewed monument
- `GET /api/bookmarks` - Retrieve user bookmarks
- `POST /api/bookmarks` - Save monument to bookmarks
- `DELETE /api/bookmarks/:heritageId` - Remove monument from bookmarks

### Administration Console (`/api/admin`)
- `GET /api/admin/dashboard` - High-level counts, category distribution, state statistics
- `GET /api/admin/users` - Search & filter all registered users
- `PUT /api/admin/users/:id` - Modify user role or toggle account active status

---

## 📁 Project Directory Structure

```
Heritage-Learning-Hub/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & resilient fallback
│   ├── controllers/
│   │   ├── adminController.js    # Executive dashboard & user management
│   │   ├── authController.js     # JWT auth, registration, profile
│   │   ├── bookmarkController.js # Heritage bookmarking
│   │   ├── heritageController.js # Heritage catalog & CRUD
│   │   ├── moduleController.js   # Learning modules & lesson plans
│   │   ├── progressController.js # Progress tracking & completed lessons
│   │   └── quizController.js     # Quiz assessments & automated scoring
│   ├── data/
│   │   └── seedData.js           # Verified Indian heritage dataset & users
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & RBAC authorization
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/                   # Mongoose schemas & data entities
│   │   ├── Bookmark.js
│   │   ├── Heritage.js
│   │   ├── LearningModule.js
│   │   ├── Progress.js
│   │   ├── Quiz.js
│   │   └── User.js
│   ├── routes/                   # Express REST route definitions
│   ├── services/
│   │   └── storage.js            # Unified data access adapter
│   ├── utils/
│   │   └── seeder.js             # Database seeder script
│   ├── .env.example
│   ├── package.json
│   ├── server.js                 # Express application entry point
│   └── test-api.js               # Automated E2E API integration suite
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, ProtectedRoute
│   │   │   ├── heritage/         # HeritageCard
│   │   │   └── quiz/             # QuizCard, QuizPlayer
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global auth state & token storage
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── AboutPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ExploreHeritagePage.jsx
│   │   │   ├── HeritageDetailsPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LearningResourcesPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   └── TeacherDashboard.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # React Router routes
│   │   ├── index.css             # Tailwind CSS & heritage aesthetics
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── package.json                  # Root orchestration scripts
└── README.md
```

---

## 🛡️ License

This academic project is licensed under the MIT License. Developed for cultural preservation and national heritage learning.
