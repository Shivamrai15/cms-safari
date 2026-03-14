"use client";

import { useMemo, useState } from "react";
import * as z from "zod";
import axios from "axios";
import { Genre, Mood } from "@prisma/client";
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
    SelectValue,
    SelectGroup,
    SelectLabel,
    SelectSeparator,
    SelectTrigger
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { ImageUpdateSchema } from "@/schema/image-update.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ImageUpload } from "@/components/development/utils/image-upload";
import { toast } from "sonner";
import { CopyIcon } from "lucide-react";

interface Props {
    moods : Mood[];
    genres : Genre[];
}

function groupByInitial(items: { id: string; name: string }[]) {
    const grouped: Record<string, { id: string; name: string }[]> = {};
    for (const item of items) {
        const letter = item.name.charAt(0).toUpperCase();
        if (!grouped[letter]) grouped[letter] = [];
        grouped[letter].push(item);
    }
    return Object.keys(grouped).sort().map(letter => ({
        letter,
        items: grouped[letter].sort((a, b) => a.name.localeCompare(b.name))
    }));
}

export const ImageUpdateForm = ({
    moods,
    genres
}: Props) => {
    
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof ImageUpdateSchema>>({
        resolver : zodResolver(ImageUpdateSchema),
        defaultValues : {
            type : "MOOD",
            id : "",
            image : ""
        }
    });

    const selectedType = form.watch("type");
    const selectedId = form.watch("id");
    const currentImage = form.watch("image");

    const groupedItems = useMemo(() => {
        const items = selectedType === "MOOD" ? moods : genres;
        return groupByInitial(items);
    }, [selectedType, moods, genres]);

    const selectedItem = useMemo(() => {
        if (!selectedId) return null;
        const items = selectedType === "MOOD" ? moods : genres;
        return items.find(item => item.id === selectedId);
    }, [selectedId, selectedType, moods, genres]);

    const handleFormSubmit = async (values: z.infer<typeof ImageUpdateSchema>) => {
        try {
            setIsLoading(true);
            await axios.patch("/api/v1/image-update", values);
            toast.success("Image updated successfully");
            form.reset();
        } catch (error) {
            console.error("Error updating image:", error);
            toast.error("Failed to update image");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                className="space-y-6 max-w-md w-full"
                onSubmit={form.handleSubmit(handleFormSubmit)}
            >
                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="mr-4">Type</FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                        form.setValue("id", "");
                                        form.setValue("image", "");
                                    }} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MOOD">Mood</SelectItem>
                                            <SelectItem value="GENRE">Genre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl> 
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="mr-4">
                                    {selectedType === "MOOD" ? "Mood" : "Genre"}
                                </FormLabel>
                                <FormControl>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value);
                                    }} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={`Select a ${selectedType === "MOOD" ? "mood" : "genre"}`} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groupedItems.map((group, index) => (
                                                <div key={group.letter}>
                                                    {index > 0 && <SelectSeparator />}
                                                    <SelectGroup>
                                                        <SelectLabel>{group.letter}</SelectLabel>
                                                        {group.items.map((item) => (
                                                            <SelectItem key={item.id} value={item.id}>
                                                                <span className="text-muted-foreground text-xs mr-2">{item.id.slice(-6)}</span>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    {selectedItem && (
                        <div className="space-y-3">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center justify-center gap-4">
                                    <p className="h-10 px-3 flex items-center justify-center font-mono font-semibold text-zinc-700 bg-neutral-100 border border-zinc-200 rounded-md">
                                        {selectedItem.color}
                                    </p>
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            navigator.clipboard.writeText(`Mood: ${selectedItem.name}, Color: ${selectedItem.color}`);
                                            toast.success("Color code copied to clipboard");
                                        }}
                                        type="button"
                                    >
                                        <CopyIcon className="size-5" />
                                    </Button>
                                </div>
                                <p className="text-sm font-medium">Current Image</p>
                                <div className="size-44 rounded-lg overflow-hidden relative border">
                                    {selectedItem.image ? (
                                        <Image
                                            src={selectedItem.image}
                                            alt={selectedItem.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Image</FormLabel>
                                        <FormControl className="flex items-center justify-center">
                                            <ImageUpload
                                                value={field.value ? [field.value] : []}
                                                disabled={isLoading}
                                                onChange={field.onChange}
                                                onRemove={() => form.setValue("image", "")}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}
                    <Button type="submit" disabled={isLoading} className="w-full">
                        {isLoading ? "Updating..." : "Update Image"}
                    </Button>
                </div>
                
            </form>
        </Form>
    )
}
