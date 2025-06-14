import React from "react";

export default function EmphasisText({ children }: { children: React.ReactNode }) {
    return <span className="text-foreground font-medium bg-accent/20 px-2 py-0.5 rounded">{children}</span>;
}