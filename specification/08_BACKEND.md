# Orbit Studio — Backend Implementation Guide

## Version 1.0

---

## 1. Backend Architecture

The backend runs inside Next.js API routes with tRPC for type-safe RPC. Background jobs use Trigger.dev.

```
Next.js App (apps/web)
├── API Routes (/api/trpc/*)
├── Server Actions
├── Middleware (auth, rate-limit)
└── Webhooks

Trigger.dev Workers (packages/workers)
├── Documentation Generation
├── Export Processing
├── Cost Analysis
└── AI Batch Processing
```

## 2. tRPC Setup

```typescript
// packages/config/src/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getServerSession } from '@orbit/auth';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getServerSession(opts.req, opts.res);
  return {
    session,
    db: prisma,
    req: opts.req,
    res: opts.res,
  };
};

const t = initTRPC.context<typeof createContext>().create();

// Middleware
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { user: ctx.session.user },
  });
});

// Rate limit middleware
const rateLimit = t.middleware(async ({ ctx, next }) => {
  const ip = ctx.req.headers['x-forwarded-for'] || 'unknown';
  const result = await checkRateLimit(ip as string, 'api', 100, 60000);
  if (!result.allowed) {
    throw new TRPCError({ code: 'TOO_MANY_REQUESTS' });
  }
  return next();
});

export const publicProcedure = t.procedure.use(rateLimit);
export const protectedProcedure = t.procedure.use(isAuthed).use(rateLimit);
export const router = t.router;
export const mergeRouters = t.mergeRouters;
```

## 3. Project Router Implementation

```typescript
// apps/web/src/server/api/routers/project.router.ts
export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: { userId: ctx.user.id },
      orderBy: { updatedAt: 'desc' },
      include: { _count: { select: { canvasStates: true } } },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: { id: input.id, userId: ctx.user.id },
        include: {
          canvasStates: { orderBy: { version: 'desc' }, take: 1 },
          conversations: { orderBy: { updatedAt: 'desc' }, take: 1 },
        },
      });
      if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
      return project;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      templateId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description ?? '',
          userId: ctx.user.id,
          templateId: input.templateId,
          canvasStates: {
            create: {
              nodes: input.templateId
                ? (await getTemplateNodes(input.templateId))
                : getDefaultArchitectureNodes(),
              edges: [],
              version: 1,
            },
          },
        },
      });
      return project;
    }),
});
```

## 4. AI Router Implementation

```typescript
// apps/web/src/server/api/routers/ai.router.ts
export const aiRouter = router({
  generateArchitecture: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      prompt: z.string().min(1).max(2000),
      existingNodes: z.array(z.any()).optional(),
      existingEdges: z.array(z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // 1. Orchestrate multi-agent pipeline
      const pipeline = new AgentPipeline({
        userId: ctx.user.id,
        projectId: input.projectId,
      });

      const result = await pipeline.run({
        prompt: input.prompt,
        existingNodes: input.existingNodes ?? [],
        existingEdges: input.existingEdges ?? [],
      });

      // 2. Save conversation
      await ctx.db.aIConversation.create({
        data: {
          projectId: input.projectId,
          messages: [
            { role: 'user', content: input.prompt },
            { role: 'assistant', content: result.explanation, data: result },
          ],
        },
      });

      // 3. Update canvas state
      await ctx.db.canvasState.updateMany({
        where: { projectId: input.projectId },
        data: {
          nodes: result.nodes,
          edges: result.edges,
          version: { increment: 1 },
        },
      });

      return result;
    }),

  chat: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      conversationId: z.string().optional(),
      message: z.string().min(1),
      canvasContext: z.object({
        nodes: z.array(z.any()),
        edges: z.array(z.any()),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const ai = new ArchitectureCopilot();
      const response = await ai.processMessage({
        message: input.message,
        canvasContext: input.canvasContext,
        projectId: input.projectId,
      });
      return response;
    }),

  explain: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      nodeId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const state = await ctx.db.canvasState.findFirst({
        where: { projectId: input.projectId },
        orderBy: { version: 'desc' },
      });
      const node = state?.nodes?.find((n: any) => n.id === input.nodeId);
      if (!node) throw new TRPCError({ code: 'NOT_FOUND' });

      const agent = new ExplainAgent();
      return agent.explain(node);
    }),

  analyze: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    }))
    .mutation(async ({ ctx, input }) => {
      const analyzer = new ArchitectureAnalyzer();
      return analyzer.analyze(input.nodes, input.edges);
    }),

  suggest: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      nodes: z.array(z.any()),
      edges: z.array(z.any()),
    }))
    .query(async ({ ctx, input }) => {
      const copilot = new ArchitectureCopilot();
      return copilot.getSuggestions(input.nodes, input.edges);
    }),
});
```

## 5. Background Jobs (Trigger.dev)

```typescript
// packages/workers/src/jobs/documentation.ts
export const generateDocumentation = job({
  id: 'generate-documentation',
  run: async (payload: {
    projectId: string;
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
    format: 'markdown' | 'html' | 'pdf';
  }) => {
    const generator = new DocumentationGenerator();
    const content = await generator.generate(payload.nodes, payload.edges, payload.format);
    
    // Store in S3
    const key = `exports/${payload.projectId}/documentation.${payload.format}`;
    await uploadToS3(key, content);
    
    // Update project with export URL
    await prisma.project.update({
      where: { id: payload.projectId },
      data: { exportUrl: key },
    });
    
    return { url: key };
  },
});

// packages/workers/src/jobs/cost-analysis.ts
export const analyzeCosts = job({
  id: 'analyze-costs',
  run: async (payload: { nodes: ArchitectureNode[] }) => {
    const analyzer = new CostAnalyzer();
    return analyzer.estimate(payload.nodes);
  },
});
```

## 6. File Storage

```typescript
// packages/config/src/storage.ts
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT, // MinIO for local dev
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
});

export async function uploadToS3(key: string, body: Buffer | string) {
  return s3.putObject({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
    Body: body,
  });
}
```

## 7. Error Handling Strategy

```typescript
// Global error handler for tRPC
export const errorFormatter = (error: TRPCError) => {
  return {
    code: error.code,
    message: error.message,
    // Don't leak internal errors in production
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      cause: error.cause,
    }),
  };
};
```
