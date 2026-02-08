import * as z from 'zod';

export const ReleaseDateSchema = z.object({
    albumId: z.string().min(1, { message: "Album ID is required" }),
    releaseDate: z.string().refine((date) => {
        return !isNaN(Date.parse(date));
    }, { message: "Invalid date format" }),
});

export type ReleaseDateInput = z.infer<typeof ReleaseDateSchema>;
