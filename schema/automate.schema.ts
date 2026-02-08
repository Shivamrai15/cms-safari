import * as z from "zod";

export const AutomateSearchSchema = z.object({
    query : z.string().min(1, "Search query is required"),
});