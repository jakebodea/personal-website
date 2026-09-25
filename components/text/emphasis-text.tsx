import type { ReactNode } from "react";

const EmphasisText = ({ children }: { children: ReactNode }) => (
  <span className="rounded bg-accent/20 px-2 py-0.5 font-medium text-foreground">
    {children}
  </span>
);

export default EmphasisText;
