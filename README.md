<div align="center">

# 🗞️ MyET AI — The Autonomous Personal Newsroom
**An AI-native, multi-agent powered news platform built for The Economic Times Hackathon (GenAI Track).**

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.3-teal?logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

MyET AI reconstructs the news consumption experience by running live business news through a **3-step autonomous agent pipeline** — Entity Extraction → Sentiment Tagging → Persona Relevance Scoring — before delivering it to a dynamic dashboard.

---

## ⚙️ Prerequisites

Before running this project, ensure you have the following installed on your machine:

| Tool | Minimum Version | Check Command |
|---|---|---|
| **Node.js** | v18+ | `node -v` |
| **npm** | v9+ | `npm -v` |
| **Git** | Any | `git --version` |

---

## 🚀 How to Run the Application

### Step 1 — Clone the Repository
```bash
git clone https://github.com/saipranathi5926/ET_Genai.git
cd ET_Genai
```

### Step 2 — Install Dependencies
```bash
npm install
```
> This will install React, Vite, Tailwind, Lucide icons, and all other packages defined in `package.json`. Takes about 30–60 seconds.

### Step 3 — Start the Development Server
```bash
npm run dev
```
> The application will launch on **http://localhost:5173**

To expose it on your local network (for testing on mobile / other devices):
```bash
npm run dev -- --host
```

### Step 4 — Open in Browser
Navigate to:
```
http://localhost:5173
```

You will be greeted by the **Login Wall**. Click **LOGIN** or **Continue with Gmail** to access the full dashboard.

---

## 📦 Build for Production

```bash
npm run build
```
The optimised production bundle will be generated in the `dist/` folder.

To preview the production build locally:
```bash
npm run preview
```

---

## 🗂️ Project Structure

```
ET_Genai/
├── src/
│   ├── App.tsx              # Main application — all UI modules & state
│   ├── agent.ts             # Autonomous agent pipeline (3-step NLP)
│   ├── data.ts              # Raw mock data + live fetchRealNews() API call
│   ├── main.tsx             # React DOM entry point
│   └── index.css            # Tailwind base styles
├── index.html               # HTML entry shell
├── vite.config.ts           # Vite build configuration
├── tailwind.config.js       # Tailwind custom theme
├── tsconfig.json            # TypeScript configuration
├── Architecture_Document.md # Agent design & system architecture
├── Impact_Model.md          # Quantified business impact analysis
└── README.md                # This file
```

---

## 🧩 Key Modules

| Module | Description |
|---|---|
| **🔒 Auth Wall** | Login screen with Gmail SSO, email/password, and logout flow |
| **📰 MyET Newsroom** | Live API news filtered by Markets / Tech / Startups categories |
| **💬 NewsNavigator** | AI synthesis chat for in-depth story exploration |
| **🎬 AI Video Studio** | Browser Text-to-Speech converting articles into audio briefs |
| **📈 StoryArc Tracker** | Visual timeline of developing multi-event narratives |
| **🌐 Vernacular Engine** | Regional language localization (Hindi, Tamil, Telugu, Bengali) |

---

## 🌐 Live Data Source

The platform pulls real-time Indian business news from:
```
https://saurav.tech/NewsAPI/top-headlines/category/business/in.json
```
If this endpoint is unavailable, the pipeline **automatically falls back** to the rich offline mock data — no errors or blank states.

---

## 📄 Hackathon Submission Documents

*   [Architecture Document](./Architecture_Document.md) — Agent roles, pipeline diagram, error handling
*   [Impact Model](./Impact_Model.md) — Quantified business impact (cost, revenue, time saved)
