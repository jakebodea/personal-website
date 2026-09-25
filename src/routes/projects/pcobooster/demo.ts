import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

const PRODUCT_PREVIEW_URL = "https://pcobooster.com/#product";

const getDemoRedirect = (): Response => {
  const accessKey = env.PCOBOOSTER_DEMO_ACCESS_KEY?.trim();
  const destination =
    accessKey !== undefined && accessKey !== ""
      ? `https://pcobooster.com/demo/${encodeURIComponent(accessKey)}`
      : PRODUCT_PREVIEW_URL;

  return new Response(null, {
    status: 307,
    headers: {
      Location: destination,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
};

const handleGet = (): Response => getDemoRedirect();

export const Route = createFileRoute("/projects/pcobooster/demo")({
  server: { handlers: { GET: handleGet } },
});
