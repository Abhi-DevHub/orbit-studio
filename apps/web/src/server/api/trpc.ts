import { initTRPC, TRPCError } from '@trpc/server';
import { prisma } from '@orbit/database';

interface Session {
  id: string;
  email?: string;
  name?: string;
}

export const createContext = async () => {
  const session: Session | null = null;
  return {
    session,
    db: prisma,
  };
};

const t = initTRPC.context<Awaited<ReturnType<typeof createContext>>>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: {
      session: ctx.session as Session,
      db: ctx.db,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
export const mergeRouters = t.mergeRouters;
