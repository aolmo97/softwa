export const legalPages: Record<
  string,
  { title: string; paragraphs: string[]; ownerRequired?: boolean }
> = {
  about: {
    title: "Better software choices start with better information.",
    paragraphs: [
      "Software Alternative is a curated directory for discovering and comparing software. We focus on relevant alternatives, checkable sources and requirements that matter to the person choosing a tool.",
      "Our initial catalogue is intentionally small. Facts are recorded from official product pages and project documentation. Listings are not hands-on reviews, and inclusion does not imply endorsement.",
      "You can inspect a product’s evidence, filter the alternatives, or use Find my alternative to calculate a match against your preferences. We do not use an LLM to invent product details or scores.",
    ],
  },
  methodology: {
    title: "Understand the match. Make your own choice.",
    paragraphs: [
      "Candidate selection: only products linked by an editorial alternative relationship are considered. Relationships explain the shared workflow and its limits. A similar category alone does not create a comparison.",
      "Requirements: a mandatory requirement must have a verified positive match. Unknown or incompatible data excludes the candidate. Missing platform and feature records mean unknown, not unsupported.",
      "Formula: each satisfied criterion earns its weight. Unknown criteria earn zero. A verified mismatch subtracts one quarter of its weight. The score is 100 × (earned weight − penalties) / total weight, rounded and clamped to 0–100. Data coverage reports the weighted proportion of known criteria. No selected criteria means no score.",
      "Scores describe structured product-level facts, not a guarantee that all features are available together on the cheapest plan. A free entry option counts as zero cost. Annual USD prices are divided by 12. One-time prices and other currencies are not converted to monthly budgets. Always check plan and edition notes.",
      "Alternatives pages show feature overlap against the original product’s verified features. Find my alternative uses your selected requirements and weights. Ties are ordered by data coverage, then software slug. Sponsored and premium status and affiliate commissions are never inputs.",
      "Verification is field-specific. Each source records its URL, access date, verification date, covered fields and notes. An unverified field stays explicitly unknown. Editors can review stale evidence; a recent check of one field does not verify the whole product.",
      "Only reviewed pairs and sufficiently useful editorial guides have indexable pages. Query filters are noindex. A guide requires differentiated content and at least three matching alternatives.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    ownerRequired: true,
    paragraphs: [
      "Search and comparison browsing do not require an account. Optional analytics run only after you choose Allow analytics; you can decline or withdraw permission using Analytics preferences in the footer. No advertising scripts are currently loaded.",
      "Google Analytics: with your permission this site also uses Google Analytics 4, provided by Google, to measure visits. Google receives the page path, browser and device details and technical data such as your IP address in order to provide the service. Google signals and advertising personalisation are disabled, query strings are not sent, and events stop when you decline or withdraw permission. Retention settings are configured in the Analytics property and the operator must document them.",
      "Advertising: the operator has applied to Google AdSense. No advertisements are displayed yet. Before any are shown, a consent message will be presented as required and this policy will be updated.",
      "With permission, analytics records public page paths, catalogue tools searched or viewed, search result counts, filters, match completion counts, referring domains and broad viewport sizes. Random browser and session identifiers are stored as hashes. The application does not store IP addresses, raw search text, full referrer URLs, match criteria or account identities in analytics. These pseudonymous events are retained for 180 days and reported to signed-in editors as aggregate counts.",
      "A visitor count estimates browsers that accepted analytics, not individual people. Analytics respects Do Not Track and Global Privacy Control signals, and excludes signed-in editors and recognised bots. Withdrawing permission stops future collection and removes the analytics identifier cookies; previously recorded events expire under the retention period.",
      "Editorial accounts store a username and a salted password hash. Sign-in creates a necessary HttpOnly session cookie with an eight-hour lifetime. The database retains session hashes, short-lived request counters and an editorial audit trail.",
      "The hosting provider may process IP addresses and access logs. The operator must document the actual hosting provider, logging settings, retention periods, legal bases, rights and contact details before public launch.",
      "Outbound links take you to independent vendors, whose privacy practices apply on their sites. Any further third-party analytics or advertising integration requires a review of these notices and consent controls.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    ownerRequired: true,
    paragraphs: [
      "Public browsing does not require application cookies. The editorial admin uses sa_admin, an essential session cookie lasting up to eight hours. It is HttpOnly, SameSite=Strict and Secure when deployed over HTTPS.",
      "The sa_analytics preference cookie remembers your allow or decline choice for 180 days. Optional analytics identifier cookies are created only after permission: sa_visitor lasts up to 180 days and sa_visit expires after 30 minutes without a recorded event. These identifiers are random, HttpOnly, SameSite=Lax and Secure on HTTPS deployments. They are not used for advertising.",
      "Use Analytics preferences in the footer to change your choice. Declining removes sa_visitor and sa_visit and stops future measurement. Our own analytics uses no browser local storage and sends no events to external providers. Browser Do Not Track and Global Privacy Control signals prevent event recording.",
      "Google Analytics cookies: after you allow analytics, Google Analytics sets _ga and _ga_<container ID>, which last up to two years and distinguish browsers and sessions. Declining or withdrawing permission stops sending and removes them. They are not used for advertising on this site.",
      "The operator must review cookies added by the final hosting stack and any future monetization integrations, and update this policy and consent controls as appropriate.",
    ],
  },
  terms: {
    title: "Terms of Use",
    ownerRequired: true,
    paragraphs: [
      "Software Alternative provides informational listings and comparisons. Product facts may change. Check the original vendor’s current terms, pricing, license and technical requirements before purchasing or migrating.",
      "Match scores describe a rules-based comparison of recorded data with selected preferences. They do not guarantee fitness, compatibility or availability of a particular feature on a particular plan.",
      "Product names and trademarks belong to their respective owners. Listing a product does not imply a partnership or endorsement. Do not misuse the service or attempt unauthorized access to its editorial systems.",
      "The operator must complete applicable entity details, contact information, jurisdiction, consumer rights, liability provisions and dispute terms before relying on this draft for a public service.",
    ],
  },
  "affiliate-disclosure": {
    title: "Affiliate disclosure",
    paragraphs: [
      "Some links may be affiliate links. If you follow an enabled partner link and make a purchase, the site may receive a commission. An affiliate link is labeled as a partner link and carries sponsored and nofollow attributes.",
      "Sponsored listings are visibly marked. Premium status can support an enhanced listing, but neither payment nor commission changes the recommendation formula or its ordering.",
      "No affiliate program is enabled and no advertisement is currently displayed. The operator has applied to Google AdSense; if advertising starts, ads will be labeled, will never affect match scores and will load only after the required consent controls are in place.",
    ],
  },
  contact: {
    title: "Get in touch",
    ownerRequired: true,
    paragraphs: [
      "Found an outdated fact or a missing alternative? Include the product name, the field that needs attention and an official source URL so the information can be reviewed.",
      "The public contact channel will appear here when the operator configures it.",
    ],
  },
};
