import { router, mergeRouters } from '../trpc';
import { projectRouter } from './project.router';
import { canvasRouter } from './canvas.router';
import { aiRouter } from './ai.router';
import { templateRouter } from './template.router';

export const appRouter = router({
  project: projectRouter,
  canvas: canvasRouter,
  ai: aiRouter,
  template: templateRouter,
});

export type AppRouter = typeof appRouter;
