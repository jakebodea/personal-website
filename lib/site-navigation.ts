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

// `location` updates as soon as navigation starts, while `<Outlet />` keeps
// rendering the previous route until loaders resolve. Use the leaf match's
// pathname when something must stay in sync with the rendered page.
export const useRenderedPathname = () =>
  useRouterState({
    select: (state) =>
      state.matches.at(-1)?.pathname ?? state.location.pathname,
  });

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
