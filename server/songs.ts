"use server";

import { db } from "@/lib/db";

export const getSongs = async () => {

    const songs = await db.song.findMany({
        orderBy : {
            name : "asc"
        }
    });

    return songs;

}


export const getSongsWithoutSyncedLyrics = async () => {
    const lyrics = await db.lyrics.findMany({
        where : {
            synced : false
        },
        select : {
            songId : true
        }
    });

    const ids = lyrics.map((ly) => ly.songId);
    const songs = await db.song.findMany({
        where : {
            id : {
                in : ids
            }
        },
        orderBy : {
            name : "desc"
        }
    });
    return songs;
}


export const getPreProcessSongs = async () => {
    try {
        
        const songs = await db.song.findMany({
            where : {
                url : {
                    not : {
                        endsWith : "m3u8"
                    }
                }
            },
            include : {
                artists : true
            }
        });

        return songs;

    } catch (error) {
        return [];
    }
}

export const getSongsWithoutEmbeddings = async () => {

    const songs = await db.song.findMany({
        where : {
            embedding : {
                is : null
        }
    }});
    
    return songs;
}


export const getSongsWithoutLyrics = async () => {
    const songs = await db.song.findMany({
        where : {
            hasLyrics : {
                isSet : false
            },
            name : {
                startsWith : "C"
            }
        },
        orderBy : {
            name : "asc"
        }
    });

    return songs;
}