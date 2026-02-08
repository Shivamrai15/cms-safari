"use server";

import { db } from "@/lib/db";

export const getAllAlbums = async() => {
    try {
        
        const albums = await db.album.findMany({
            orderBy : {
                name : "asc"
            }
        });
        return albums

    } catch (error) {
        return [];
    }
}


export const getAllAlbumsWithoutLabel = async () => {
    try {
        
        const albums = await db.album.findMany({
            where : {
                label : null
            },
            orderBy : {
                name : "asc"
            }
        });
        return albums

    } catch (error) {
        return [];
    }
}


export const getAlbumsToUpdateReleaseDate = async () => {
    try {
        
        const albums = await db.album.findMany({
            where : {
                release : {
                    gte : new Date("2025-12-19")
                }
            },
            orderBy : {
                name : "asc"
            }
        });

        return albums;

    } catch (error) {
        return [];
    }
}