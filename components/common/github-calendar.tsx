"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { GitHubCalendar } from "react-github-calendar";

const emptySubscribe = (_onStoreChange: () => void) => () => {
  /* Static client snapshot; no subscription needed. */
};

const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

export const GithubContributions = () => {
  const mounted = useIsClient();
  const { resolvedTheme } = useTheme();

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Many of my company projects are under NDA and can&apos;t be shown here,
        but my GitHub contribution calendar gives an idea of my output.
      </p>
      <a
        href="https://github.com/jakebodea"
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-x-auto"
      >
        {mounted ? (
          <GitHubCalendar
            username="jakebodea"
            colorScheme={resolvedTheme === "light" ? "light" : "dark"}
          />
        ) : null}
      </a>
    </div>
  );
};
