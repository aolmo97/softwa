"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { AnalyticsInput } from "@/lib/analytics";

export type AnalyticsEvent =
  | AnalyticsInput["name"]
  | "software_view"
  | "comparison_view";
let queue = Promise.resolve();
let paused = false;
function allowed() {
  return (
    !paused &&
    document.cookie.split("; ").includes("sa_analytics=accepted") &&
    navigator.doNotTrack !== "1" &&
    !(navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl
  );
}
export function track(
  name: AnalyticsEvent,
  properties: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("software-alternative:analytics", {
      detail: { name, properties },
    }),
  );
  // Page views are counted centrally, including product and comparison routes.
  if (
    name === "software_view" ||
    name === "comparison_view" ||
    !allowed() ||
    /^\/(admin|api)(\/|$)/.test(location.pathname)
  )
    return;
  const input = {
    id: crypto.randomUUID(),
    name,
    path: location.pathname,
    device:
      innerWidth < 768 ? "mobile" : innerWidth < 1024 ? "tablet" : "desktop",
    ...(typeof properties.slug === "string" && properties.slug
      ? { slug: properties.slug }
      : {}),
    ...(typeof properties.current === "string" && properties.current
      ? { slug: properties.current }
      : {}),
    ...(typeof properties.results === "number"
      ? { results: properties.results }
      : {}),
    ...(typeof properties.filter === "string"
      ? { filter: properties.filter, enabled: properties.enabled }
      : {}),
    ...(name === "page_view"
      ? {
          referrer:
            typeof properties.referrer === "string" ? properties.referrer : "",
        }
      : {}),
  };
  // Serial delivery also prevents multiple initial events creating multiple visitors.
  queue = queue
    .then(async () => {
      if (!allowed()) return;
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        keepalive: true,
      });
    })
    .catch(() => undefined);
}
export function AnalyticsControls({
  initialChoice = "",
  editor = false,
}: {
  initialChoice?: string;
  editor?: boolean;
}) {
  const pathname = usePathname();
  const [choice, setChoice] = useState(initialChoice);
  const [open, setOpen] = useState(!initialChoice);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const lastPath = useRef("");
  const first = useRef(true);
  const excluded = editor || /^\/admin(\/|$)/.test(pathname);
  useEffect(() => {
    if (excluded || choice !== "accepted" || lastPath.current === pathname)
      return;
    let referrer = "";
    if (first.current && document.referrer) {
      try {
        referrer = new URL(document.referrer).origin;
      } catch {}
    }
    first.current = false;
    lastPath.current = pathname;
    track("page_view", { referrer });
  }, [choice, pathname, excluded]);
  async function choose(next: "accepted" | "declined") {
    setBusy(true);
    setError("");
    paused = true;
    try {
      await queue;
      const response = await fetch("/api/analytics/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ choice: next }),
      });
      if (!response.ok)
        throw new Error("Could not save your preference. Please retry.");
      lastPath.current = "";
      paused = false;
      setChoice(next);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save preference.");
    } finally {
      setBusy(false);
      paused = false;
    }
  }
  if (excluded) return null;
  return (
    <>
      <button
        className="text-button analytics-preferences"
        onClick={() => setOpen(true)}
      >
        Analytics preferences
      </button>
      {open && (
        <section className="consent-panel" aria-label="Analytics preferences">
          <div>
            <strong>Help us improve software discovery</strong>
            <p>
              Allow optional first-party analytics to count visits and tool
              interest? We use random cookie identifiers, not names or IP
              addresses. <Link href="/cookies">Cookie details</Link>
            </p>
          </div>
          <div className="consent-actions">
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => choose("declined")}
            >
              Decline analytics
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => choose("accepted")}
            >
              Allow analytics
            </button>
            {choice && (
              <button className="text-button" onClick={() => setOpen(false)}>
                Close preferences
              </button>
            )}
          </div>
          {error && <p role="alert">{error}</p>}
        </section>
      )}
    </>
  );
}
export function PageEvent({
  name,
  slug,
}: {
  name: AnalyticsEvent;
  slug: string;
}) {
  useEffect(() => {
    track(name, { slug });
  }, [name, slug]);
  return null;
}
export function TrackedLink({
  href,
  event,
  slug,
  children,
  className,
  rel,
}: {
  href: string;
  event: AnalyticsEvent;
  slug: string;
  children: React.ReactNode;
  className?: string;
  rel?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      rel={rel}
      onClick={() => track(event, { slug })}
    >
      {children}
    </a>
  );
}
