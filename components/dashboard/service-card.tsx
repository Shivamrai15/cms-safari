"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Service } from "@/types";
import { 
    Server, 
    CheckCircle2, 
    ExternalLink, 
    Clock,
    Globe,
    Info,
    FileJson,
    Trash2,
    Copy,
    Check,
    Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

interface ServiceCardProps {
    service: Service;
}

export const ServiceCard = ({ service }: ServiceCardProps) => {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMetadata = (metadata: JSON) => {
        try {
            if (typeof metadata === 'object' && metadata !== null) {
                return JSON.stringify(metadata, null, 2);
            }
            return String(metadata);
        } catch {
            return 'No metadata available';
        }
    };

    const getMetadataEntries = (metadata: JSON) => {
        try {
            if (typeof metadata === 'object' && metadata !== null) {
                return Object.entries(metadata as unknown as Record<string, unknown>);
            }
            return [];
        } catch {
            return [];
        }
    };

    const copyMetadata = async () => {
        try {
            const metadataString = formatMetadata(service.metadata);
            await navigator.clipboard.writeText(metadataString);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy metadata:', error);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${service.name}"?`)) {
            return;
        }
        try {
            setIsDeleting(true);
            await axios.delete(`${process.env.NEXT_PUBLIC_MAINTENANCE_SERVER}/services/${service.id}`);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete service:', error);
            toast.error('Failed to delete service. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="rounded-xl bg-neutral-50 border-neutral-200">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg text-neutral-600 bg-neutral-100">
                            <Server className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-lg font-semibold text-neutral-700">
                                {service.name}
                            </CardTitle>
                            <CardDescription className="text-xs mt-1 flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {service.url}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Active
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Created: {formatDate(service.created_at)}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 gap-2"
                            >
                                <Info className="h-4 w-4" />
                                View Details
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <Server className="h-5 w-5 text-neutral-600" />
                                    {service.name}
                                </DialogTitle>
                                <DialogDescription className="flex items-center gap-1">
                                    <Globe className="h-3 w-3" />
                                    {service.url}
                                </DialogDescription>
                            </DialogHeader>
                        
                            <div className="space-y-4 pt-4">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                        Active
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Created</span>
                                        <span className="text-neutral-700">{formatDate(service.created_at)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Updated</span>
                                        <span className="text-neutral-700">{formatDate(service.updated_at)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm font-medium text-neutral-700">
                                            <FileJson className="h-4 w-4" />
                                            Metadata
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={copyMetadata}
                                            className="h-8 gap-1.5 text-xs"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="h-3.5 w-3.5 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="h-3.5 w-3.5" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    <div className="bg-neutral-900 rounded-lg p-4 max-h-64 overflow-y-auto">
                                        <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
                                            {formatMetadata(service.metadata)}
                                        </pre>
                                    </div>
                                </div>
                                <div className="pt-2">
                                    <Link href={service.url} target="_blank" className="w-full">
                                        <Button className="w-full gap-2">
                                            <ExternalLink className="h-4 w-4" />
                                            Open Service
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Link href={service.url} target="_blank" className="flex-1">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full gap-2"
                        >
                            <ExternalLink className="h-4 w-4" />
                            Open
                        </Button>
                    </Link>
                
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                        <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

interface ServiceCardsProps {
    services: Service[];
}

export const ServiceCards = ({ services }: ServiceCardsProps) => {
    if (services.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-neutral-100 rounded-full mb-4">
                    <Server className="h-8 w-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-neutral-700 mb-1">No Services Found</h3>
                <p className="text-sm text-muted-foreground">
                    There are no services configured yet.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
            ))}
        </div>
    );
};