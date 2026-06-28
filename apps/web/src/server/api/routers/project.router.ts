import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const projectRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: { userId: ctx.session.id },
      orderBy: { updatedAt: 'desc' },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: { id: input.id, userId: ctx.session.id },
        include: {
          canvasStates: { orderBy: { version: 'desc' }, take: 1 },
          conversations: { orderBy: { updatedAt: 'desc' }, take: 1 },
        },
      });
      if (!project) throw new TRPCError({ code: 'NOT_FOUND' });
      return project;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100),
        description: z.string().max(500).optional(),
        templateId: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description ?? '',
          userId: ctx.session.id,
          templateId: input.templateId,
          canvasStates: {
            create: {
              nodes: [],
              edges: [],
              version: 1,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().optional(), description: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.update({
        where: { id: input.id, userId: ctx.session.id },
        data: { name: input.name, description: input.description },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.project.delete({ where: { id: input.id, userId: ctx.session.id } });
      return { success: true };
    }),
});
