import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { Orchestrator } from '@orbit/ai';

const orchestrator = new Orchestrator();

export const aiRouter = router({
  generateArchitecture: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        prompt: z.string().min(1).max(2000),
        existingNodes: z.array(z.any()).optional(),
        existingEdges: z.array(z.any()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const result = await orchestrator.run({
        userId: ctx.user.id,
        projectId: input.projectId,
        prompt: input.prompt,
        existingNodes: input.existingNodes,
        existingEdges: input.existingEdges,
      });

      await ctx.db.aIConversation.create({
        data: {
          projectId: input.projectId,
          messages: [
            { role: 'user', content: input.prompt },
            { role: 'assistant', content: result.explanation, data: result },
          ],
        },
      });

      return result;
    }),

  chat: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        conversationId: z.string().optional(),
        message: z.string().min(1),
        canvasContext: z.object({
          nodes: z.array(z.any()),
          edges: z.array(z.any()),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { ArchitectureCopilot } = await import('@orbit/ai');
      const copilot = new ArchitectureCopilot();
      return copilot.processMessage({
        message: input.message,
        canvasContext: input.canvasContext,
        projectId: input.projectId,
      });
    }),

  explain: protectedProcedure
    .input(z.object({ projectId: z.string(), nodeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { ExplainAgent } = await import('@orbit/ai');
      const agent = new ExplainAgent();

      const state = await ctx.db.canvasState.findFirst({
        where: { projectId: input.projectId },
        orderBy: { version: 'desc' },
      });
      const node = state?.nodes?.find((n: any) => n.id === input.nodeId);
      if (!node) throw new Error('Node not found');

      return agent.explain(node);
    }),

  analyze: protectedProcedure
    .input(z.object({ projectId: z.string(), nodes: z.array(z.any()), edges: z.array(z.any()) }))
    .mutation(async ({ ctx, input }) => {
      const { ArchitectureAnalyzer } = await import('@orbit/ai');
      const analyzer = new ArchitectureAnalyzer();
      return analyzer.analyze(input.nodes, input.edges);
    }),
});
