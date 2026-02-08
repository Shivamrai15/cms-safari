import { ReleaseDateForm } from "@/components/development/form/release-date-form";
import { getAlbumsToUpdateReleaseDate } from "@/server/album";


const Page = async() => {

    const albums = await getAlbumsToUpdateReleaseDate();

    return (
        <div className="flex flex-col items-center py-10 space-y-10" >
            <div className="w-full text-left max-w-md space-y-2">
                <h1 className="text-2xl font-bold text-zinc-800">Release Date</h1>
                <p className="text-sm text-zinc-700">Update the release dates for albums in the database.</p>
            </div>
            <ReleaseDateForm albums={albums} />
        </div>
    )
}

export default Page;
