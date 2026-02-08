"use client";

import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AutomateSearchSchema } from "@/schema/automate.schema";
import { Button } from "@/components/ui/button";
import { Loader, Search, SearchIcon, XIcon } from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";


type Album = {
    id: string;
    name: string;
    image: string;
}



type Artist = {
    id: string;
    name: string;
    role: string;
    type: string;
    image: {
        url: string;
        quality: string;
    }[];
    url: string;
};

type Artists = {
    primary: Artist[];
    featured: Artist[];
    all: Artist[];
};

type ResponseData = {
    id: string;
    name: string;
    description: string;
    year: number;
    type: string;
    playCount: number;
    language: string;
    explicitContent: boolean;
    artists: Artists;
    url: string;
    image: {
        url: string;
        quality: string;
    }[];
};


export const AutomateForm = () => {
    
    const form = useForm<z.infer<typeof AutomateSearchSchema>>({
        resolver: zodResolver(AutomateSearchSchema),
        defaultValues: {
            query: "",
        }
    });

    const [loading, setLoading] = useState(false);
    const [useURL, setUseURL] = useState(false);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [responseData, setResponseData] = useState<ResponseData[]>([]);

    const onSubmit = async (data: z.infer<typeof AutomateSearchSchema>) => {
        try {
            setResponseData([]);
            setLoading(true);
            if (useURL) {
                const response = await axios.get(`https://saavan.shivamrai6836.workers.dev/api/albums?link=${encodeURIComponent(data.query)}`);
                setLoading(false);
                setResponseData([response.data.data]);

            } else {
                const response = await axios.get(`https://saavan.shivamrai6836.workers.dev/api/search/albums?query=${data.query}&page=0&limit=15`)
                setLoading(false);
                setResponseData(response.data.data.results);
            }

        } catch (error) {
            toast.error("Failed to fetch albums");
            console.error(error);
            setLoading(false);
        }
    }

    const onProcessAlbums = async () => {
        try {
            const albumIds = albums.map(album => album.id);
            await axios.post('http://localhost:3002/automate/', { albumIds });
            toast.success("Albums added to automation queue");
            setAlbums([]);
        } catch (error) {
            toast.error("Failed to add albums to automation queue");
            console.error(error);
        }
    }

    return (
        <div className="w-full max-w-md flex flex-col space-y-6">
            <div className="grid grid-cols-3 gap-4">
                {albums.map((album) => (
                    <div key={album.id} className="flex flex-col items-center space-y-2">
                        <div className="w-full aspect-square rounded-md overflow-hidden relative">
                            <Image
                                src={album.image}
                                alt={album.name}
                                fill
                                className="object-cover"
                            />
                            <Button
                                className="absolute top-1 right-1 bg-white/80 hover:bg-white p-1 size-8"
                                variant="ghost"
                                size="icon"
                                onClick={()=>{
                                    setAlbums(albums.filter(a=>a.id!==album.id))
                                }}
                            >
                                <XIcon className="h-4 w-4"/>
                            </Button>
                        </div>
                        <p className="text-sm text-zinc-700 text-center">{album.name}</p>
                    </div>
                ))}
            </div>
            {
                albums.length > 0 && (
                    <Button
                        className="w-full"
                        onClick={onProcessAlbums}
                        size="sm"
                    >
                        Process Albums
                    </Button>
                )
            }
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-x-2">
                    <div className="flex items-center gap-x-4 bg-neutral-100 rounded-full py-1 border border-border overflow-hidden">
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="search"
                                            placeholder="Search for albums"
                                            className="w-full bg-transparent outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="ghost"
                        >
                            <SearchIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="py-4 flex items-center gap-2">
                        <Checkbox
                            checked={useURL}
                            onCheckedChange={(checked) => setUseURL(checked === true)}
                        >
                            Use URL
                        </Checkbox>
                        <p className="text-xs text-zinc-500">Search for albums using the Saavan URL.</p>
                    </div>
                </form>
            </Form>
            <div className="flex flex-col gap-y-1">
                {
                    loading && (
                        <p className="text-sm text-zinc-600 flex items-center justify-center py-20">
                            <Loader className="size-5 animate-spin" />
                        </p>
                    )
                }
                {responseData.map((album) => (
                    <div key={album.id} className="w-full bg-white rounded-xl p-3 flex items-center border border-border">
                        <div className="size-10 rounded-lg overflow-hidden relative aspect-square">
                            <Image
                                src={album.image[0].url}
                                alt={album.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="ml-4 flex-1">
                            <p className="text-sm font-medium text-zinc-800">{album.name}</p>
                            <p className="text-xs text-zinc-600">{album.artists.primary.map(artist=>artist.name).join(", ")}</p>    
                        </div>
                        <Button
                            onClick={()=>{
                                if(albums.find(a=>a.id===album.id)){
                                    toast.error("Album already added");
                                    return;
                                } 
                                setAlbums([...albums, {
                                    id: album.id,
                                    name: album.name,
                                    image: album.image[2].url
                                }])
                            }}
                            size="sm"
                            variant="secondary"
                        >
                            Add
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}