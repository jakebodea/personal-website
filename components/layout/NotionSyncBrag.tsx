import { Database } from "lucide-react"

export function NotionSyncBrag() {
    return (
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground mb-8">
            <Database className="h-3.5 w-3.5 opacity-70" />
            <span>Synced from my Notion database</span>
        </div>
    )
}