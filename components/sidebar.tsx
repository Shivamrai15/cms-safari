"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { 
    Users, 
    CreditCard, 
    Megaphone,
    Mic2, 
    Album, 
    Music, 
    Building2, 
    Hash, 
    FileText, 
    Clock, 
    Tag, 
    Shuffle, 
    Settings, 
    Video, 
    Brain, 
    Heart, 
    Headphones, 
    ActivityIcon,
    Cog,
    Workflow,
    Calendar
} from "lucide-react";

export const Sidebar = () => {
    
    const pathname = usePathname();

    const dataEntryLinks = useMemo(()=>[
        {
            href:"/automate",
            name:"Automate",
            icon: Workflow,
            isActive: pathname === "/automate"
        },
        {
            href:"/artist",
            name:"Artist",
            icon: Mic2,
            isActive: pathname === "/artist"
        },
        {
            href:"/album",
            name:"Album",
            icon: Album,
            isActive: pathname === "/album"
        },
        {
            href:"/song",
            name:"Song",
            icon: Music,
            isActive: pathname === "/song"
        },
        {
            href:"/label",
            name:"Label",
            icon: Building2,
            isActive: pathname === "/label"
        },
        {
            href:"/genre",
            name:"Genre",
            icon: Hash,
            isActive: pathname === "/genre"
        },
        {
            href:"/lyrics",
            name:"Lyrics",
            icon: FileText,
            isActive: pathname === "/lyrics"
        },
        {
            href:"/synced-lyrics",
            name:"Synced Lyrics",
            icon: Clock,
            isActive: pathname === "/synced-lyrics"
        },
        {
            href:"/album-label",
            name:"Album Label",
            icon: Tag,
            isActive: pathname === "/album-label"
        },
        {
            href:"/genre-songs",
            name:"Genre Songs",
            icon: Shuffle,
            isActive: pathname === "/genre-songs"
        },
        {
            href:"/preprocess",
            name:"Pre Process",
            icon: Settings,
            isActive: pathname === "/preprocess"
        },
        {
            href:"/ad",
            name:"Ad",
            icon: Megaphone,
            isActive: pathname === "/ad"
        },
        {
            href:"/video",
            name:"Video",
            icon: Video,
            isActive: pathname === "/video"
        },
        {
            href:"/embeddings",
            name:"Embeddings",
            icon: Brain,
            isActive: pathname === "/embeddings"
        },
        {
            href:"/moods",
            name:"Moods",
            icon: Heart,
            isActive: pathname === "/moods"
        },
        {
            href:"/audio-processing",
            name:"Audio Processing",
            icon: Headphones,
            isActive: pathname === "/audio-processing"
        },
        {
            href:"/release-date",
            name:"Release Date",
            icon: Calendar,
            isActive: pathname === "/release-date"
        }
    ], [pathname]);

    const dashboardLinks = useMemo(()=>[
        {
            href : "/tools",
            name : "Tools",
            icon : Cog,
            isActive : pathname === "/tools"
        },
        {
            href : "/analytics",
            name : "Analytics",
            icon : ActivityIcon,
            isActive : pathname === "/analytics"
        },
        {
            href:"/users",
            name:"Users",
            icon: Users,
            isActive: pathname === "/users"
        },
        {
            href : "/subscriptions",
            name : "Subscriptions",
            icon: CreditCard,
            isActive : pathname === "/subscriptions"
        },
        {
            href : "/ads",
            name : "Advertisements",
            icon: Megaphone,
            isActive : pathname === "/ads"
        }
    ], [pathname]);
    
    return (
        <aside className="w-full space-y-8">
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-zinc-700">Dashboard</h2>
                <ul className="w-full flex flex-col items-start text-zinc-700 space-y-0.5">
                    {
                        dashboardLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    href={link.href}
                                    key={link.href}
                                    className="w-full"
                                >
                                    <Button
                                        variant={link.isActive ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full text-left justify-start gap-2"

                                    >
                                        <Icon className="h-4 w-4" />
                                        {link.name}
                                    </Button>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="space-y-4">
                <h2 className="text-sm font-semibold text-zinc-700">Data Entry</h2>
                <ul className="w-full flex flex-col items-start text-zinc-700 space-y-0.5">
                    {
                        dataEntryLinks.map((link) => {
                            const Icon = link.icon;
                            return (
                                <Link
                                    href={link.href}
                                    key={link.href}
                                    className="w-full"
                                >
                                    <Button
                                        variant={link.isActive ? "secondary" : "ghost"}
                                        size="sm"
                                        className="w-full text-left justify-start gap-2"

                                    >
                                        <Icon className="h-4 w-4" />
                                        {link.name}
                                    </Button>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
        </aside>
    )
}
