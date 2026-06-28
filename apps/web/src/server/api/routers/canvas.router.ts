import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const canvasRouter = router({
  getState: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.canvasState.findFirst({
        where: { projectId: input.projectId },
        orderBy: { version: 'desc' },
      });
    }),

  saveState: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        nodes: z.array(z.any()),
        edges: z.array(z.any()),
        viewport: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const current = await ctx.db.canvasState.findFirst({
        where: { projectId: input.projectId },
        orderBy: { version: 'desc' },
      });

      return ctx.db.canvasState.create({
        data: {
          projectId: input.projectId,
          nodes: input.nodes,
          edges: input.edges,
          viewport: input.viewport,
          version: (current?.version ?? 0) + 1,
        },
      });
    }),
});
