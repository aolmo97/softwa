"use client";
import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { search } from "@/lib/discovery";
import { track } from "./analytics";
type Item = { slug: string; name: string; aliases: string[]; color: string };
export function SearchSoftware({
  items,
  hero = false,
}: {
  items: Item[];
  hero?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const id = useId();
  const router = useRouter();
  const results = search(items, query).slice(0, 6);
  const visible = open && query.trim().length > 0;
  function go(slug?: string) {
    if (query.trim())
      track("search", {
        slug: slug ?? results[0]?.slug ?? "",
        results: results.length,
      });
    setOpen(false);
    router.push(
      slug
        ? "/alternatives/" + slug
        : "/software?q=" + encodeURIComponent(query),
    );
  }
  return (
    <div className={"search-wrap" + (hero ? " hero-search" : "")}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          go(active >= 0 && visible ? results[active]?.slug : undefined);
        }}
      >
        <label className="sr-only" htmlFor={id}>
          Find an alternative to
        </label>
        <span className="search-icon" aria-hidden="true">
          ⌕
        </span>
        <input
          id={id}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={visible}
          aria-controls={id + "-results"}
          aria-activedescendant={
            visible && active >= 0 ? id + "-" + active : undefined
          }
          placeholder="Search software, e.g. Photoshop"
          maxLength={100}
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, results.length - 1));
            }
            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            }
            if (e.key === "Escape") {
              setOpen(false);
              setActive(-1);
            }
          }}
        />
        <button type="submit" aria-label="Search software">
          <span className="search-button-label">Find alternatives</span>{" "}
          <span aria-hidden="true">→</span>
        </button>
      </form>
      {visible && (
        <div className="autocomplete">
          <ul
            id={id + "-results"}
            role="listbox"
            aria-label="Software suggestions"
          >
            {results.map((s, i) => (
              <li
                id={id + "-" + i}
                key={s.slug}
                role="option"
                aria-selected={active === i}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go(s.slug)}
                className={active === i ? "active" : ""}
              >
                <span
                  className="mini-mark"
                  style={{ background: s.color }}
                  aria-hidden="true"
                >
                  {s.name.slice(0, 1)}
                </span>
                <span>{s.name}</span>
                <span className="muted small">Alternatives ↗</span>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <p role="status">
              No software found. Try a shorter name or an alias.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export function CatalogueSearchForm({
  items,
  children,
}: {
  items: Item[];
  children: React.ReactNode;
}) {
  return (
    <form
      action="/software"
      className="form-grid panel"
      onSubmit={(event) => {
        const form = new FormData(event.currentTarget);
        const query = String(form.get("q") ?? "").trim();
        const category = String(form.get("category") ?? "");
        if (!query) return;
        const results = search(items, query).filter(
          (s) =>
            !category ||
            (s as Item & { categories?: string[] }).categories?.includes(
              category,
            ),
        );
        track("search", {
          slug: results[0]?.slug ?? "",
          results: results.length,
        });
      }}
    >
      {children}
    </form>
  );
}
