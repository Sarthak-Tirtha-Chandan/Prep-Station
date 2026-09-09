# 🎓 GATE PrepStation

> A distraction-free, minimalist web application designed for GATE examination preparation. Features subject-organized study notes, interactive Previous Year Questions (PYQs) with revealable solutions, Pomodoro focus timer with audio cues, to-do checklist with modal task creation, exam reminders, and MongoDB database integration.

---

## 🚀 Quick Start

### 1. Start Both Backend & Frontend
From the root directory:
```bash
# In Terminal 1 (Start Backend Server):
cd server
npm start

# In Terminal 2 (Start Frontend Client):
cd client
npm run dev
```

The application will be live at: **[http://localhost:5173](http://localhost:5173)**

---

## 🗄️ MongoDB Database Integration

Upon first opening the application (or by clicking the **MongoDB Status Pill** in the top navigation bar), a setup modal prompts you to configure your MongoDB connection:

1. **MongoDB Atlas (Cloud)**:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/gate_prep?retryWrites=true&w=majority
   ```
2. **Local MongoDB**:
   ```
   mongodb://localhost:27017/prepstation
   ```

- **Live Testing**: Click **Connect & Save** to test and persist your database connection.
- **Seed Sample GATE Data**: Click **Seed Sample Data** to automatically populate verified high-yield GATE notes and authentic PYQs.
- **Resilient Dual-Engine**: If MongoDB is not yet configured or temporarily offline, the app automatically runs in **Local Storage Mode** with full functionality!

---

## 🌟 Key Features

### 1. 📚 Subject Notes Section
- Organized across core GATE subjects (Data Structures & Algorithms, Operating Systems, Computer Networks, DBMS, Theory of Computation, Computer Architecture, etc.).
- Split-screen reading view with high-yield formula callouts, one-click formula copying, key takeaways, and tricky traps.
- Search and filter by topic or high-yield tags.
- Modal to create and edit custom notes.

### 2. ❓ GATE Previous Year Questions (PYQs)
- Filter by Subject and Year (GATE 2024 to 2020).
- Interactively test yourself on MCQs/NATs.
- **Reveal Answer & Explanation**: Smooth toggle reveals the official answer and step-by-step mathematical/conceptual derivations.
- Mark questions as **Mastered** (with celebratory confetti) or bookmark for revision.
- Add your own practice questions via popup form.

### 3. ⏱️ Focus Timer (Pomodoro)
- Presets: **Study Focus (25m)**, **Short Break (5m)**, and **Long Break (15m)**.
- Start, Pause, Reset, and Skip controls with an SVG circular progress ring.
- Web Audio API gentle bell chimes upon session completion.
- Tag study sessions with specific GATE subjects to track daily focus time.
- Persistent across tab navigation (shows live countdown in the header).

### 4. ✅ To-Do Checklist
- Daily goals and syllabus coverage tracker with a completion progress bar.
- Popup input modal to add tasks with priority (Urgent, High, Medium, Low), subject tag, and target date.
- One-click task completion and delete controls.

### 5. 🔔 Study Reminders
- Schedule reminders for test series, revision cycles, formula flashcards, and exam milestones.
- Real-time status tags: *Today*, *Tomorrow*, *In N days*, or *Overdue*.
- Category filtering and completion management.
