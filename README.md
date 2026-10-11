# Gir AI Guardian 🦁

**Human-Wildlife Conflict Mitigation System** — A multi-agent AI platform for Gir Forest.

## Quick Start

### 1. Start the Backend
```bash
cd gir-ai-guardian-server
npm start
```
Server runs on **http://localhost:3001**

### 2. Start the Frontend
```bash
cd gir-ai-guardian
npm run dev
```
App runs on **http://localhost:5173**

## AI Agents

| Agent | Purpose |
|-------|---------|
| 🦁 Wildlife Movement | Predict lion/leopard movement, assess village risk |
| 🚨 Village Alert | Generate emergency alerts, multilingual warnings |
| 🌲 Forest Coordination | Deploy response teams, generate action plans |
| 💰 Compensation | Guide livestock loss compensation process |
| 📊 Hotspot Analysis | Analyze conflict patterns, identify hotspot villages |

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS, Recharts
- **Backend**: Node.js + Express
- **AI**: Groq API (LLaMA 3.3 70B)
