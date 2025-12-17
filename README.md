# Kloudspot

A React + TypeScript application built with Vite, TanStack Router, and TailwindCSS.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Kloudspot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start development server     |
| `npm run build`        | Build for production         |
| `npm run preview`      | Preview production build     |
| `npm run lint`         | Run ESLint                   |
| `npm run typecheck`    | Run TypeScript type checking |
| `npm run format`       | Format code with Prettier    |
| `npm run format:check` | Check code formatting        |

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching & caching
- **TailwindCSS 4** - Styling
- **Recharts** - Charts & data visualization
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client

## Code Quality

This project uses:

- **ESLint** - Linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Run linters on staged files

Pre-commit hooks automatically run linting and formatting on staged files.
