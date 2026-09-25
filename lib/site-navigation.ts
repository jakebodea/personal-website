import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";

import type { FileRoutesByTo } from "@/src/routeTree.gen";

const APP_ROUTES = [
  "/",
  "/chat",
  "/contact",
  "/quotes",
  "/timeline",
  "/writings/$slug",
  "/projects",
  "/writings",
  "/api/chat/follow-ups",
  "/projects/pcobooster/demo",
  "/api/chat",
] as const satisfies readonly (keyof FileRoutesByTo)[];

const isAppRoute = (href: string): href is keyof FileRoutesByTo => {
  for (const route of APP_ROUTES) {
    if (href === route) {
      return true;
    }
  }
  return false;
};

export const usePathname = () =>
  useRouterState({ select: (state) => state.location.pathname });

export const useSiteRouter = () => {
  const navigate = useNavigate();
  return useMemo(
    () => ({
      push: async (href: string) => {
        if (!isAppRoute(href)) {
          return;
        }
        await navigate({ to: href });
      },
    }),
    [navigate]
  );
};
