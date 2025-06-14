import { SidebarHeader as SidebarHeaderPrimitive } from "@/components/ui/sidebar";

export function SidebarHeader() {
    return (
        <SidebarHeaderPrimitive className="flex flex-col items-start px-6 py-8 border-b border-border/30">
            <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Jake Bodea</h1>
                <p className="text-sm text-muted-foreground font-medium">AI/ML Professional</p>
            </div>
        </SidebarHeaderPrimitive>
    );
} 