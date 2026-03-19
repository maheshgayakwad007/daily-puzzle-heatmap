# 🧩 Logic Looper: 365 Days of Pure Logic

[![Logic Looper - Daily Puzzle Engine](https://img.shields.io/badge/Logic--Looper-Demo--Ready-blue?style=for-the-badge&logo=react)](https://github.com/maheshgayakwad007/daily-puzzle-heatmap)
[![Performance - Lighthouse](https://img.shields.io/badge/Lighthouse-90+-green?style=for-the-badge)](https://github.com/maheshgayakwad007/daily-puzzle-heatmap)

**Logic Looper** is an engaging daily puzzle game designed to train your brain while keeping you motivated with a GitHub-style streak system. Built with an **Offline-First** philosophy, it ensures your data remains secure and accessible anywhere, even without an internet connection.

---

## 🚀 Core Features

- **🧠 Deterministic Puzzle Engine**: Every day, a brand-new, unique logic puzzle is generated using a `SHA256` date-seed. Everyone in the world solves the same challenge simultaneously.
- **📊 GitHub-Style Heatmap**: Visualize your year-long activity with an interactive 365-day grid. See your progress through five levels of intensity.
- **🔥 Persistence & Streaks**: Real-time streak calculation that rewards daily engagement.
- **💾 Offline-First Architecture**: Powered by **IndexedDB**, your scores are saved locally and automatically synced to the cloud once you're back online.
- **🌗 Multi-Theme UX**: Seamlessly toggle between **Day Mode** (for bright mornings) and **Dark Mode** (for midnight training).

---

## 🏗️ Technical Stack

- **Frontend**: React 19 + Vite (Ultra-fast HMR)
- **Styling**: Tailwind CSS v3 (Clean, responsive, utility-first)
- **Animations**: Framer Motion (Smooth transitions and hover effects)
- **State/Logic**: 
  - `Day.js` for date management.
  - `Crypto-JS` for secure, deterministic seeding.
  - `IDB` for advanced IndexedDB operations.
- **Backend (Minimalist)**: 
  - `Node.js` + `Express`
  - `Prisma ORM`
  - `PostgreSQL` (Neon Serverless compatible)

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn

### 2. Frontend Installation (Root)
```bash
git clone https://github.com/maheshgayakwad007/daily-puzzle-heatmap.git
cd daily-puzzle-heatmap
npm install
npm run dev
```

### 3. Backend Setup (Optional for Sync)
```bash
cd backend
npm install

# Setup your Environment Variables in .env
# DATABASE_URL="your-postgresql-url"

npx prisma db push
npm start
```

---

## 🧩 Game Modules

### **Module 1 – Puzzle Engine**
Generates daily challenges including **Numeric Magic Grids**, **Binary Logic Circuits**, and **Complex Sequences**. Every puzzle includes a hint system that affects your final score.

### **Module 2 – Heatmap & Streaks**
A dynamic 365-day visualization engine.
- `Level 0`: No activity
- `Level 1`: Solved (Basic score)
- `Level 4`: Perfect Score (Speed + No Hints)

### **Module 3 – Sync Logic**
Built-in background sync listener that monitors `navigator.onLine`. Queues offline activity and pushes to the Express/Prisma API automatically when internet returns.

---

## 🎯 Executive Objective
Designed as a **retention engine** and **engagement system**, Logic Looper demonstrates a server-cost-optimized model where high-performance logic executes in the browser, while only critical high-scores are synced to the cloud.

---

**Developed for the Feb 16 Presentation Standard.** 🚀
