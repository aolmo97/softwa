import { adsTxt } from "@/lib/google";
export const dynamic = "force-dynamic";
export function GET() {
  const body = adsTxt();
  return body
    ? new Response(body, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      })
    : new Response("Not found", { status: 404 });
}
