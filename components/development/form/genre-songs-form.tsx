"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Genre, Song } from "@prisma/client";

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

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { GenreSongSchema } from "@/schema/genre-song.schema";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GenreSongsFormProps {
    songs : Song[];
    genres : Genre[];
}

export const GenreSongsForm = ({
    genres,
    songs
} : GenreSongsFormProps ) => {

    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof GenreSongSchema>>({
        resolver : zodResolver(GenreSongSchema),
        defaultValues : {
            genreId : "",
            songId : ""
        }
    });

    const handleForm = async( values : z.infer<typeof GenreSongSchema> ) => {
        try {
            
            await axios.post("/api/v1/genre/songs", values);
            toast.success("Song is added")
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
                        name="genreId"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="mr-4">Genre</FormLabel>
                                    <Select onValueChange={(value)=>{
                                        field.onChange(value)
                                    }} defaultValue={field.value}>
                                        <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a genre" />
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                genres.map((genre)=>(
                                                    <SelectItem key={genre.id} value={genre.id}>
                                                        {genre.name}
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
                        name="songId"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel className="mr-4">Song</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn(
                                                        "w-full justify-between",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value
                                                        ? songs.find(
                                                            (song) => song.id === field.value
                                                        )?.name
                                                        : "Select Song"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Search Songs..." />
                                            <CommandList>
                                            <CommandEmpty>No Song found.</CommandEmpty>
                                            <CommandGroup>
                                                {songs.map((song) => (
                                                <CommandItem
                                                        value={song.name.toLowerCase()}
                                                        className="w-full"
                                                        key={song.id}
                                                        onSelect={() => {
                                                        form.setValue("songId", song.id);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            song.id === field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                        )}
                                                    />
                                                    {song.name}
                                                </CommandItem>
                                                ))}
                                            </CommandGroup>
                                            </CommandList>
                                        </Command>
                                        </PopoverContent>
                                    </Popover>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center justify-center">
                        {
                            form.watch("songId") && (
                                <div className="size-40 overflow-hidden relative rounded-md">
                                    <Image
                                        src={songs.find((song)=>song.id===form.watch("songId"))?.image || "/placeholder.png"}
                                        fill
                                        alt="Song Image"
                                        className="object-contain"
                                    />
                                </div>
                            )
                        }
                    </div>
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled = {loading}
                >
                    {loading ? "Adding..." : "Add Genre-Songs"}
                </Button>
            </form>
        </Form>
    )
}
