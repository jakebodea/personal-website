import handler, { createServerEntry } from "@tanstack/react-start/server-entry";

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url);

    if (url.hostname === "www.jakebodea.com") {
      url.hostname = "jakebodea.com";
      return Response.redirect(url, 307);
    }

    return await handler.fetch(request);
  },
});
