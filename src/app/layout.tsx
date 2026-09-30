import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { admin } from "@/lib/auth";
import { AnalyticsControls } from "@/components/analytics";
import { adsensePublisherId, analyticsMeasurementId } from "@/lib/google";
import "./globals.css";
export const dynamic = "force-dynamic";
const publisher = adsensePublisherId();
export const metadata: Metadata = {
  icons: { icon: "/icon.svg" },
  // Site-ownership verification for AdSense. It makes no network request.
  ...(publisher && { other: { "google-adsense-account": "ca-" + publisher } }),
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Software Alternative — Find your next favorite tool",
    template: "%s | Software Alternative",
  },
  description:
    "Discover software alternatives that fit your workflow. Compare sourced facts, filter by what matters, and find your match.",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const editor = !!(await admin());
  const initialChoice = (await cookies()).get("sa_analytics")?.value ?? "";
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <div className="container nav-row">
            <Link
              className="brand"
              href="/"
              aria-label="Software Alternative home"
            >
              <span className="brand-symbol" aria-hidden="true">
                ↗
              </span>
              <span>
                software<span className="brand-light">alternative</span>
                <span className="brand-dot">.</span>
              </span>
            </Link>
            <nav aria-label="Main navigation">
              <Link href="/software">Explore software</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/guides">Guides</Link>
            </nav>
            <Link className="button nav-cta" href="/find">
              Find my alternative <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <div className="container">
            <div className="footer-top">
              <div>
                <Link className="brand" href="/">
                  <span className="brand-symbol" aria-hidden="true">
                    ↗
                  </span>
                  softwarealternative.
                </Link>
                <p>Good software. Better choices.</p>
              </div>
              <div>
                <Link href="/about">About</Link>
                <Link href="/methodology">Our methodology</Link>
                <Link href="/guides">Guides</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/admin">Editorial admin</Link>
              </div>
            </div>
            <div className="footer-bottom">
              <span>© {new Date().getFullYear()} Software Alternative</span>
              <nav aria-label="Legal">
                <Link href="/privacy">Privacy</Link>
                <Link href="/cookies">Cookies</Link>
                <Link href="/terms">Terms</Link>
                <Link href="/affiliate-disclosure">Affiliate disclosure</Link>
              </nav>
              <span>Made for a better workflow ↗</span>
            </div>
          </div>
        </footer>
        <AnalyticsControls
          editor={editor}
          initialChoice={initialChoice}
          googleId={analyticsMeasurementId()}
        />
      </body>
    </html>
  );
}
