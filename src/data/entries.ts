import raw from './entries.json';
import type { Entry } from '@/types';

export const entries = raw as unknown as Entry[];
