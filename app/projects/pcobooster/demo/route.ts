const PRODUCT_PREVIEW_URL = "https://pcobooster.com/#product"

export function GET(): Response {
  const accessKey = process.env.PCOBOOSTER_DEMO_ACCESS_KEY?.trim()
  const destination = accessKey
    ? `https://pcobooster.com/demo/${encodeURIComponent(accessKey)}`
    : PRODUCT_PREVIEW_URL

  return new Response(null, {
    status: 307,
    headers: {
      Location: destination,
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  })
}
