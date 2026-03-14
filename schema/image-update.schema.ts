import * as z from "zod";

export const ImageUpdateSchema = z.object({
    type : z.enum(["MOOD", "GENRE"]),
    id: z.string().min(1, "ID is required"),
    image : z.string().min(1, "Image URL is required").url("Invalid URL format"),
})