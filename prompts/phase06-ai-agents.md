# Phase 6: AI Multi-Agent System

## Task
Build the complete multi-agent AI pipeline for architecture generation.

## Files
- packages/ai/src/orchestrator.ts - Orchestrator coordinating all agents
- packages/ai/src/agent-pipeline.ts - Pipeline execution engine
- packages/ai/src/architecture-copilot.ts - Continuous AI advisor
- packages/ai/src/explain-agent.ts - Component explainer
- packages/ai/src/analyzer.ts - Architecture analyzer
- packages/ai/src/canvas-renderer.ts - Converts agent output to canvas nodes
- packages/agents/src/planner-agent.ts
- packages/agents/src/requirements-agent.ts
- packages/agents/src/architect-agent.ts
- packages/agents/src/database-agent.ts
- packages/agents/src/api-agent.ts
- packages/agents/src/infrastructure-agent.ts
- packages/agents/src/security-agent.ts
- packages/agents/src/reviewer-agent.ts
- packages/prompts/src/agents.ts
- packages/prompts/src/features.ts
- packages/prompts/src/exports.ts
- apps/web/src/components/ai/AIChatPanel.tsx - Chat UI
- apps/web/src/components/ai/AgentPipeline.tsx - Pipeline visualization
- apps/web/src/components/ai/SuggestionCard.tsx - Proactive suggestions
- apps/web/src/components/ai/ExplainPanel.tsx - Component explanation UI
- apps/web/src/server/api/routers/ai.router.ts - AI API endpoints

## Features
- Multi-agent pipeline: Planner → Requirements → Architect → Database → API → Infrastructure → Security → Reviewer
- Parallel agent execution where possible
- Structured JSON output from each agent
- Canvas rendering from agent output
- Incremental architecture updates
- Proactive architecture analysis (Copilot)
- Component explanation with costs, alternatives, best practices
- Architecture issue detection
- Cost estimation
- Security scoring
- Streaming responses in chat
- Pipeline visualization with progress
