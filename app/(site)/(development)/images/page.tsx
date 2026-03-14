import { ImageUpdateForm } from "@/components/development/form/image-update-form";
import { getGenre } from "@/server/genre";
import { getMoods } from "@/server/moods";


const Page = async() => {

    const moods = await getMoods();
    const genres = await getGenre();

    return (
        <div className="flex flex-col items-center py-10 space-y-10" >
            <div className="w-full text-left max-w-md space-y-2">
                <h1 className="text-2xl font-bold text-zinc-800">Update Mood/Genre Images</h1>
                <p className="text-sm text-zinc-700">
                    This page allows you to update the images associated with moods and genres in the database.
                </p>
            </div>
            <ImageUpdateForm moods={moods} genres={genres} />
        </div>
    )
}

export default Page;
