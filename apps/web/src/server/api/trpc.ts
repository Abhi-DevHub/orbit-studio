import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from '@orbit/database';

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = null; // Will implement with Better Auth
  return {
    session,
    db: prisma,
    req: opts.req,
    res: opts.res,
  };
};

const t = initTRPC.context<typeof createContext>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.session.user } });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const mergeRouters = t.mergeRouters;
