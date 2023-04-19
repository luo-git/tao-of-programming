import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from 'packages/backend/src/main';
 
export const trpc = createTRPCReact<AppRouter>();