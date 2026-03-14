"use server";

import { db } from "@/lib/db";

export const getMoods = async ()=> {
    try {
        
        const moods = await db.mood.findMany({
            orderBy : {
                name : "asc"
            }
        });

        return moods;

    } catch (error) {
        return [];
    }
}