import raw from './photo-credits.json';
import type { PhotoCredit } from '@/types';

export const photoCredits = raw as Record<string, PhotoCredit>;
