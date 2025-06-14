import { SidebarFooter as SidebarFooterPrimitive } from "@/components/ui/sidebar";

export function SidebarFooter() {
    return (
        <SidebarFooterPrimitive>
            <div className="px-6 py-4 border-t border-border/30 space-y-3">
                <div className="text-xs text-muted-foreground">
                    <p>Use <kbd className="px-1.5 py-0.5 text-xs bg-muted/30 rounded font-mono">1-4</kbd> to navigate</p>
                </div>
                <div className="text-xs text-muted-foreground">
                    <p>Press <kbd className="px-1.5 py-0.5 text-xs bg-muted/30 rounded font-mono">T</kbd> to toggle theme</p>
                </div>
            </div>
        </SidebarFooterPrimitive>
    );
} 