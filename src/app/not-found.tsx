import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-content">
      <div className="empty">
        <span>404</span>
        <h1>This page took a different path.</h1>
        <p>
          The software or comparison you’re looking for isn’t in our catalogue.
        </p>
        <Link className="button" href="/software">
          Explore software
        </Link>
      </div>
    </div>
  );
}
