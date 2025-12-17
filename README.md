# Kloudspot Dashboard

A real-time crowd analytics and occupancy monitoring dashboard built with React, TypeScript, and modern web technologies.

![Kloudspot](public/images/logo.png)

## 🚀 Features

- **Real-time Occupancy Monitoring** - Live updates via Socket.io
- **Crowd Analytics** - Track entries, demographics, and dwell time
- **Interactive Charts** - Visualize data with Recharts
- **Responsive Design** - Works on desktop and mobile
- **Type-safe Routing** - TanStack Router for reliable navigation

---

## 📋 Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js) or **yarn**

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/onkkkar/kloudspot.git
cd kloudspot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
VITE_BASE_URL=http://localhost:3000/api/
```

- Replace `http://localhost:3000/api/` with your actual backend server URL.

### 4. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

---

## 🛠️ Tech Stack

| Technology       | Purpose                       |
| ---------------- | ----------------------------- |
| React 19         | UI library                    |
| TypeScript       | Type safety                   |
| Vite             | Build tool & dev server       |
| TanStack Router  | Type-safe file-based routing  |
| TanStack Query   | Data fetching & caching       |
| TailwindCSS 4    | Utility-first styling         |
| Recharts         | Charts & data visualization   |
| Socket.io Client | Real-time WebSocket updates   |
| Axios            | HTTP client with interceptors |

---

## 📁 Project Structure

```
src/
├── api/              # API functions (auth, crowd, overview)
├── components/
│   ├── layout/       # Sidebar, TopNavBar, PageHeader
│   ├── sections/     # Dashboard sections (charts, tables)
│   └── ui/           # Reusable UI components
├── contexts/         # React contexts (Socket alerts)
├── hooks/            # Custom hooks for data fetching
├── pages/            # Page components
├── routes/           # TanStack Router route definitions
├── services/         # Socket.io service
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

---

## 🔧 Code Quality

This project enforces code quality with:

- **ESLint** - Linting for consistent code
- **Prettier** - Automatic code formatting
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters only on staged files

Pre-commit hooks automatically lint and format your code before each commit.

---

## 🚢 Deployment

The project includes a `vercel.json` for easy deployment to Vercel:

```bash
npm run build
```

Then deploy the `dist` folder to your hosting provider.
