# 📚 Smart Study Planner

**Smart Study Planner** is a full-stack web application designed to help students organize their study routines, track progress, and stay motivated.  
It features secure user authentication, subject and exam management, AI-powered schedule generation, a Pomodoro timer for focused sessions, and analytics dashboards with interactive charts, with **CRUD** functionality
Built for multi-user access, it's responsive, production-ready, and deployable on platforms like **Render.com**.

---

## ✨ Features

### 🧩 Core Functionality

- 🔐 **User Authentication:** Secure signup/login with JWT tokens, password hashing (bcrypt), and protected routes  
![Signup Screenshot](./screenshots/signup.png)

- 🚀 **Dashboard:** Dashboard with stats, today's schedule, and quick actions
![Dashboard Screenshot](./screenshots/dashboard.png)

- 📖 **Subject Management:** Add, edit, delete subjects with syllabus tracking (topics, completion %, priority, difficulty, study time) 
![Subjects Screenshot](./screenshots/subjects.png)

- 📅 **Exam Management:** Add, edit, delete exams with countdowns (days until), preparation status, and linked subjects  
![Exams Screenshot](./screenshots/exams.png)

- 🗓️ **Schedule Generation:** Algorithm prioritizes tasks by exam urgency, completion gaps, and difficulty — generates weekly plans (Mon–Fri, skips weekends)  
![Schedule Screenshot](./screenshots/schedule.png)

- ⏱️ **Pomodoro Timer:** 25-min work / 5-min break cycles with play/pause/reset; logs sessions (topics, duration, productivity) to backend  
![Pomodoro Screenshot](./screenshots/pomodoro.png)

- 📊 **Analytics Dashboard:** Real-time stats (total time, avg productivity, sessions by subject) with Pie (distribution) and Bar/Line (trends) charts  
![Analytics Screenshot](./screenshots/analytics.png)

---

## ⚙️ Tech Highlights

- 👥 **Multi-User:** Data isolated by user ID; shared MongoDB with secure queries  
- 📱 **Responsive UI:** Mobile/desktop optimized with Tailwind CSS, React Router for navigation  
- 💾 **Data Management:** React Query for caching/mutations, Recharts for visualizations  
- 🚀 **Deployment Ready:** Designed for Render.com (frontend/backend) and MongoDB Atlas (database)

---

| Page | Description |
|------|--------------|
| **Dashboard** | Dashboard with stats, today's schedule, and quick actions |
| **Subjects** | Subject cards with progress tracking and management |
| **Analytics** | Analytics with pie/bar charts for sessions and productivity |
| **Pomodoro Timer** | Active Pomodoro session with countdown and tracking |

---

## 🛠️ Tech Stack

### 🧠 Backend
- **Framework:** Express.js (REST APIs, middleware)
- **Database:** MongoDB with Mongoose (Schemas: User, Subject, Exam, StudySession)
- **Authentication:** JWT for tokens, bcrypt for password hashing
- **Dev Tools:** Nodemon, dotenv, CORS

### 💻 Frontend
- **Framework:** React 18 with Vite
- **Styling:** Tailwind CSS (responsive, utility-first)
- **Routing:** React Router v6 (protected routes)
- **State Management:** React Query (queries/mutations, caching)
- **Charts:** Recharts (Bar, Line, Pie)
- **Forms:** React Hook Form + Yup (validation)
- **Icons:** Lucide React
- **Date Utilities:** date-fns

---

## 🚀 Getting Started

### 🧩 Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

---

### ⚙️ Backend Setup

#### Clone & Install
```bash
git clone <your-repo-url>
cd backend
npm install
```

#### Environment Variables
Create `backend/.env`:
```env
PORT=3001
MONGO_URI=mongodb+srv://username:password@cluster0.abcde.mongodb.net/studyplanner?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

#### Run Development Server
```bash
npm run dev
```
Server will be available at: [http://localhost:3001](http://localhost:3001)

#### Test APIs
Use **Postman** or similar tool to test endpoints:
- `POST /api/auth/signup` – Create account  
- `POST /api/auth/login` – Login  
- `GET /api/subjects` – Get subjects (requires auth)

---

### 💻 Frontend Setup

#### Clone & Install
```bash
cd frontend
npm install
```

#### Environment Variables
Create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Run Development Server
```bash
npm run dev
```
App will be available at: [http://localhost:5173](http://localhost:5173)

#### Build for Production
```bash
npm run build
```
Build output will be in `frontend/dist/`.

---

## 📁 Project Structure

### 🧠 Backend
```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── subjectController.js
│   ├── examController.js
│   └── studySessionController.js
├── middleware/
│   └── auth.js
├── models/
│   ├── User.js
│   ├── Subject.js
│   ├── Exam.js
│   └── StudySession.js
├── routes/
│   ├── auth.js
│   ├── subjects.js
│   ├── exams.js
│   └── studySessions.js
├── utils/
│   └── scheduleGenerator.js
├── .env
├── package.json
└── server.js
```

### 💻 Frontend
```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PomodoroTimer.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   └── useApi.js
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Subjects.jsx
│   │   ├── Exams.jsx
│   │   ├── Schedule.jsx
│   │   ├── Pomodoro.jsx
│   │   └── Analytics.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── main.jsx
│   └── router.jsx
├── .env
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🌐 Deployment

### 🖥️ Backend (Render.com)

1. Create a new **Web Service** on Render  
2. Connect your GitHub repository  
3. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
4. Add Environment Variables:
   ```env
   MONGO_URI=<your-mongodb-atlas-uri>
   JWT_SECRET=<your-secret-key>
   NODE_ENV=production
   FRONTEND_URL=<your-frontend-url>
   ```
5. Deploy!

---

### 💫 Frontend Deployment

#### **Option 1: Render.com (Static Site)**
1. Create new **Static Site**  
2. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Add Environment Variable:
   ```env
   VITE_API_BASE_URL=<your-backend-url>/api
   ```

#### **Option 2: Vercel**
```bash
npm install -g vercel
vercel --prod
```

---

### ☁️ MongoDB Atlas Setup

1. Create cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)  
2. Create database user  
3. Whitelist IP: `0.0.0.0/0` (for production)  
4. Get connection string and add to `MONGO_URI`

---

## 🔑 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Subjects
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/subjects` | Get all subjects |
| POST | `/api/subjects` | Create subject |
| PUT | `/api/subjects/:id` | Update subject |
| DELETE | `/api/subjects/:id` | Delete subject |

### Exams
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/exams` | Get all exams |
| POST | `/api/exams` | Create exam |
| PUT | `/api/exams/:id` | Update exam |
| DELETE | `/api/exams/:id` | Delete exam |

### Study Sessions
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | `/api/study-sessions` | Get sessions |
| POST | `/api/study-sessions` | Create session |
| GET | `/api/study-sessions/schedule` | Get schedule |
| GET | `/api/study-sessions/analytics` | Get analytics |

> ⚠️ All endpoints (except `/auth`) require JWT token in the Authorization header.

---

## 🧪 Testing

### Backend
```bash
# Using Postman or curl
curl -X POST http://localhost:3001/api/auth/signup   -H "Content-Type: application/json"   -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Frontend
Run development server and test user flows:
1. Signup → Login  
2. Add subjects → Add exams  
3. View schedule  
4. Start Pomodoro session  
5. Check analytics  

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository  
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### 🧭 Contribution Guidelines
- Follow existing code style  
- Write clear commit messages  
- Update documentation if needed  
- Test your changes thoroughly  

---


## 👨‍💻 Author
**Your Name**  
- GitHub: [@yourusername](https://github.com/yourusername)  
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)  
- Email: [your.email@example.com](mailto:your.email@example.com)

---

## 🙏 Acknowledgments
- **MongoDB** for the database  
- **Render** for hosting  
- **Tailwind CSS** for styling  
- **Recharts** for charts  

---


**Built with ❤️ for students everywhere by Vibhuti.**
