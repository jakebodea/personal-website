import { SidebarHeader as SidebarHeaderPrimitive, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

export function SidebarHeader() {
    return (
            <SidebarHeaderPrimitive className="flex flex-row w-full items-center justify-between gap-3 px-3 py-3 border-b border-border/30">
                <Link href="/" className="block mr-auto">
                    <div className="space-y-0.5 text-center w-full">
                        <h1 className="text-xl font-semibold tracking-tight text-foreground">Jake Bodea</h1>
                        <p className="text-xs text-muted-foreground font-medium">AI/ML Professional</p>
                    </div>
                </Link>
                <div className="hidden md:block">
                    <SidebarTrigger className="h-8 w-8" />
                </div>
            </SidebarHeaderPrimitive>
    );
}