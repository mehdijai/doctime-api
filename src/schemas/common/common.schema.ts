import { z } from 'zod';

export const searchPaginationSchema = {
  take: z.number().optional(),
  skip: z.number().optional(),
};
