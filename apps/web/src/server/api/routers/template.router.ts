import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';

export const templateRouter = router({
  list: publicProcedure
    .input(z.object({ category: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.category ? { category: input.category } : {};
      return ctx.db.template.findMany({
        where: { ...where, isPublic: true },
        orderBy: { downloads: 'desc' },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.template.findUnique({ where: { id: input.id } });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        category: z.string(),
        nodes: z.array(z.any()),
        edges: z.array(z.any()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.template.create({
        data: {
          ...input,
          authorId: ctx.user.id,
        },
      });
    }),
});
