import { enrichProduct, CONTENT_REVISION } from "./catalogue-content";
import {
  additionFeatureNames,
  additionProducts,
  additionRelations,
} from "./catalogue-additions";
import { db } from "./db";
import {
  emptyFlags,
  flags,
  slugify,
  type SoftwareInput,
  type Flag,
  type Source,
} from "./model";
import { saveResource, getSoftware } from "./repository";
const checked = "2026-09-21";
const categories = [
  "Design",
  "Photo Editing",
  "Video Editing",
  "Productivity",
  "Project Management",
  "Communication",
  "CRM",
  "Accounting",
  "Development",
  "Code Editors",
  "AI Tools",
  "Marketing",
  "Analytics",
  "Email Marketing",
  "Cybersecurity",
  "Cloud Storage",
  "Password Managers",
  "Office Suites",
  "3D",
  "Audio Editing",
];
const featureNames = [
  "Photo editing",
  "Layers",
  "Digital painting",
  "Vector graphics",
  "Prototyping",
  "Team collaboration",
  "Video editing",
  "Color grading",
  "Notes",
  "Markdown",
  "Task management",
  "Chat",
  "Video calls",
  "Code editing",
  "File sharing",
  "Password management",
  "Encryption",
  "Templates",
];
type Entry = {
  slug: string;
  name: string;
  description: string;
  category: string;
  url: string;
  color: string;
  feature: string[];
  platform?: string[];
  facts?: Partial<Record<Flag, boolean>>;
  model?: SoftwareInput["pricingModel"];
  license?: string;
  price?: number;
  period?: SoftwareInput["plans"][number]["period"];
  priceNotes?: string;
  aliases?: string[];
  sourceUrl?: string;
  note?: string;
  extra?: Source[];
  sourceExclude?: string[];
};
const entries: Entry[] = [
  {
    slug: "photoshop",
    name: "Adobe Photoshop",
    description:
      "Photo editing and compositing with layers, selections and generative image tools.",
    category: "Photo Editing",
    url: "https://www.adobe.com/products/photoshop.html",
    color: "#2463eb",
    feature: ["photo-editing", "layers"],
    platform: ["web"],
    facts: { freeTrial: true, aiFeatures: true },
    model: "subscription",
    price: 22.99,
    period: "month",
    priceNotes:
      "US individual Photoshop single-app plan. Annual commitment, billed monthly; other bundles and mobile plans differ. Check tax and cancellation terms.",
    aliases: ["Photoshop", "Adobe Photoshop CC"],
    note: "Official product page describes image compositing, layers, web access and generative features; single-app US annual plan is billed monthly.",
  },
  {
    slug: "gimp",
    name: "GIMP",
    description:
      "An open-source image editor for retouching photographs, creating composites and original artwork.",
    category: "Photo Editing",
    url: "https://www.gimp.org/",
    color: "#5a5349",
    feature: ["photo-editing"],
    platform: ["windows", "macos", "linux"],
    facts: { freePlan: true, openSource: true },
    model: "free",
    price: 0,
    period: "free",
    aliases: ["GNU Image Manipulation Program"],
    note: "Homepage explicitly identifies a free open-source image editor for GNU/Linux, macOS and Windows, with retouching and compositing.",
  },
  {
    slug: "krita",
    name: "Krita",
    description:
      "A free, open-source painting application with brushes, layers and animation tools for digital artists.",
    category: "Photo Editing",
    url: "https://krita.org/en/",
    color: "#ac258b",
    feature: ["digital-painting", "layers"],
    platform: ["windows", "macos", "linux"],
    facts: { freePlan: true, openSource: true },
    model: "free",
    license: "GNU GPL",
    price: 0,
    period: "free",
    note: "Painting, brushes, layers, animation, free distribution and GNU GPL are described on the homepage. Painting-focused candidate; evaluate photo workflows separately.",
    sourceExclude: ["platform:windows", "platform:macos", "platform:linux"],
    extra: [
      {
        id: "downloads",
        title: "Krita downloads",
        url: "https://krita.org/en/download/",
        accessedAt: checked,
        verifiedAt: checked,
        fields: ["platform:windows", "platform:macos", "platform:linux"],
        notes:
          "Official download page lists Windows, macOS and Linux installers.",
        status: "VERIFIED",
      },
    ],
  },
  {
    slug: "canva",
    name: "Canva",
    description:
      "A visual design platform for templates, photo editing and branded content, with free and paid plans.",
    category: "Photo Editing",
    url: "https://www.canva.com/",
    sourceUrl: "https://www.canva.com/pricing/",
    color: "#087e8b",
    feature: ["photo-editing", "templates"],
    facts: { freePlan: true, freeTrial: true, aiFeatures: true, cloud: true },
    model: "freemium",
    price: 0,
    period: "free",
    note: "Pricing page lists Canva Free, Pro trials, photo tools, templates, cloud storage and AI usage limits. Free access does not include all premium assets.",
  },
  {
    slug: "figma",
    name: "Figma",
    description:
      "A collaborative product design workspace with interface design, prototyping and AI tools.",
    category: "Design",
    url: "https://www.figma.com/",
    color: "#c4503e",
    feature: ["prototyping", "team-collaboration"],
    facts: { aiFeatures: true },
    aliases: ["Figma Design"],
    note: "Homepage describes design, prototyping, shared team work and AI. Paid prices and free-plan limits remain unverified.",
  },
  {
    slug: "penpot",
    name: "Penpot",
    description:
      "An open-source interface design platform with collaboration, prototyping and self-hosting.",
    category: "Design",
    url: "https://penpot.app/",
    color: "#147764",
    feature: ["prototyping", "team-collaboration"],
    facts: { openSource: true, selfHosted: true, apiAvailable: true },
    note: "Official homepage identifies open source, self-host installation, collaboration, prototyping and Integration & API resources.",
  },
  {
    slug: "illustrator",
    name: "Adobe Illustrator",
    description:
      "Vector drawing software for logos, illustrations and brand graphics, with generative design tools.",
    category: "Design",
    url: "https://www.adobe.com/products/illustrator.html",
    color: "#9c5b00",
    feature: ["vector-graphics"],
    facts: { freeTrial: true, aiFeatures: true },
    model: "subscription",
    price: 22.99,
    period: "month",
    priceNotes:
      "US single-app individual plan, annual commitment billed monthly. Taxes and cancellation terms must be checked.",
    aliases: ["Illustrator"],
    note: "Official product and pricing page describes vector illustration, generative tools and the annual billed-monthly plan.",
  },
  {
    slug: "inkscape",
    name: "Inkscape",
    description:
      "A free, open-source vector editor using SVG for illustrations, icons, logos and diagrams.",
    category: "Design",
    url: "https://inkscape.org/",
    sourceUrl: "https://github.com/inkscape/inkscape/blob/master/README.md",
    color: "#484b55",
    feature: ["vector-graphics"],
    platform: ["windows", "macos", "linux"],
    facts: { freePlan: true, openSource: true },
    model: "free",
    price: 0,
    period: "free",
    note: "Official project README verifies free open-source SVG editing on Windows, macOS and Linux. Main website blocked automated access; project-owned repository used.",
  },
  {
    slug: "premiere-pro",
    name: "Adobe Premiere",
    description:
      "A video editing application for timelines, title animation, effects and sound mixing.",
    category: "Video Editing",
    url: "https://www.adobe.com/products/premiere.html",
    color: "#6c3cba",
    feature: ["video-editing"],
    facts: { freeTrial: true },
    model: "subscription",
    price: 22.99,
    period: "month",
    priceNotes:
      "US single-app annual plan billed monthly. Extra stock and Firefly content may cost more.",
    aliases: ["Premiere", "Premiere Pro", "Adobe Premiere Pro"],
    note: "Product page names video editing, titles, sound mixing, seven-day trial and US annual billed-monthly pricing.",
  },
  {
    slug: "davinci-resolve",
    name: "DaVinci Resolve",
    description:
      "Video editing, color grading, visual effects and audio tools, available in Free and Studio editions.",
    category: "Video Editing",
    url: "https://www.blackmagicdesign.com/products/davinciresolve",
    color: "#246b78",
    feature: ["video-editing", "color-grading", "team-collaboration"],
    platform: ["windows", "macos", "linux"],
    facts: { freePlan: true, aiFeatures: true, cloud: true },
    price: 0,
    period: "free",
    aliases: ["DaVinci", "Resolve"],
    note: "Official page lists Free and Studio editions, Mac/Windows/Linux, collaboration and AI in Studio. Free edition has format and resolution limits; AI availability is edition-specific.",
  },
  {
    slug: "kdenlive",
    name: "Kdenlive",
    description:
      "A free, open-source non-linear video editor with timeline editing, effects and audio tools.",
    category: "Video Editing",
    url: "https://kdenlive.org/",
    color: "#235a98",
    feature: ["video-editing"],
    platform: ["windows", "macos", "linux"],
    facts: { freePlan: true, openSource: true },
    model: "free",
    price: 0,
    period: "free",
    note: "Homepage explicitly lists free/open-source status, supported desktop platforms, timeline editing, effects and audio tools.",
  },
  {
    slug: "notion",
    name: "Notion",
    description:
      "A shared workspace connecting documents, notes, wikis and project tasks, with AI assistance.",
    category: "Productivity",
    url: "https://www.notion.com/",
    sourceUrl:
      "https://www.notion.com/help/guides/connected-workspace-for-product-teams-to-collaborate-ideate-and-launch",
    color: "#34353a",
    feature: ["notes", "task-management", "team-collaboration"],
    facts: { aiFeatures: true },
    note: "Official product-team guide describes docs, notes, wikis, project management and drafting with Notion AI. Pricing and platform details remain unverified.",
  },
  {
    slug: "obsidian",
    name: "Obsidian",
    description:
      "A note-taking application that keeps notes on your device and supports offline access and plugins.",
    category: "Productivity",
    url: "https://obsidian.md/",
    color: "#7844bc",
    feature: ["notes"],
    platform: ["windows"],
    facts: { freePlan: true, offlineSupport: true, commercialUse: true },
    price: 0,
    period: "free",
    sourceExclude: ["commercialUse", "plan:base"],
    extra: [
      {
        id: "pricing",
        title: "Obsidian pricing",
        url: "https://obsidian.md/pricing",
        accessedAt: checked,
        verifiedAt: checked,
        fields: ["commercialUse", "plan:base"],
        notes:
          "Commercial use does not require payment; optional support licenses and add-on services are available.",
        status: "VERIFIED",
      },
    ],
    note: "Homepage describes a free app, Windows download, local notes, plugins and offline access. Paid Sync and Publish are optional.",
  },
  {
    slug: "joplin",
    name: "Joplin",
    description:
      "An open-source note-taking app with multimedia notes, Markdown editing, synchronization and encryption.",
    category: "Productivity",
    url: "https://joplinapp.org/",
    color: "#2268b0",
    feature: ["notes", "markdown", "encryption"],
    platform: ["windows", "macos", "linux", "android", "ios"],
    facts: { openSource: true, apiAvailable: true },
    note: "Homepage lists multimedia notes, Markdown, extension API, encryption and five platforms. Hosted Joplin Cloud is a separate offering.",
  },
  {
    slug: "trello",
    name: "Trello",
    description:
      "A visual tool for organizing tasks and projects with boards, an inbox and planning tools.",
    category: "Project Management",
    url: "https://trello.com/",
    color: "#176abb",
    feature: ["task-management", "team-collaboration"],
    facts: { freePlan: true },
    price: 0,
    period: "free",
    note: "Official homepage describes boards and task management, with a free plan for individuals or small teams.",
  },
  {
    slug: "asana",
    name: "Asana",
    description:
      "A work and project management platform for coordinating team tasks, plans and AI-assisted workflows.",
    category: "Project Management",
    url: "https://asana.com/",
    color: "#b93d59",
    feature: ["task-management", "team-collaboration"],
    facts: { aiFeatures: true },
    note: "Homepage describes work management, project plans with tasks and owners, and AI teammates. Pricing and platform support require further review.",
  },
  {
    slug: "slack",
    name: "Slack",
    description:
      "A communication workspace with team channels, direct conversations and video huddles.",
    category: "Communication",
    url: "https://slack.com/",
    color: "#714278",
    feature: ["chat", "video-calls", "team-collaboration"],
    facts: { aiFeatures: true },
    note: "Official homepage describes channels, Slack Connect, video huddles and AI meeting notes. Entitlements vary by plan.",
  },
  {
    slug: "discord",
    name: "Discord",
    description:
      "A group communication app with text, voice and video conversations for communities.",
    category: "Communication",
    url: "https://discord.com/",
    color: "#535ccd",
    feature: ["chat", "video-calls"],
    platform: ["windows", "web"],
    note: "Homepage describes text, voice and video chat and links Windows downloads and browser access. Other platform and pricing facts remain unverified.",
  },
  {
    slug: "visual-studio-code",
    name: "Visual Studio Code",
    description:
      "Microsoft's code editor with desktop and browser versions and integrated AI development tools.",
    category: "Code Editors",
    url: "https://code.visualstudio.com/",
    color: "#1578ab",
    feature: ["code-editing"],
    platform: ["windows", "macos", "linux", "web"],
    facts: { aiFeatures: true, openSource: false },
    aliases: ["VS Code", "VSCode"],
    sourceExclude: ["openSource"],
    extra: [
      {
        id: "distribution-license",
        title: "VSCodium: VS Code distribution licensing",
        url: "https://vscodium.com/",
        accessedAt: checked,
        verifiedAt: checked,
        fields: ["openSource"],
        notes:
          "Microsoft's official VS Code binaries use a non-FLOSS license; the underlying source is MIT. This record represents the Microsoft distribution.",
        status: "VERIFIED",
      },
    ],
    note: "Official homepage provides Windows, macOS, Linux and web editions with AI coding tools. Open-source classification is scoped to the distributed binary.",
  },
  {
    slug: "vscodium",
    name: "VSCodium",
    description:
      "A community distribution of the VS Code editor, with MIT-licensed binaries and telemetry disabled.",
    category: "Code Editors",
    url: "https://vscodium.com/",
    color: "#28698e",
    feature: ["code-editing"],
    platform: ["windows", "macos", "linux"],
    facts: { freePlan: true, openSource: true },
    model: "free",
    license: "MIT",
    price: 0,
    period: "free",
    note: "Official project website describes freely licensed binaries, MIT license, disabled telemetry and Windows, macOS and Linux releases.",
  },
  {
    slug: "dropbox",
    name: "Dropbox",
    description: "A cloud storage platform for storing and sharing files.",
    category: "Cloud Storage",
    url: "https://www.dropbox.com/",
    color: "#2450c9",
    feature: ["file-sharing"],
    facts: { cloud: true },
    note: "Official homepage describes cloud storage and file sharing. Prices, platform support and offline behavior remain unverified.",
  },
  {
    slug: "nextcloud",
    name: "Nextcloud Files",
    description:
      "An open-source file synchronization and sharing platform that can run on your own server.",
    category: "Cloud Storage",
    url: "https://nextcloud.com/files/",
    color: "#137bba",
    feature: ["file-sharing"],
    platform: ["windows", "macos", "linux", "android", "ios"],
    facts: { openSource: true, selfHosted: true },
    aliases: ["Nextcloud"],
    note: "Official Files page identifies open-source sync/share, self-host server downloads and desktop/mobile clients. Hosting and operational costs are not assumed to be zero.",
  },
  {
    slug: "bitwarden",
    name: "Bitwarden",
    description:
      "An open-source password manager with encrypted vaults, password sharing and self-hosting options.",
    category: "Password Managers",
    url: "https://bitwarden.com/",
    color: "#285dc9",
    feature: ["password-management", "encryption"],
    facts: { freePlan: true, openSource: true, selfHosted: true },
    price: 0,
    period: "free",
    note: "Official homepage describes open-source encrypted password management, an always-free basic plan and self-hosting. Some features are plan-specific.",
  },
  {
    slug: "1password",
    name: "1Password",
    description:
      "A password and credential management platform for individuals and organizations.",
    category: "Password Managers",
    url: "https://1password.com/",
    color: "#21659a",
    feature: ["password-management"],
    platform: ["windows", "macos", "linux", "android", "ios"],
    aliases: ["OnePassword"],
    note: "Homepage identifies password and credential management and lists downloads for these desktop and mobile platforms. Prices and licensing remain unverified.",
  },
];
export function originalSeedProducts(): SoftwareInput[] {
  return entries.map((e) => {
    const facts = { ...emptyFlags(), ...e.facts };
    const platforms = e.platform ?? [];
    const plans =
      e.price === undefined
        ? []
        : [
            {
              id: "base",
              name:
                e.price === 0
                  ? "Free entry option"
                  : "Individual single-app plan",
              amount: e.price,
              currency: "USD" as const,
              period: e.period ?? "unknown",
              notes:
                e.priceNotes ??
                "Check the official source for edition limits, optional services and current terms.",
            },
          ];
    const fields = [
      "description",
      ...flags.filter((f) => facts[f] !== null),
      ...e.feature.map((f) => "feature:" + f),
      ...platforms.map((p) => "platform:" + p),
      ...plans.map((p) => "plan:" + p.id),
      ...(e.model ? ["pricingModel"] : []),
      ...(e.license ? ["license"] : []),
    ].filter((f) => !e.sourceExclude?.includes(f));
    return {
      slug: e.slug,
      name: e.name,
      shortDescription: e.description,
      description: e.description,
      company: null,
      website: e.url,
      logo: null,
      color: e.color,
      aliases: e.aliases ?? [],
      categories: [slugify(e.category)],
      flags: facts,
      platforms,
      features: e.feature,
      pricingModel: e.model ?? "unknown",
      license: e.license ?? null,
      plans,
      pros: [],
      cons: [],
      useCases: e.feature.map((f) => f.replaceAll("-", " ")),
      sources: [
        {
          id: "official",
          title: e.name + " — official product information",
          url: e.sourceUrl ?? e.url,
          accessedAt: checked,
          verifiedAt: checked,
          fields,
          notes: e.note ?? "",
          status: "VERIFIED" as const,
        },
        ...(e.extra ?? []),
      ],
      published: true,
      premium: false,
      sponsored: false,
      version: 0,
    };
  });
}
export function seedProducts(): SoftwareInput[] {
  return [...originalSeedProducts().map(enrichProduct), ...additionProducts()];
}
const additionSlugs = new Set(additionProducts().map((p) => p.slug));
const pairs: [string, string, string, boolean][] = [
  [
    "photoshop",
    "gimp",
    "Both support photo manipulation and composites. GIMP is free and open source; test your required editing workflow and file exchange before switching.",
    true,
  ],
  [
    "photoshop",
    "krita",
    "Relevant for drawing and layered artwork. Krita focuses on digital painting; it is not a verified replacement for every Photoshop photography workflow.",
    true,
  ],
  [
    "photoshop",
    "canva",
    "Relevant for template-based graphics and photo content. Compare the exact tools and premium asset limits you need before switching.",
    true,
  ],
  [
    "gimp",
    "krita",
    "Compare a photo-manipulation workflow with a painting-focused workflow. Both have free desktop distributions.",
    false,
  ],
  [
    "figma",
    "penpot",
    "Both target collaborative interface design and prototyping. Penpot additionally offers verified self-hosting.",
    true,
  ],
  [
    "illustrator",
    "inkscape",
    "Both support vector artwork. Compare import/export requirements and print workflows using your own files.",
    true,
  ],
  [
    "premiere-pro",
    "davinci-resolve",
    "Both offer video editing. Resolve also publishes color and audio tools and a free edition with format limits.",
    true,
  ],
  [
    "premiere-pro",
    "kdenlive",
    "Both offer non-linear video editing. Kdenlive provides a free open-source desktop option.",
    true,
  ],
  [
    "davinci-resolve",
    "kdenlive",
    "Both offer desktop video editing. Check codec support, effects and collaboration requirements for your projects.",
    false,
  ],
  [
    "notion",
    "obsidian",
    "Relevant for notes and knowledge organization. Compare Notion's shared workspace with Obsidian's verified local and offline note storage.",
    true,
  ],
  [
    "notion",
    "joplin",
    "Relevant for note-taking. Joplin publishes open-source note tools; its hosted collaboration is a separate service.",
    true,
  ],
  [
    "obsidian",
    "joplin",
    "Both organize personal notes. Compare local storage, synchronization options and extensions for your workflow.",
    true,
  ],
  [
    "trello",
    "asana",
    "Both organize team tasks and projects. Compare board workflows with the project-planning features you need.",
    true,
  ],
  [
    "slack",
    "discord",
    "Both offer group conversations and video. Compare workplace channels with community chat for your audience; business compliance is not verified here.",
    true,
  ],
  [
    "visual-studio-code",
    "vscodium",
    "Both use the VS Code editor codebase. Their distributed licenses differ; verify required extensions before migrating.",
    true,
  ],
  [
    "dropbox",
    "nextcloud",
    "Both offer file sharing. Nextcloud supports running your own server; assess the operational work of self-hosting.",
    true,
  ],
  [
    "1password",
    "bitwarden",
    "Both manage passwords and credentials. Bitwarden publishes a free basic plan and self-hosting options; assess plan-specific needs.",
    true,
  ],
];
export function seed() {
  const d = db();
  d.transaction(() => {
    for (const name of categories)
      if (
        !d.prepare("SELECT 1 FROM categories WHERE slug=?").get(slugify(name))
      )
        saveResource(
          "categories",
          {
            slug: slugify(name),
            name,
            description:
              "Discover and compare tools for " + name.toLowerCase() + ".",
          },
          "seed",
        );
    for (const name of ["Windows", "macOS", "Linux", "Web", "Android", "iOS"])
      if (!d.prepare("SELECT 1 FROM platforms WHERE slug=?").get(slugify(name)))
        saveResource(
          "platforms",
          {
            slug: slugify(name),
            name,
            description: "Verified availability on " + name + ".",
          },
          "seed",
        );
    for (const name of [...featureNames, ...additionFeatureNames])
      if (!d.prepare("SELECT 1 FROM features WHERE slug=?").get(slugify(name)))
        saveResource(
          "features",
          {
            slug: slugify(name),
            name,
            description:
              "Product offers " +
              name.toLowerCase() +
              " capabilities; edition limits may apply.",
          },
          "seed",
        );
    for (const s of seedProducts()) {
      const existing = getSoftware(s.slug, true);
      if (!existing) {
        saveResource("software", s, "seed");
        continue;
      }
      if (additionSlugs.has(s.slug)) continue; // reviewed once on 2026-09-30
      if (existing.sources.some((source) => source.id === CONTENT_REVISION)) continue;
      // Only upgrade untouched original seed records. Editorial changes win.
      const edited = d.prepare(
        "SELECT 1 FROM change_history WHERE resource='software' AND record_id=? AND actor <> 'seed' LIMIT 1"
      ).get(s.slug);
      const seeded = d.prepare(
        "SELECT 1 FROM change_history WHERE resource='software' AND record_id=? AND actor='seed' LIMIT 1"
      ).get(s.slug);
      if (seeded && !edited) {
        saveResource("software", { ...s, version: existing.version }, CONTENT_REVISION);
      }
    }
    for (const [from, to, reason, comparison] of [...pairs, ...additionRelations]) {
      const id = from + "-to-" + to;
      if (!d.prepare("SELECT 1 FROM relationships WHERE id=?").get(id))
        saveResource(
          "relationships",
          { id, from, to, reason, comparison },
          "seed",
        );
    }
    if (!d.prepare("SELECT 1 FROM landings WHERE id=?").get("photoshop-free"))
      saveResource(
        "landings",
        {
          id: "photoshop-free",
          software: "photoshop",
          filter: "free",
          title: "Free Photoshop alternatives for different creative workflows",
          intro:
            "Choose a free alternative by the work you actually do. GIMP targets photo manipulation, Krita focuses on digital painting, and Canva offers a free entry point for template-based visual content. Each is relevant to a different part of a Photoshop workflow.",
          guidance:
            "Start by testing a real project. For retouching and composites, inspect GIMP's tools. For brushes and layered artwork, explore Krita. For reusable layouts and visual content, check Canva's free-plan limits. Free access does not mean every feature or asset is included, and none of these listings guarantees full Photoshop file compatibility.",
          published: true,
        },
        "seed",
      );
  })();
}
