# Orbit Studio — UI/UX Design Specification

## Version 1.0

---

## 1. Design Principles

- **Engineering-First**: Every pixel serves a purpose. No decorative elements
- **Clear Hierarchy**: Information architecture is visible at a glance
- **Dark-First**: Dark theme by default, light theme as option
- **Keyboard-Native**: All actions accessible via keyboard
- **Progressive Disclosure**: Start simple, reveal complexity as needed

## 2. Theme

### 2.1 Color Palette

```css
:root {
  /* Dark Theme (Default) */
  --background: 222 47% 11%;        /* #0f172a */
  --foreground: 210 40% 98%;        /* #f8fafc */
  
  --card: 222 47% 13%;              /* #1e293b */
  --card-foreground: 210 40% 98%;
  
  --primary: 217 91% 60%;           /* #3b82f6 */
  --primary-foreground: 210 40% 98%;
  
  --secondary: 217 33% 17%;         /* #1e293b */
  --secondary-foreground: 210 40% 98%;
  
  --accent: 142 71% 45%;            /* #22c55e */
  --accent-foreground: 210 40% 98%;
  
  --destructive: 0 84% 60%;         /* #ef4444 */
  --muted: 217 33% 17%;
  --muted-foreground: 215 20% 65%;
  
  --border: 217 33% 20%;
  --input: 217 33% 20%;
  --ring: 224 76% 48%;
  
  --radius: 0.5rem;
}
```

### 2.2 Typography

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Scale */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
```

## 3. Layout System

### 3.1 App Shell

```
┌──────────────────────────────────────────────────────────┐
│  Sidebar   │              Main Content                   │
│  ────────  │                                              │
│  Logo      │                                              │
│  ────────  │   ┌────────────────────────────────────┐    │
│  Projects  │   │         Top Bar                    │    │
│  Templates │   │  Breadcrumb  │  Actions  │  User   │    │
│  ────────  │   └────────────────────────────────────┘    │
│  Settings  │                                              │
│            │   ┌────────────────────────────────────┐    │
│            │   │                                    │    │
│            │   │         Content Area               │    │
│            │   │                                    │    │
│            │   └────────────────────────────────────┘    │
│            │                                              │
└────────────┴──────────────────────────────────────────────┘
```

### 3.2 Canvas Layout

```
┌──────────────────────────────────────────────────────────┐
│ Left Panel  │         Canvas             │  Right Panel  │
│ (Node Lib)  │  ┌──────────────────────┐  │  (Properties) │
│             │  │                      │  │               │
│ Frontend    │  │   Infinite Canvas    │  │   Node: API   │
│ Backend     │  │                      │  │   Gateway     │
│ Database    │  │    ┌──────┐          │  │   ─────────  │
│ API         │  │    │ API  │          │  │   Type        │
│ Cache       │  │    │Gatewy│          │  │   Config      │
│ Queue       │  │    └──┬───┘          │  │   Metrics     │
│ Worker      │  │       │              │  │   Cost        │
│ Auth        │  │    ┌──┴───┐          │  │   Security    │
│ Storage     │  │    │ Auth │          │  │               │
│ ─────────   │  │    └──────┘          │  └───────────────┘
│ Search...   │  │                      │
│             │  └──────────────────────┘
│             │  Bottom Panel
│             │  ┌──────────────────────┐
│             │  │ AI Chat │ Console │   │
│             │  └──────────────────────┘
└─────────────┴──────────────────────────┘
```

## 4. Component Library (shadcn/ui)

### 4.1 Core Components
- Button, Input, Select, Checkbox, Radio, Switch
- Dialog, Drawer, Popover, Tooltip, Dropdown
- Card, Tabs, Accordion, ScrollArea, Separator
- Badge, Avatar, Alert, Toast, Skeleton
- Command (Command Palette)
- Sheet (Slide-over panels)

### 4.2 Orbit-Specific Components

#### NodeLibrary
```
┌──────────────────────┐
│ Node Library    (Q)  │
│──────────────────────│
│ 🔍 Search nodes...   │
│──────────────────────│
│ Application          │
│  ├ Frontend          │
│  ├ Backend           │
│  └ Microservice      │
│──────────────────────│
│ Data                 │
│  ├ PostgreSQL        │
│  ├ MongoDB           │
│  └ Redis             │
│──────────────────────│
│ Infrastructure       │
│  ├ Docker            │
│  ├ Kubernetes        │
│  └ AWS Lambda        │
└──────────────────────┘
```

#### PropertiesPanel
```
┌──────────────────────┐
│ Properties      ⎋    │
│──────────────────────│
│ API Gateway          │
│ ═══════════════════  │
│                      │
│ Name: API Gateway    │
│ Type: Gateway        │
│ Provider: AWS        │
│ Status: ● Healthy    │
│                      │
│ Configuration        │
│ ──────────────────   │
│ Rate Limit: 1000/s   │
│ Auth: JWT + OAuth    │
│ CORS: Enabled        │
│                      │
│ Cost: $35/month      │
│ Security: 95/100     │
│                      │
│ [Explain] [Analyze]  │
└──────────────────────┘
```

#### AIChatPanel
```
┌──────────────────────┐
│ AI Chat        (⌘I)  │
│──────────────────────│
│                      │
│ AI: I've added Redis │
│ cache layer between  │
│ API Gateway and      │
│ Database. Estimated  │
│ latency reduction:   │
│ 65%.                 │
│                      │
│ ┌──────────────────┐ │
│ │ [Apply] [Modify] │ │
│ └──────────────────┘ │
│                      │
│ You: Replace MySQL   │
│ with PostgreSQL      │
│                      │
│──────────────────────│
│ ▸ Ask AI anything... │
└──────────────────────┘
```

## 5. Canvas Nodes

### 5.1 Node Visual Design
Each node type has:
- Unique icon (Lucide icons or custom SVG)
- Color-coded border by category
- Connection handles (left = input, right = output)
- Status indicator dot
- Label text
- Resize handles on selection

### 5.2 Node Categories and Colors

| Category     | Color   | Examples |
|-------------|---------|----------|
| Application | Blue    | Frontend, Backend, Microservice |
| Data        | Green   | PostgreSQL, Redis, MongoDB |
| Infra       | Orange  | Docker, K8s, Lambda |
| Network     | Purple  | API Gateway, Load Balancer, CDN |
| Security    | Red     | Auth, WAF, Secrets |
| AI          | Cyan    | GPT, Gemini, Claude |
| Monitoring  | Yellow  | Datadog, Grafana, Prometheus |
| Queue       | Pink    | Kafka, RabbitMQ, SQS |

## 6. AI Agent UI

### 6.1 Agent Pipeline Visualization
```
┌────────┐   ┌────────┐   ┌────────┐   ┌────────┐
│Planner │──>│Require │──>│Architect│──>│Database│
│  ✅    │   │  ✅    │   │  🔄    │   │  ⏳    │
└────────┘   └────────┘   └────────┘   └────────┘
                                           │
                                    ┌──────┴──────┐
                                    │Infrastructure│
                                    │    ⏳       │
                                    └─────────────┘
```

### 6.2 Suggestion Card
```
┌──────────────────────────────────────────────────┐
│ 💡 Missing Cache Layer                           │
│                                                  │
│ Your API Gateway connects directly to PostgreSQL │
│ without a cache layer. Adding Redis could reduce │
│ read latency by 80% and database load by 60%.    │
│                                                  │
│ Estimated impact:                                │
│ - Latency: 150ms → 5ms                           │
│ - Cost: +$15/month (Redis cache)                 │
│ - DB Load: -60%                                  │
│                                                  │
│ [Add Redis] [Dismiss] [Learn More]               │
└──────────────────────────────────────────────────┘
```

## 7. Responsive Breakpoints

| Breakpoint | Width | Layout |
|-----------|-------|--------|
| Mobile    | < 768px | Full-screen canvas, panels as drawers |
| Tablet    | 768-1024px | Collapsed sidebar, right panel as overlay |
| Desktop   | 1024-1440px | Full layout |
| Wide      | > 1440px | Expanded panels |

## 8. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘K       | Command palette |
| ⌘I       | Toggle AI chat |
| ⌘B       | Toggle sidebar |
| ⌘E       | Toggle right panel |
| ⌘Z       | Undo |
| ⌘⇧Z      | Redo |
| ⌘D       | Duplicate selected |
| Delete   | Delete selected |
| ⌘A       | Select all |
| ⌘+       | Zoom in |
| ⌘-       | Zoom out |
| ⌘0       | Reset zoom |
| ⌘S       | Force save |
| ⌘/       | Show shortcuts |
| Space    | Pan mode (hold) |
| ⌘⇧A     | Open AI Architect |
