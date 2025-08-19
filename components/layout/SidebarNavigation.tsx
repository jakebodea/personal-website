import Link from "next/link";
import { SidebarGroup, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { sidebarData } from "@/content/sidebar-data";

export function SidebarNavigation() {
    const { isMobile, setOpenMobile } = useSidebar();
    return (
        <SidebarGroup className="px-3 py-4">
            <div className="mb-2">
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider text-left">Navigation</h2>
            </div>
            {sidebarData.pages.map((item, index) => (
                <Link href={item.url} key={item.url} onClick={() => { if (isMobile) setOpenMobile(false) }}>
                    <SidebarMenuButton size="lg" className="w-full justify-start gap-3 px-3 py-2.5 hover:bg-muted/20 active:bg-muted/50 transition-colors group">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-foreground font-medium group-hover:text-foreground transition-colors">{item.title}</span>
                        <span className="ml-auto text-xs text-muted-foreground/60 font-mono hidden md:inline">{index + 1}</span>
                    </SidebarMenuButton>
                </Link>
            ))}
        </SidebarGroup>
    );
} 