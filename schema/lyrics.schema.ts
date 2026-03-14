import * as z from "zod";

export const LyricsSchema = z.object({
    songId : z.string().min(1),
    lyrics : z.string(),
    synced : z.boolean()
});