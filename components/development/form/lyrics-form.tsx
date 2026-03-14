"use client";

import * as z from "zod";
import { Song } from "@prisma/client";
import { useForm } from "react-hook-form";
import { LyricsSchema } from "@/schema/lyrics.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Image from "next/image";

interface LyricsFormProps {
    songs : Song[]
}

export const LyricsForm = ({
    songs
} : LyricsFormProps ) => {

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState("");

    const form = useForm<z.infer<typeof LyricsSchema>>({
        resolver : zodResolver(LyricsSchema),
        defaultValues : {
            lyrics : "",
            songId : "",
            synced : true
        }
    });

    const handleForm = async( values : z.infer<typeof LyricsSchema> ) => {
        try {
            
            await axios.post("/api/v1/lyrics", values);
            toast.success("Lyrics is added")
            form.reset();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                className="space-y-6 max-w-md w-full"
                onSubmit={form.handleSubmit(handleForm)}
            >
                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name="songId"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="mr-4">Song</FormLabel>
                                    <Select onValueChange={(value)=>{
                                        field.onChange(value)
                                        setImage(songs.find((item)=> item.id===value)?.image || "");
                                        console.log(songs.find((item)=> item.id===value))
                                        const trackName = songs.find((item)=> item.id===value)?.name || "";
                                        window.navigator.clipboard.writeText(trackName)
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a song" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                songs.map((song)=>(
                                                    <SelectItem key={song.id} value={song.id}>
                                                        {song.name}
                                                    </SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="synced"
                        render={({field})=>(
                            <FormItem>
                                <div className="flex items-center my-8">
                                    <FormLabel className="mr-4">Is song is synced</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lyrics"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="mr-4">Song</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Lyrics of the song"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                {
                    image && (
                        <div className="h-40 w-40 relative overflow-hidden">
                            <Image
                                src={image}
                                alt="song image"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )
                }
                <Button
                    type="submit"
                    className="w-full"
                    disabled = {loading}
                >
                    {loading ? "Adding..." : "Add Lyrics"}
                </Button>
            </form>
        </Form>
    )
}
