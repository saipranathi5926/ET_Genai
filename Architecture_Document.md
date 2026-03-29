# MyET AI: Architecture & Agent Design

## 1. System Architecture Diagram

```mermaid
graph TD
    %% User Interfaces
    User([End User]) -->|Login/Auth| FrontEnd[React Frontend App]
    
    %% API Integrations
    FrontEnd -->|Fetch Request| API[Live News API <br/> saurav.tech Business]
    API -.->|JSON Response| FrontEnd
    
    %% Autonomous Agent Pipeline
    subgraph Autonomous Agentic Pipeline
        direction TB
        Orchestrator{Orchestrator Agent}
        Agent1[Entity Extraction Agent]
        Agent2[Sentiment & Trend Agent]
        Agent3[Persona Relevance Agent]
        
        Orchestrator --> Agent1
        Agent1 --> Agent2
        Agent2 --> Agent3
    end
    
    FrontEnd -->|Feeds raw data| Orchestrator
    
    %% Agent Outputs routing to specific modules
    Agent3 -->|Processed News Data| Modules
    
    subgraph UI Modules
        Direction LR
        Mod1[MyET Newsroom Feed]
        Mod2[NewsNavigator Chat]
        Mod3[AI Video Studio]
        Mod4[StoryArc Tracker]
        Mod5[Vernacular Engine]
    end
    
    Modules --> Mod1
    Modules --> Mod2
    Modules --> Mod3
    Modules --> Mod4
    Modules --> Mod5
    
    %% Browser Tools
    Mod3 -->|Triggers| TTS[Browser SpeechSynthesis API]
```

## 2. Agent Roles & Communication

The MyET AI platform operates on a locally executed **Multi-Agent Pipeline** pattern. When raw data enters the system from the Live News API, it is passed through a sequence of specialized simulated LLM agents:

1. **Entity Extraction Agent (Agent 1):** Scans the raw localized or international news text and isolates critical proper nouns, sectors, and financial instruments (e.g., "SaaS", "RBI", "Mid-cap funds").
2. **Sentiment & Trend Agent (Agent 2):** Takes the entities from Agent 1 and performs a bidirectional sentiment analysis. It scores the news snippet internally and flags the overarching emotional context (e.g., Negative, Positive, Neutral).
3. **Persona Relevance Agent (Agent 3):** Takes the fully analyzed payload from Agent 2, cross-references the extracted entities and sentiments against the currently authenticated User Profile (e.g., Startup Founder vs. Mutual Fund Investor), and assigns a bespoke `relevanceScore`.

**Communication Protocol:** The agents communicate via a unidirectional state transfer. Each agent expects a strict JSON-like structured payload. The output array of one agent serves as the exact input parameter for the next. This pipelined architecture prevents hallucinations and ensures deterministic end-results for the UI.

## 3. External Tool Integrations

*   **Public News API (`saurav.tech` Mirror):** To ensure a live, authentic demonstration without relying on rate-limited, paid APIs during the hackathon, the app fetches actual time-stamped business data from an open proxy mirror of NewsAPI.
*   **Native SpeechSynthesis API:** Rather than calling an external Text-To-Speech web service that could timeout, the AI Video Studio integration interfaces natively with the user's local operating system text-to-speech engine. This guarantees zero-latency audio playback for the generated video snippets.

## 4. Error-Handling Logic

A resilient AI architecture requires graceful degradation. 
1. **Network Failovers:** If the Live News API drops, encounters a CORS issue, or takes longer than 3 seconds to respond, the `fetchRealNews` handler automatically catches the exception and falls back to a locally cached mock static database (`rawNewsData`). The agent pipeline proceeds uninterrupted, meaning the user never sees a broken feed.
2. **TTS Failure Handling:** If the user's browser does not support `SpeechSynthesis`, the Video Studio silently catches the null reference and simply continues playing the visual video simulation without throwing uncaught DOM exceptions.
3. **Blank State Handlers:** If an article lacks an image from the live API, a highly relevant generic fallback image from Unsplash is automatically injected to prevent layout breaking or "broken image" UI markers.
