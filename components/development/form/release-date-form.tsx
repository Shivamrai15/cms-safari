"use client";

import { Album } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReleaseDateInput, ReleaseDateSchema } from "@/schema/release-date.schema";

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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface ReleaseDateFormProps {
    albums: Album[];
}

export const ReleaseDateForm = ({ albums }: ReleaseDateFormProps) => {
    
    const form = useForm<ReleaseDateInput>({
        defaultValues: {
            albumId: "",
            releaseDate: "",
        },
        resolver: zodResolver(ReleaseDateSchema),
    });

    const handleForm = async (values: ReleaseDateInput) => {
        try {
            await axios.patch('/api/v1/album/release-date', values);
            toast.success("Release date updated successfully");
            form.reset();
        } catch (error) {
            toast.error("Failed to update release date");
        }
    }

    const { isSubmitting } = form.formState;
    
    return (
        <Form {...form}>
            <form
                className="space-y-6 max-w-md w-full"
                onSubmit={form.handleSubmit(handleForm)}
            >
                <FormField
                    control={form.control}
                    name="albumId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Album</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={(e)=>{
                                        field.onChange(e);
                                        const selectedAlbum = albums.find(album => album.id === e);
                                        navigator.clipboard.writeText(selectedAlbum ? selectedAlbum.name : "");
                                    }}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select an album" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {albums.map((album) => (    
                                            <SelectItem key={album.id} value={album.id}>
                                                {album.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="releaseDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Release Date</FormLabel>
                            <FormControl>
                                <Input
                                    type="date"
                                    placeholder="YYYY-MM-DD"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" type="submit" disabled={isSubmitting}>Update Release Date</Button>
            </form>
        </Form>
    )
}