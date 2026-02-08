import { db } from "@/lib/db";
import { ReleaseDateSchema } from "@/schema/release-date.schema";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {

        const body = await req.json();
        const validatedData = await ReleaseDateSchema.safeParseAsync(body);
        if (!validatedData.success) {
            return new NextResponse(JSON.stringify({ message: "Invalid data", errors: validatedData.error.format() }), { status: 400 });
        }

        const { albumId, releaseDate } = validatedData.data;
        await db.album.update({
            where: {
                id: albumId
            },
            data: {
                release: new Date(releaseDate)
            }
        });

        return NextResponse.json({ message: "Release date updated successfully" }, { status: 200 });

    } catch (error) {
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}