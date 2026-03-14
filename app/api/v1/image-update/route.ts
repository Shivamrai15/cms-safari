import { db } from "@/lib/db";
import { ImageUpdateSchema } from "@/schema/image-update.schema";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const validatedData = await ImageUpdateSchema.safeParseAsync(body);
        
        if (!validatedData.success) {
            return new NextResponse("Invalid fields", { status: 400 });
        }

        const { type, id, image } = validatedData.data;

        if (type === "MOOD") {
            const mood = await db.mood.update({
                where: { id },
                data: { image }
            });
            return NextResponse.json(mood);
        } else if (type === "GENRE") {
            const genre = await db.genre.update({
                where: { id },
                data: { image }
            });
            return NextResponse.json(genre);
        }

        return new NextResponse("Invalid type", { status: 400 });

    } catch (error) {
        console.error("IMAGE UPDATE API ERROR", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
}
