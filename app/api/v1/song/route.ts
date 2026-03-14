import { generateSyntheticData } from "@/lib/agent";
import { db } from "@/lib/db";
import { generateEmbeddings } from "@/lib/embeddings";
import { qdarnt } from "@/lib/qdrant";
import { SongSchema } from "@/schema/song.schema";  
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

function formatName (moodName: string){
  const formattedName = moodName.charAt(0).toUpperCase() + moodName.slice(1).toLowerCase();
  return formattedName;
}

export async function POST ( req: Request ) {
    try {

        const body = await req.json();
        const validatedData = SongSchema.safeParse(body);

        if (!validatedData.success) {
            return new NextResponse("Invalid Fields", {status : 401});
        }

        const { artistIds, name, ...songData } = validatedData.data;
        
        const song = await db.song.create({
            data : {
                ...songData,
                name : name.trim(),
                artists : {
                    connect : artistIds.map(id => ({ id }))
                }
            },
            include : {
                album : {
                    select : {
                        name : true,
                        release : true,
                    }
                },
                artists : {
                    select : {
                        name : true
                    }
                }
            }
        });
        
        // const generatedData = null;
        // const generatedData = await generateSyntheticData({
        //     albumName : song.album.name,
        //     songName : song.name,
        //     artists : song.artists.map(artist=>artist.name),
        //     releaseYear : song.album.release.getFullYear()
        // });

        let embeddingText = song.name.toLocaleLowerCase();

        // if (generatedData) {

        //     try {
      
        //         const moods = await db.mood.createMany({
        //             data: generatedData.mood.map(mood => ({
        //             name: formatName(mood)
        //             }))
        //         });

        //     } catch (error) {
            
        //     }

        //     const moodIds = await db.mood.findMany({
        //     where : {
        //         name : {
        //             in : generatedData.mood.map(mood => formatName(mood))
        //         }
        //     },
        //     select : {
        //         id : true,
        //         name : true
        //     }
        //     });

        //     const { mood, ...metadataWithoutMood } = generatedData;
            
        //     const metadata = await db.metadata.create({
        //         data : {
        //             songId : song.id,
        //             ...metadataWithoutMood,
        //             moods : {
        //                 connect: moodIds.map(mood => ({ id: mood.id }))
        //             }
        //         },
        //     });

        //     const uniqueGenres = new Set([metadata.genre, ...moodIds.map(mood => mood.name)]);
        //     const genreAndMood = Array.from(uniqueGenres).join(" ");
        //     embeddingText = `${song.name.toLocaleLowerCase()} ${genreAndMood}`.trim();

        // }

        const vector = await generateEmbeddings(embeddingText);
        const vectorSong = {
            id: uuidv4(),
            vector,
            payload: { 
                id: song.id,
                name: song.name,
                artists: song.artistIds,
                album: song.albumId
            }
        };
        await qdarnt.upsert("song", { points: [vectorSong] });

        return NextResponse.json(song);

    } catch (error) {
        console.error("ARTIST POST API", error);
        return new NextResponse("Intrenal sever error", {status : 500});
    }
}