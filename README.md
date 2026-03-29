<div align="center">
  <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200" alt="MyET AI Banner" />

# MyET AI: The Autonomous Personal Newsroom
**A dynamic, autonomous multi-agent pipeline built for The Economic Times.**

</div>

## 📌 Overview
MyET AI completely reconstructs the modern news consumption experience. By leveraging an autonomous multi-agent pipeline, live business news is retrieved, analyzed by simulated LLMs, tagged for financial sentiment, and mapped to user-specific personas (e.g., "Mutual Fund Investor" vs "Startup Founder").

### 🚀 Key Features

*   **📰 Personalized Newsroom:** Dynamic article ranking based on real-time agentic analysis of live API responses.
*   **💬 NewsNavigator:** Conversational AI synthesis interface allowing users to investigate underlying news themes.
*   **🎬 AI News Video Studio:** Browser-native Text-To-Speech (TTS) automatically synthesizing written articles into short-form broadcast formats.
*   **📈 StoryArc Tracker:** Visual flow of developing, high-impact localized narratives.
*   **🌐 Vernacular Engine:** Cultural localization pipeline seamlessly translating complex financial events into regional Indian languages.
*   **🔒 Authentication Wall:** A seamlessly animated layout accurately mirroring *The Hindu* / *Economic Times* styled login flows, replete with dynamic Google SSO templating.

---

## 📸 Application Screenshots

*(Tip: You can replace these placeholder image links with actual screenshots of your local application running! Just save your screenshots into the `/public` folder and link them here as `![Login Screen](/login-screenshot.png)`)*

### 1. The Seamless Authentication Wall
![Login Interface Placeholder](https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=800)
> *A perfectly replicated, high-fidelity premium login modal gating the Live API context.*

### 2. Autonomous Persona Dashboard
![Dashboard Placeholder](https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800)
> *The resulting feed after the Live News is autonomously evaluated, sentiment-tagged, and ranked for the user.*

### 3. AI Video Studio & Vernacular Engine
![Video Studio Placeholder](https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800)
> *Real-time Text-to-Speech transforming translated regional market updates into audible briefs.*

---

## 🛠️ Architecture

```mermaid
graph TD
    User([End User]) -->|Login/Auth| FrontEnd[React Frontend App]
    FrontEnd -->|Fetch Request| API[Live News API <br/> saurav.tech Business]
    API -.->|JSON Response| FrontEnd
    
    subgraph Autonomous Agentic Pipeline
        direction TB
        Orchestrator{Orchestrator Agent}
        Agent1[Entity Extraction Agent]
        Agent2[Sentiment & Trend Agent]
        Agent3[Persona Relevance Agent]
        Orchestrator --> Agent1 --> Agent2 --> Agent3
    end
    
    FrontEnd -->|Feeds raw data| Orchestrator
    Agent3 -->|Processed News Data| Modules
    Modules --> Mod1[MyET Newsroom Feed]
```

## 💻 Tech Stack
*   **Frontend Data & State:** React 18, React DOM.
*   **Styling:** Tailwind CSS, PostCSS.
*   **Icons & Assets:** Lucide React, Unsplash Context.
*   **Environment & Build:** Vite, TypeScript.
*   **Live Data Source:** `saurav.tech` Business News Proxy.

## ⚙️ Running Locally
1. Clone the repository.
2. Run `npm install` to build dependencies.
3. Establish the dev connection via `npm run dev -- --host`.
4. The MyET AI Dashboard will be accessible on `http://localhost:5173`.
