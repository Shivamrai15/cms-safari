"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Plus, Server, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const serviceFormSchema = z.object({
    name: z
        .string()
        .min(1, "Service name is required")
        .max(100, "Name must be less than 100 characters"),
    url: z
        .string()
        .min(1, "Service URL is required")
        .url("Please enter a valid URL"),
});


const metadataSchema = z.array(
    z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
    })
);

type ServiceFormValues = z.infer<typeof serviceFormSchema>;
type MetadataEntry = { key: string; value: string };

export const CreateServiceButton = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [metadataEntries, setMetadataEntries] = useState<MetadataEntry[]>([]);
    const [metadataError, setMetadataError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceFormSchema),
        defaultValues: {
            name: "",
            url: "",
        },
    });

    const addMetadataEntry = () => {
        setMetadataEntries([...metadataEntries, { key: "", value: "" }]);
    };

    const removeMetadataEntry = (index: number) => {
        setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
    };

    const updateMetadataEntry = (
        index: number,
        field: "key" | "value",
        value: string
    ) => {
        const updated = [...metadataEntries];
        updated[index][field] = value;
        setMetadataEntries(updated);
        setMetadataError(null);
    };

    const buildMetadataObject = (): Record<string, string> | null => {
        for (const entry of metadataEntries) {
            if (!entry.key.trim() || !entry.value.trim()) {
                setMetadataError("All metadata fields must be filled");
                return null;
            }
        }

        const keys = metadataEntries.map((e) => e.key.trim());
        const uniqueKeys = new Set(keys);
        if (keys.length !== uniqueKeys.size) {
            setMetadataError("Duplicate keys are not allowed");
            return null;
        }
        const metadata: Record<string, string> = {};
        for (const entry of metadataEntries) {
            metadata[entry.key.trim()] = entry.value.trim();
        }

        return metadata;
    };

  const onSubmit = async (values: ServiceFormValues) => {
    const metadata = buildMetadataObject();
    if (metadataEntries.length > 0 && metadata === null) {
      return;
    }

    try {
      setIsLoading(true);

      const payload = {
        name: values.name,
        url: values.url,
        metadata: metadata || {},
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_MAINTENANCE_SERVER}/services`,
        payload
      );

      toast.success("Service created successfully!", {
        description: `${values.name} has been added to your services.`,
      });

      form.reset();
      setMetadataEntries([]);
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Failed to create service:", error);
      
      if (axios.isAxiosError(error)) {
        toast.error("Failed to create service", {
          description: error.response?.data?.message || error.message,
        });
      } else {
        toast.error("Failed to create service", {
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      form.reset();
      setMetadataEntries([]);
      setMetadataError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-neutral-600" />
            Create New Service
          </DialogTitle>
          <DialogDescription>
            Add a new service to your dashboard. Fill in the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Service Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    A unique name to identify your service.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Service URL */}
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    The URL where your service is hosted.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Metadata Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Metadata</h4>
                  <p className="text-xs text-muted-foreground">
                    Add key-value pairs to store additional information.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMetadataEntry}
                  disabled={isLoading}
                  className="gap-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Field
                </Button>
              </div>

              {metadataEntries.length > 0 && (
                <div className="space-y-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                  {metadataEntries.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder="Key"
                        value={entry.key}
                        onChange={(e) =>
                          updateMetadataEntry(index, "key", e.target.value)
                        }
                        disabled={isLoading}
                        className="flex-1 h-9 text-sm"
                      />
                      <Input
                        placeholder="Value"
                        value={entry.value}
                        onChange={(e) =>
                          updateMetadataEntry(index, "value", e.target.value)
                        }
                        disabled={isLoading}
                        className="flex-1 h-9 text-sm"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMetadataEntry(index)}
                        disabled={isLoading}
                        className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {metadataError && (
                <p className="text-sm text-red-500">{metadataError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Service"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};