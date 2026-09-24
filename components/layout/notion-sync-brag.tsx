import { Database } from "lucide-react";

export const NotionSyncBrag = () => (
  <div className="mb-8 inline-flex items-center gap-2 text-xs text-muted-foreground">
    <Database className="h-3.5 w-3.5 opacity-70" />
    <span>Synced from my Notion database</span>
  </div>
);
