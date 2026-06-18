# CareerPilot AI

A LangGraph Powered Multi-Agent AI Platform that analyzes resumes, matches real-time jobs, optimizes ATS scores, and generates tailored cover letters and interview prep.

## Technical Architecture

```text
Frontend
Next.js + TypeScript

↓

LangGraph Orchestrator

↓

Resume Agent
Job Agent
Tailor Agent
Cover Letter Agent
Interview Agent

↓

Groq LLM

↓

Neon PostgreSQL + pgvector
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
