import { LyricsForm } from "@/components/development/form/lyrics-form";
import { getSongsWithoutLyrics } from "@/server/songs"


const LyricsPage = async() => {
    
    const songs = await getSongsWithoutLyrics();
    
    return (
        <div className="flex flex-col items-center py-10 space-y-10" >
            <div className="w-full text-left max-w-md space-y-2">
                <h1 className="text-2xl font-bold text-zinc-800">Safari Lyrics</h1>
                <p className="text-sm text-zinc-700">
                    Add new lyrics to the database by filling out the form below. Select a song, choose whether the lyrics are synced, and enter the lyrics in valid JSON format. All fields are required.
                </p>
            </div>
            <LyricsForm songs={songs} /> 
        </div>
    )
}

export default LyricsPage;