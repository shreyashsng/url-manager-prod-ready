import {z} from 'zod';

export const createUrlSchema = z.object({
    original: z.string().max(2048, {message: "URL too long"}).refine((val) => {
        try {
            const parsed = new URL(val);
            return parsed.protocol === 'https:' || parsed.protocol === 'http:';
        } catch {
            return false;
        }
    },{message: "Invalid URL format"}),
});

export type CreateUrlInput = z.infer<typeof createUrlSchema>;