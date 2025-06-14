import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SidebarGroup, SidebarMenuButton } from "@/components/ui/sidebar";
import { sidebarData } from "@/content/sidebar";

export function SidebarConnect() {
    return (
        <SidebarGroup className="px-3 py-4">
            <div className="mb-2 px-3">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Connect</h2>
            </div>
            {sidebarData.contact.map((item) => (
                <Link
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full"
                    key={item.url}
                >
                    <SidebarMenuButton size="lg" className="w-full justify-start gap-3 px-3 py-2.5 hover:bg-[#D5DDDF] active:bg-[#96AAAE] dark:hover:bg-accent/50 dark:active:bg-accent/70 transition-colors group">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-foreground font-medium group-hover:text-foreground transition-colors">{item.title}</span>
                        <ArrowUpRight className="ml-auto size-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                    </SidebarMenuButton>
                </Link>
            ))}
        </SidebarGroup>
    );
} 