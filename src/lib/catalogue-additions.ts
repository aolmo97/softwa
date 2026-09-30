// Catalogue additions reviewed against official pages on 2026-09-30.
// Every known field is tied to a source page that states it. Anything the pages
// did not state (prices, licences, platforms, flags) is left unknown on purpose.
import { emptyFlags, type Flag, type SoftwareInput, type Source } from "./model";

export const ADDITIONS_REVIEWED_ON = "2026-09-30";
export const ADDITIONS_REVISION = "catalogue-additions-2026-09-30";

type Plan = SoftwareInput["plans"][number];
type Spec = {
  slug: string;
  name: string;
  short: string;
  description: string;
  company: string | null;
  website: string;
  color: string;
  category: string;
  aliases?: string[];
  flags?: Partial<Record<Flag, boolean>>;
  platforms?: string[];
  features?: string[];
  pricingModel?: SoftwareInput["pricingModel"];
  license?: string;
  plans?: Plan[];
  pros: string[];
  cons: string[];
  useCases: string[];
  sources: {
    id: string;
    title: string;
    url: string;
    fields: string[];
    notes: string;
  }[];
};
const source = (s: Spec["sources"][number]): Source => ({
  ...s,
  accessedAt: ADDITIONS_REVIEWED_ON,
  verifiedAt: ADDITIONS_REVIEWED_ON,
  status: "VERIFIED",
});
function product(s: Spec): SoftwareInput {
  return {
    slug: s.slug,
    name: s.name,
    shortDescription: s.short,
    description: s.description,
    company: s.company,
    website: s.website,
    logo: null,
    color: s.color,
    aliases: s.aliases ?? [],
    categories: [s.category],
    flags: { ...emptyFlags(), ...s.flags },
    platforms: s.platforms ?? [],
    features: s.features ?? [],
    pricingModel: s.pricingModel ?? "unknown",
    license: s.license ?? null,
    plans: s.plans ?? [],
    pros: s.pros,
    cons: s.cons,
    useCases: s.useCases,
    sources: s.sources.map(source),
    published: true,
    premium: false,
    sponsored: false,
    version: 0,
  };
}
const free = (id: string, name: string, notes: string): Plan => ({
  id,
  name,
  amount: 0,
  currency: "USD",
  period: "free",
  notes,
});
const unknownPlan = (id: string, name: string, notes: string): Plan => ({
  id,
  name,
  amount: null,
  currency: null,
  period: "unknown",
  notes,
});
const paid = (
  id: string,
  name: string,
  amount: number,
  period: Plan["period"],
  notes: string,
): Plan => ({ id, name, amount, currency: "USD", period, notes });

export const additionFeatureNames = [
  "Word processing",
  "Spreadsheets",
  "Presentations",
  "Audio editing",
  "3D modeling",
  "Animation",
  "Rendering",
  "Raw processing",
  "Web analytics",
  "File synchronization",
];
export const additionRelations: [string, string, string, boolean][] = [
  [
    "microsoft-365",
    "libreoffice",
    "Both cover documents, spreadsheets and presentations. Microsoft 365 is a subscription with cloud storage and Copilot; LibreOffice is presented as free and open source. Test your real files, macros and collaboration needs before switching.",
    true,
  ],
  [
    "adobe-audition",
    "audacity",
    "Both edit and record audio. Audacity is presented as free and open source; Audition is a subscription product. Compare restoration, multitrack and plug-in needs using your own recordings.",
    true,
  ],
  [
    "cinema-4d",
    "blender",
    "Both are 3D creation tools covering modeling, animation and rendering. Blender is presented as free and open source; Cinema 4D is a subscription with a trial. Compare your motion-design and pipeline requirements on a real project.",
    true,
  ],
  [
    "adobe-lightroom",
    "darktable",
    "Both are used to edit and organise photographs. darktable is an open-source raw developer with non-destructive editing; Lightroom is a subscription with cloud and AI tools. Check catalogue, sync and camera-support needs first.",
    true,
  ],
  [
    "premiere-pro",
    "shotcut",
    "Both provide video editing. Shotcut is presented as a free, open-source, cross-platform editor; compare format support and the effects and collaboration features your projects need.",
    true,
  ],
  [
    "kdenlive",
    "shotcut",
    "Both are free, open-source desktop video editors. Compare interface, format support and effects using a short sample project.",
    false,
  ],
  [
    "1password",
    "keepassxc",
    "Both manage passwords. KeePassXC keeps an encrypted database file locally with no cloud service, while 1Password is a subscription service with sharing. Consider how you would sync, back up and share credentials.",
    true,
  ],
  [
    "bitwarden",
    "keepassxc",
    "Both are open-source password managers. KeePassXC stores an offline encrypted file; Bitwarden offers a hosted service and self-hosting. Decide how you want to sync and recover your vault.",
    true,
  ],
  [
    "1password",
    "proton-pass",
    "Both manage passwords and credentials. Proton Pass lists a free plan and paid plans with sharing and emergency access; compare plan limits and recovery options before moving a vault.",
    true,
  ],
  [
    "bitwarden",
    "proton-pass",
    "Both offer a free personal option with paid tiers. Compare sharing, emergency access, self-hosting and recovery features against what you need.",
    false,
  ],
  [
    "dropbox",
    "syncthing",
    "Both keep files in sync across devices. Dropbox is a hosted service with sharing and version history; Syncthing syncs directly between your own devices with no central server. Consider sharing and recovery needs.",
    true,
  ],
  [
    "nextcloud",
    "syncthing",
    "Both let you keep control of where files live. Nextcloud is a server platform with sharing features; Syncthing is peer-to-peer device synchronisation without a central server.",
    false,
  ],
  [
    "google-analytics",
    "plausible",
    "Both measure website traffic. Google Analytics is free of charge; Plausible is a paid, cookieless service with a public codebase. Compare depth of reporting, consent requirements and cost at your traffic level.",
    true,
  ],
  [
    "google-analytics",
    "matomo",
    "Both measure website and app traffic. Matomo can be self-hosted for free or used in the cloud; compare reporting depth, hosting effort and privacy requirements.",
    true,
  ],
  [
    "plausible",
    "matomo",
    "Both position themselves as privacy-friendly analytics. Compare reporting depth, self-hosting options and pricing for your traffic.",
    true,
  ],
];

export function additionProducts(): SoftwareInput[] {
  return [
    product({
      slug: "libreoffice",
      name: "LibreOffice",
      short:
        "A free, open-source office suite with a word processor, spreadsheet, presentations, drawing, database and formula tools.",
      description:
        "LibreOffice is an open-source office suite developed by a community and maintained by The Document Foundation. It bundles six tools: Writer for documents, Calc for spreadsheets, Impress for presentations, Draw for diagrams and illustrations, Base for databases and Math for formulas.\n\nThe project states that access is provided at no cost and that its source code is licensed under the Mozilla Public License v2.0. It is worth testing when you want an office suite without a subscription, but check how your own Microsoft Office files, macros and collaboration workflows behave first.",
      company: "The Document Foundation",
      website: "https://www.libreoffice.org/",
      color: "#1d7a2e",
      category: "office-suites",
      aliases: ["Libre Office", "LibreOffice Writer", "LibreOffice Calc"],
      flags: { freePlan: true, openSource: true },
      platforms: ["windows", "macos", "linux"],
      features: ["word-processing", "spreadsheets", "presentations"],
      pricingModel: "free",
      license: "Mozilla Public License 2.0",
      plans: [
        free(
          "free",
          "LibreOffice — free download",
          "The official site states access at no cost. Check the site for business-use downloads and any optional support services.",
        ),
      ],
      pros: [
        "Six tools in one suite: Writer, Calc, Impress, Draw, Base and Math.",
        "Presented as free of cost, with source code under the Mozilla Public License v2.0.",
        "Supports Windows, macOS and Linux according to the system requirements page.",
      ],
      cons: [
        "Test your real Microsoft Office documents, formatting and macros before migrating.",
        "The reviewed pages do not describe cloud storage or real-time co-editing as part of the suite.",
        "Collaboration and support arrangements should be checked separately from the free download.",
      ],
      useCases: [
        "Writing documents and reports",
        "Analysing data in spreadsheets",
        "Preparing presentations without a subscription",
      ],
      sources: [
        {
          id: "official",
          title: "LibreOffice — official homepage",
          url: "https://www.libreoffice.org/",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "openSource",
            "pricingModel",
            "license",
            "plan:free",
            "feature:word-processing",
            "feature:spreadsheets",
            "feature:presentations",
          ],
          notes:
            "Homepage describes Writer as a word processor, Calc as a spreadsheet and Impress for presentations, states no cost, the Mozilla Public License v2.0 for the source code, and community development with The Document Foundation.",
        },
        {
          id: "requirements",
          title: "LibreOffice — system requirements",
          url: "https://www.libreoffice.org/get-help/system-requirements/",
          fields: ["platform:windows", "platform:macos", "platform:linux"],
          notes:
            "Lists Windows 10 or 11 and Windows Server versions, macOS 11 or newer and Linux kernel 4.18 or higher.",
        },
      ],
    }),
    product({
      slug: "microsoft-365",
      name: "Microsoft 365",
      short:
        "Microsoft's subscription bundle of Word, Excel, PowerPoint, Outlook and OneNote with cloud storage and Copilot AI features.",
      description:
        "Microsoft 365 combines the Word, Excel, PowerPoint, Outlook and OneNote apps with cloud storage and AI features through Copilot. Microsoft lists a free version with web and mobile apps and 5 GB of storage, plus paid Basic, Personal, Family and Premium plans.\n\nPlans differ in storage, desktop app access and AI usage, so compare the tier you would actually buy. Microsoft's page states that AI features are not available in Basic and that some Copilot features require a Personal or Family subscription.",
      company: "Microsoft",
      website: "https://www.microsoft.com/en-us/microsoft-365",
      color: "#c2410c",
      category: "office-suites",
      aliases: ["Microsoft Office", "Office 365", "MS Office", "Word", "Excel"],
      flags: {
        freePlan: true,
        freeTrial: true,
        aiFeatures: true,
        cloud: true,
      },
      platforms: ["windows", "macos", "ios", "android", "web"],
      features: [
        "word-processing",
        "spreadsheets",
        "presentations",
        "team-collaboration",
      ],
      pricingModel: "freemium",
      plans: [
        free(
          "free",
          "Microsoft 365 — free",
          "Free account for one person: 5 GB of cloud storage and web and mobile versions of the apps, with ad-supported Outlook.",
        ),
        paid(
          "basic",
          "Microsoft 365 Basic",
          19.99,
          "year",
          "US price on the official page; 100 GB of storage; AI features are not available in Basic. Subscription renews automatically unless canceled.",
        ),
        paid(
          "personal",
          "Microsoft 365 Personal",
          99.99,
          "year",
          "US price on the official page; 1 TB of storage and the desktop apps for one person on up to five devices. Renews automatically unless canceled.",
        ),
        paid(
          "family",
          "Microsoft 365 Family",
          129.99,
          "year",
          "US price on the official page; one to six people with up to 6 TB in total. AI features are for the subscription owner only.",
        ),
        paid(
          "premium",
          "Microsoft 365 Premium",
          199.99,
          "year",
          "US price on the official page; adds advanced Copilot usage. Renews automatically unless canceled.",
        ),
      ],
      pros: [
        "Free web and mobile versions with 5 GB of storage are listed alongside the paid plans.",
        "Paid plans include the desktop apps for Windows and Mac, cloud storage and Copilot features.",
        "Word documents can be shared and edited collaboratively, including on the web.",
      ],
      cons: [
        "AI features are not available in Microsoft 365 Basic and have usage limits.",
        "Subscriptions renew automatically; the trial requires a payment card.",
        "Desktop apps require a subscription; the free version is limited to web and mobile.",
      ],
      useCases: [
        "Writing documents, spreadsheets and presentations",
        "Sharing files with cloud storage and collaboration",
        "Using AI assistance inside office apps",
      ],
      sources: [
        {
          id: "official",
          title: "Microsoft 365 — plans and apps",
          url: "https://www.microsoft.com/en-us/microsoft-365",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "aiFeatures",
            "cloud",
            "pricingModel",
            "plan:free",
            "plan:basic",
            "plan:personal",
            "plan:family",
            "plan:premium",
            "feature:spreadsheets",
            "feature:presentations",
          ],
          notes:
            "Official page lists Word, Excel, PowerPoint, Outlook and OneNote, a free plan with 5 GB, and Basic 19.99, Personal 99.99, Family 129.99 and Premium 199.99 US dollars per year, with Copilot AI features and cloud storage.",
        },
        {
          id: "word",
          title: "Microsoft Word — apps, trial and platforms",
          url: "https://www.microsoft.com/en-us/microsoft-365/word",
          fields: [
            "freeTrial",
            "feature:word-processing",
            "feature:team-collaboration",
            "platform:windows",
            "platform:macos",
            "platform:ios",
            "platform:android",
            "platform:web",
          ],
          notes:
            "Word page describes creating, editing and collaborating on Word documents, lists Windows, Mac, Android, iOS and web apps, and a one-month free trial that requires a card and converts to a paid subscription.",
        },
      ],
    }),
    product({
      slug: "audacity",
      name: "Audacity",
      short:
        "A free, open-source audio recording and editing application for Windows, macOS and Linux.",
      description:
        "Audacity is an audio recording and editing application. Its official site describes importing, exporting and converting audio, plug-in support and audio analysis, and states that it is open source and free for everyone.\n\nThe project publishes installers for Windows, macOS and Linux. It fits podcasters, musicians and anyone who needs to record or clean up audio without a subscription. Test it with your own recordings and any plug-ins you rely on.",
      company: "Muse Group and contributors",
      website: "https://www.audacityteam.org/",
      color: "#1d4ed8",
      category: "audio-editing",
      aliases: ["Audacity audio editor"],
      flags: { freePlan: true, openSource: true },
      platforms: ["windows", "macos", "linux"],
      features: ["audio-editing"],
      pricingModel: "free",
      license: "GNU GPL v3",
      plans: [
        free(
          "free",
          "Audacity — free",
          "The official site states it has always been and will remain free.",
        ),
      ],
      pros: [
        "Records and edits audio and can import, export and convert formats.",
        "Free for everyone, with source code open to view and modify.",
        "Installers are published for Windows, macOS and Linux.",
      ],
      cons: [
        "Check that the plug-ins and file formats you need are supported in your version.",
        "The official homepage does not describe collaboration or cloud storage features.",
        "Test restoration and multitrack workflows against your professional requirements.",
      ],
      useCases: [
        "Recording podcasts and voice-overs",
        "Cleaning and editing audio files",
        "Converting audio between formats",
      ],
      sources: [
        {
          id: "official",
          title: "Audacity — official homepage",
          url: "https://www.audacityteam.org/",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "openSource",
            "pricingModel",
            "plan:free",
            "feature:audio-editing",
          ],
          notes:
            "Homepage describes recording and editing audio, plug-in support, open source code and being free for everyone, with copyright by Muse Group and contributors.",
        },
        {
          id: "downloads",
          title: "Audacity — downloads",
          url: "https://www.audacityteam.org/download/",
          fields: ["platform:windows", "platform:macos", "platform:linux"],
          notes:
            "Download page lists Windows installers, macOS builds and Linux AppImages.",
        },
        {
          id: "license",
          title: "Audacity — licence file",
          url: "https://github.com/audacity/audacity/blob/master/LICENSE.txt",
          fields: ["license"],
          notes:
            "Repository licence file states that Audacity is released under the GNU General Public License version 3, with some source files under GPLv2 or later.",
        },
      ],
    }),
    product({
      slug: "adobe-audition",
      name: "Adobe Audition",
      short:
        "Adobe's audio application for editing, mixing, recording and restoring sound, sold as a subscription.",
      description:
        "Adobe Audition is a digital audio application for creating, mixing and designing sound. Adobe describes editing, mixing, recording and restoring audio with multitrack, waveform and spectral displays.\n\nIt is sold as a subscription, either as a single app or within Creative Cloud plans, and Adobe offers a free trial. Compare the price you would pay, the file exchange you need with collaborators and whether a free editor covers your work.",
      company: "Adobe",
      website: "https://www.adobe.com/products/audition.html",
      color: "#0f766e",
      category: "audio-editing",
      aliases: ["Audition", "Adobe Audition CC"],
      flags: { freeTrial: true },
      features: ["audio-editing"],
      pricingModel: "subscription",
      plans: [
        paid(
          "audition",
          "Audition — single app",
          22.99,
          "month",
          "US price shown on the official page: annual commitment billed monthly. Creative Cloud bundles, student, teacher and business prices differ.",
        ),
      ],
      pros: [
        "Combines editing, mixing, recording and restoration with multitrack, waveform and spectral views.",
        "A free trial is offered.",
        "Available as a single app or within Creative Cloud plans.",
      ],
      cons: [
        "The advertised monthly price requires an annual commitment.",
        "The official page does not list supported operating systems, so check requirements before buying.",
        "Compare against free editors for simple recording and clean-up jobs.",
      ],
      useCases: [
        "Mixing multitrack audio and sound design",
        "Restoring and cleaning recordings",
        "Producing podcasts and video soundtracks",
      ],
      sources: [
        {
          id: "official",
          title: "Adobe Audition — product and pricing page",
          url: "https://www.adobe.com/products/audition.html",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freeTrial",
            "pricingModel",
            "plan:audition",
            "feature:audio-editing",
          ],
          notes:
            "Product page describes editing, mixing, recording and restoring audio, lists 22.99 US dollars per month on an annual plan billed monthly, and offers a free trial. Trial length and operating systems are not stated on the page.",
        },
      ],
    }),
    product({
      slug: "blender",
      name: "Blender",
      short:
        "A free and open-source 3D creation suite covering modeling, animation, rendering, simulation and video editing.",
      description:
        "Blender is a free and open-source 3D creation suite developed as a community project coordinated by the Blender Foundation. Its features page lists modeling and sculpting, animation and rigging, rendering with Cycles, simulation, VFX tools, a video editor and Python scripting.\n\nThe project states you may use it for any purpose, including commercially or for education, and publishes builds for Windows, macOS and Linux. Test it against your pipeline, file formats and add-ons before replacing a paid 3D package.",
      company: "Blender Foundation and community",
      website: "https://www.blender.org/",
      color: "#b45309",
      category: "3d",
      aliases: ["Blender 3D"],
      flags: { freePlan: true, openSource: true, commercialUse: true },
      platforms: ["windows", "macos", "linux"],
      features: ["3d-modeling", "animation", "rendering", "video-editing"],
      pricingModel: "free",
      license: "GNU GPL",
      plans: [
        free(
          "free",
          "Blender — free",
          "The official site states it is free to use for any purpose, including commercially or for education.",
        ),
      ],
      pros: [
        "One suite covering modeling, sculpting, animation, rendering, simulation and VFX.",
        "Free to use for any purpose, including commercial work, under the GNU GPL.",
        "Extensive Python scripting and a customisable interface.",
      ],
      cons: [
        "Check that your studio's file formats, render pipeline and plug-ins are supported.",
        "Test the video editor against your requirements; the site describes it as offering basic tools.",
        "Confirm add-on and rendering support for your production pipeline.",
      ],
      useCases: [
        "Modeling and sculpting 3D assets",
        "Animating and rendering scenes",
        "Compositing and tracking for visual effects",
      ],
      sources: [
        {
          id: "official",
          title: "Blender — about and features",
          url: "https://www.blender.org/about/",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "openSource",
            "commercialUse",
            "pricingModel",
            "license",
            "plan:free",
          ],
          notes:
            "About page states Free and Open Source, the GNU General Public License, free use for any purpose including commercially, and development coordinated by the Blender Foundation.",
        },
        {
          id: "features",
          title: "Blender — features",
          url: "https://www.blender.org/features/",
          fields: [
            "feature:3d-modeling",
            "feature:animation",
            "feature:rendering",
            "feature:video-editing",
          ],
          notes:
            "Features page lists modeling, sculpting, animation and rigging, Cycles rendering, simulation, a video editor, scripting and VFX.",
        },
        {
          id: "downloads",
          title: "Blender — downloads",
          url: "https://www.blender.org/download/",
          fields: ["platform:windows", "platform:macos", "platform:linux"],
          notes: "Download page lists Windows, macOS and Linux builds.",
        },
      ],
    }),
    product({
      slug: "cinema-4d",
      name: "Cinema 4D",
      short:
        "Maxon's 3D software for modeling, animation, simulation and motion graphics, with a 14-day free trial.",
      description:
        "Cinema 4D is 3D software from Maxon built around motion graphics. Its official page describes parametric and polygonal modeling, sculpting, keyframe animation, procedural motion design with cloners and effectors, simulation and GPU-accelerated rendering included with the subscription.\n\nMaxon offers a 14-day free trial through the Maxon App and says the software runs on Windows and macOS. Pricing is not stated on the page we reviewed, so check the current plan before comparing costs.",
      company: "Maxon",
      website: "https://www.maxon.net/en/cinema-4d",
      color: "#1e3a8a",
      category: "3d",
      aliases: ["Cinema4D", "C4D", "Maxon Cinema 4D"],
      flags: { freeTrial: true },
      platforms: ["windows", "macos"],
      features: ["3d-modeling", "animation", "rendering"],
      pricingModel: "subscription",
      pros: [
        "Combines modeling, animation, simulation and rendering with a motion-design focus.",
        "GPU-accelerated rendering is included with every subscription.",
        "A 14-day free trial is offered through the Maxon App.",
      ],
      cons: [
        "Price is not stated on the reviewed page, so plan costs are unknown here.",
        "Available on Windows and macOS; Linux is not mentioned.",
        "Compare against free 3D tools using a real motion-graphics project.",
      ],
      useCases: [
        "Creating motion graphics and animation",
        "Modeling and rendering 3D scenes",
        "Simulating cloth, particles and fluids",
      ],
      sources: [
        {
          id: "official",
          title: "Cinema 4D — product page",
          url: "https://www.maxon.net/en/cinema-4d",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freeTrial",
            "pricingModel",
            "platform:windows",
            "platform:macos",
            "feature:3d-modeling",
            "feature:animation",
            "feature:rendering",
          ],
          notes:
            "Product page describes modeling, keyframe animation, motion graphics, simulation and GPU rendering included with every subscription, a 14-day free trial, and support for Windows and macOS. No price is stated.",
        },
      ],
    }),
    product({
      slug: "darktable",
      name: "darktable",
      short:
        "An open-source photography workflow application and raw developer with non-destructive editing.",
      description:
        "darktable is an open-source photography workflow application and raw developer, described by its project as a virtual lighttable and darkroom for photographers. Editing is non-destructive: it operates on cached image buffers for display and converts the full image only on export.\n\nThe project releases it under the GNU General Public License version 3 or later and provides installers for Windows and macOS and packages or source for Linux. Pricing is not stated on the pages we reviewed, so check the project's terms.",
      company: null,
      website: "https://www.darktable.org/",
      color: "#374151",
      category: "photo-editing",
      aliases: ["Darktable"],
      flags: { openSource: true },
      platforms: ["windows", "macos", "linux"],
      features: ["raw-processing", "photo-editing"],
      license: "GNU GPL v3 or later",
      pros: [
        "Raw developer and photography workflow in one open-source application.",
        "All editing is non-destructive until the image is exported.",
        "Released under the GNU General Public License version 3 or later.",
      ],
      cons: [
        "Check your camera's raw format support with a sample of your own files.",
        "The reviewed pages do not describe cloud sync or mobile apps.",
        "Test how your existing catalogue and edits migrate before switching.",
      ],
      useCases: [
        "Developing raw photographs",
        "Managing and culling a photo collection",
        "Editing images non-destructively",
      ],
      sources: [
        {
          id: "official",
          title: "darktable — about",
          url: "https://www.darktable.org/about/",
          fields: [
            "description",
            "pros",
            "cons",
            "useCases",
            "openSource",
            "license",
            "feature:raw-processing",
            "feature:photo-editing",
          ],
          notes:
            "About page describes an open-source photography workflow application and raw developer, the GNU General Public License version 3 or later, and fully non-destructive editing. It does not state a price.",
        },
        {
          id: "install",
          title: "darktable — install",
          url: "https://www.darktable.org/install/",
          fields: ["platform:windows", "platform:macos", "platform:linux"],
          notes:
            "Install page lists Windows and Windows on ARM downloads, macOS bundles for macOS 13.5 or later, and Linux as source or an AppImage.",
        },
      ],
    }),
    product({
      slug: "adobe-lightroom",
      name: "Adobe Lightroom",
      short:
        "Adobe's photo editing and organising service for mobile, desktop and web, with AI editing tools, sold by subscription.",
      description:
        "Adobe Lightroom is a photo editing service for adjusting exposure, colour and more across mobile, desktop and web, with Lightroom Classic as a separate desktop version. Adobe highlights AI-powered editing, masking and culling tools.\n\nIt is sold by subscription, with a standalone plan and a Photography plan, and a free trial is available. Compare the plan you would buy with free raw developers such as darktable, and test how your existing catalogue moves.",
      company: "Adobe",
      website: "https://www.adobe.com/products/photoshop-lightroom.html",
      color: "#1e40af",
      category: "photo-editing",
      aliases: ["Lightroom", "Lightroom Classic", "Adobe Photoshop Lightroom"],
      flags: { freeTrial: true, aiFeatures: true },
      platforms: ["web"],
      features: ["photo-editing"],
      pricingModel: "subscription",
      plans: [
        paid(
          "lightroom",
          "Lightroom — standalone",
          11.99,
          "month",
          "US price on the official page: annual commitment billed monthly. Other plans and bundles differ.",
        ),
        paid(
          "photography",
          "Photography plan",
          19.99,
          "month",
          "US price on the official page: annual commitment billed monthly. Adobe's page lists what the plan includes.",
        ),
      ],
      pros: [
        "Photo editing on mobile, desktop and web, plus Lightroom Classic.",
        "AI-assisted editing, masking and culling tools are described.",
        "A free trial is available.",
      ],
      cons: [
        "Listed monthly prices are on an annual commitment.",
        "The page does not list operating-system requirements for each edition.",
        "AI features and cloud storage depend on the plan you choose.",
      ],
      useCases: [
        "Editing and organising photo libraries",
        "Retouching portraits with AI-assisted tools",
        "Syncing edits between devices",
      ],
      sources: [
        {
          id: "official",
          title: "Adobe Lightroom — product and pricing page",
          url: "https://www.adobe.com/products/photoshop-lightroom.html",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freeTrial",
            "aiFeatures",
            "pricingModel",
            "plan:lightroom",
            "plan:photography",
            "platform:web",
            "feature:photo-editing",
          ],
          notes:
            "Product page describes photo editing on mobile, desktop and web and Lightroom Classic, AI-powered editing tools, 11.99 and 19.99 US dollars per month on annual plans billed monthly, and a free trial.",
        },
      ],
    }),
    product({
      slug: "shotcut",
      name: "Shotcut",
      short:
        "A free, open-source, cross-platform video editor supporting hundreds of formats through FFmpeg.",
      description:
        "Shotcut is a free, open-source, cross-platform video editor for Windows, Mac and Linux. Its site says it supports hundreds of audio and video formats and codecs through FFmpeg with no import step, mixed formats and frame rates in one timeline, resolutions up to 4K and screen, webcam and audio capture.\n\nIt suits people who want a no-cost editor. Test it with your own footage, effects and export requirements, and confirm the specific licence terms with the project before relying on it commercially.",
      company: null,
      website: "https://www.shotcut.org/",
      color: "#0e7490",
      category: "video-editing",
      aliases: ["Shotcut video editor"],
      flags: { freePlan: true, openSource: true },
      platforms: ["windows", "macos", "linux"],
      features: ["video-editing"],
      pricingModel: "free",
      plans: [
        free(
          "free",
          "Shotcut — free",
          "The official homepage describes the editor as free and open source.",
        ),
      ],
      pros: [
        "Free, open-source editor for Windows, Mac and Linux.",
        "Native editing of many formats thanks to FFmpeg, without importing.",
        "Supports mixed formats in one timeline, 4K resolutions and screen or webcam capture.",
      ],
      cons: [
        "The homepage does not name the licence, so check the project's terms.",
        "Compare effects, colour tools and collaboration with a paid editor for your projects.",
        "Test export presets and codec needs with a sample project.",
      ],
      useCases: [
        "Editing videos without a subscription",
        "Working with mixed camera formats",
        "Recording screen or webcam footage",
      ],
      sources: [
        {
          id: "official",
          title: "Shotcut — official homepage",
          url: "https://www.shotcut.org/",
          fields: [
            "description",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "openSource",
            "pricingModel",
            "plan:free",
            "platform:windows",
            "platform:macos",
            "platform:linux",
            "feature:video-editing",
          ],
          notes:
            "Homepage describes a free, open source, cross-platform video editor for Windows, Mac and Linux with FFmpeg-based format support and 4K resolutions. It does not name the licence.",
        },
      ],
    }),
    product({
      slug: "keepassxc",
      name: "KeePassXC",
      short:
        "A free, open-source password manager that keeps an offline encrypted database file, with no cloud service.",
      description:
        "KeePassXC is a modern open-source password manager that stores your data in an offline, encrypted file which can be kept in any location. Its site says passwords stay encrypted at all times, that no data is stored on remote servers and that it is free and open source under the GPLv3 licence.\n\nBecause there is no cloud service, you decide how to synchronise and back up the database. That gives control but also responsibility, so plan sync, recovery and sharing before moving from a hosted manager.",
      company: null,
      website: "https://keepassxc.org/",
      color: "#166534",
      category: "password-managers",
      aliases: ["KeePass XC"],
      flags: {
        freePlan: true,
        openSource: true,
        offlineSupport: true,
        cloud: false,
      },
      platforms: ["windows", "macos", "linux"],
      features: ["password-management", "encryption"],
      pricingModel: "free",
      license: "GNU GPL v3",
      plans: [
        free(
          "free",
          "KeePassXC — free",
          "The official site describes it as free and open source.",
        ),
      ],
      pros: [
        "Data stays in an offline, encrypted file that you can store anywhere.",
        "Free and open source under the GPLv3 licence.",
        "Available for Windows, macOS and Linux.",
      ],
      cons: [
        "There is no cloud service, so you must arrange sync and backups yourself.",
        "The reviewed page does not describe team or family sharing features.",
        "Check browser integration and mobile options against your needs.",
      ],
      useCases: [
        "Keeping passwords in a local encrypted database",
        "Auto-filling logins in applications",
        "Managing credentials without a hosted service",
      ],
      sources: [
        {
          id: "official",
          title: "KeePassXC — official homepage",
          url: "https://keepassxc.org/",
          fields: [
            "description",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "openSource",
            "offlineSupport",
            "cloud",
            "pricingModel",
            "license",
            "plan:free",
            "platform:windows",
            "platform:macos",
            "platform:linux",
            "feature:password-management",
            "feature:encryption",
          ],
          notes:
            "Homepage describes an open-source password manager storing an offline encrypted file with no cloud, under the GPLv3 licence, free, for Windows, macOS and Linux.",
        },
      ],
    }),
    product({
      slug: "proton-pass",
      name: "Proton Pass",
      short:
        "Proton's password manager with a free plan, end-to-end encryption and paid tiers for sharing and emergency access.",
      description:
        "Proton Pass is a password manager from Proton. Its free plan lists unlimited logins, notes and credit cards on unlimited devices, apps for browsers, mobile and desktop, a password generator, ten hide-my-email aliases, alerts for weak or reused passwords and passkey support.\n\nPaid Pass Plus and Pass Family add features such as unlimited aliases, a built-in authenticator, vault and link sharing, dark web monitoring, file attachments and emergency access. The reviewed page did not show price amounts, so plan costs are unknown here.",
      company: "Proton",
      website: "https://proton.me/pass",
      color: "#6d28d9",
      category: "password-managers",
      aliases: ["Proton Pass password manager"],
      flags: { freePlan: true },
      features: ["password-management", "encryption"],
      pricingModel: "freemium",
      plans: [
        free(
          "free",
          "Proton Pass — free",
          "Unlimited logins, notes and credit cards on unlimited devices, with ten hide-my-email aliases.",
        ),
        unknownPlan(
          "plus",
          "Pass Plus",
          "Paid tier. The reviewed page showed no price amount.",
        ),
        unknownPlan(
          "family",
          "Pass Family",
          "Paid tier for up to six users. The reviewed page showed no price amount.",
        ),
      ],
      pros: [
        "A free plan with unlimited logins and devices is listed.",
        "Data is described as protected with zero-knowledge, end-to-end encryption.",
        "Paid tiers add sharing, emergency access and a built-in authenticator.",
      ],
      cons: [
        "Paid plan prices were not shown on the reviewed page, so costs are unknown here.",
        "The free plan limits hide-my-email aliases to ten.",
        "The reviewed page does not state operating-system support or whether the apps are open source.",
      ],
      useCases: [
        "Storing logins, notes and cards across devices",
        "Sharing vaults with a family",
        "Generating passwords and monitoring weak ones",
      ],
      sources: [
        {
          id: "official",
          title: "Proton Pass — plans and features",
          url: "https://proton.me/pass/pricing",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "pricingModel",
            "plan:free",
            "feature:password-management",
            "feature:encryption",
          ],
          notes:
            "Pricing page lists the free plan contents, Pass Plus and Pass Family features and the zero-knowledge end-to-end encryption claim. Price amounts were shown as placeholders and are therefore not recorded.",
        },
      ],
    }),
    product({
      slug: "syncthing",
      name: "Syncthing",
      short:
        "Open-source continuous file synchronisation between your own devices, with no central server.",
      description:
        "Syncthing is a continuous file synchronisation program that keeps files in sync between two or more computers in real time. Its site states that none of your data is stored anywhere except on your own computers, that there is no central server, and that all communication is secured with TLS.\n\nThe source code is available on GitHub under the Mozilla Public License 2.0. Because data stays on your own devices, there is no hosted storage to fall back on; consider how you will back up, share and recover files. Pricing is not stated on the reviewed page.",
      company: null,
      website: "https://syncthing.net/",
      color: "#0369a1",
      category: "cloud-storage",
      aliases: ["Syncthing file sync"],
      flags: { openSource: true },
      platforms: ["macos", "windows", "linux"],
      features: ["file-synchronization", "encryption"],
      license: "Mozilla Public License 2.0",
      pros: [
        "Syncs files directly between your own devices with no central server.",
        "Communication is secured with TLS and devices are identified by cryptographic certificates.",
        "Source code is available under the Mozilla Public License 2.0.",
      ],
      cons: [
        "Data is stored only on your own devices, so plan backups and how you will share files.",
        "The reviewed page does not describe hosted sharing links or web access.",
        "Pricing is not stated on the reviewed page.",
      ],
      useCases: [
        "Keeping folders in sync across your computers",
        "Avoiding a central cloud service",
        "Synchronising files between home and work machines",
      ],
      sources: [
        {
          id: "official",
          title: "Syncthing — official homepage",
          url: "https://syncthing.net/",
          fields: [
            "description",
            "pros",
            "cons",
            "useCases",
            "openSource",
            "platform:macos",
            "platform:windows",
            "platform:linux",
            "feature:file-synchronization",
            "feature:encryption",
          ],
          notes:
            "Homepage describes continuous file synchronisation with no central server, TLS-secured communication and support for macOS, Windows, Linux and other systems, with source on GitHub. It does not state a price.",
        },
        {
          id: "license",
          title: "Syncthing — repository licence",
          url: "https://github.com/syncthing/syncthing/blob/main/LICENSE",
          fields: ["license"],
          notes:
            "The repository licence file contains the Mozilla Public License Version 2.0.",
        },
      ],
    }),
    product({
      slug: "plausible",
      name: "Plausible Analytics",
      short:
        "A lightweight, cookieless website analytics service with a public codebase and a 30-day free trial.",
      description:
        "Plausible is a lightweight web analytics service that positions itself as a privacy-friendly alternative to Google Analytics. Its site says it uses no cookies, needs no cookie banner, does not process personal data or track individual users, and that its code is open source.\n\nPricing starts at 9 US dollars per month on the Starter plan, based on monthly pageviews, with a 30-day free trial and no card required. Self-hosting is not described on the page we reviewed.",
      company: null,
      website: "https://plausible.io/",
      color: "#4338ca",
      category: "analytics",
      aliases: ["Plausible"],
      flags: { openSource: true, freeTrial: true },
      features: ["web-analytics"],
      pricingModel: "subscription",
      plans: [
        paid(
          "starter",
          "Starter",
          9,
          "month",
          "Entry plan shown at 9 US dollars per month for up to 10,000 monthly pageviews; price depends on pageviews and can be billed monthly or yearly.",
        ),
      ],
      pros: [
        "Uses no cookies and describes itself as not tracking individual users.",
        "Describes itself as simple, lightweight analytics.",
        "A 30-day free trial without a payment card is offered.",
      ],
      cons: [
        "Price rises with monthly pageviews.",
        "It describes itself as simple and lightweight, so compare reporting depth with larger analytics suites for your needs.",
        "Self-hosting is not described on the reviewed page.",
      ],
      useCases: [
        "Measuring traffic without cookie banners",
        "Tracking referrers and popular pages",
        "Replacing a heavier analytics tool on a small site",
      ],
      sources: [
        {
          id: "official",
          title: "Plausible Analytics — official homepage",
          url: "https://plausible.io/",
          fields: [
            "description",
            "pros",
            "cons",
            "useCases",
            "openSource",
            "freeTrial",
            "pricingModel",
            "plan:starter",
            "feature:web-analytics",
          ],
          notes:
            "Homepage describes cookieless privacy-friendly analytics with public open-source code, Starter pricing from 9 US dollars per month based on pageviews and a 30-day free trial with no card required.",
        },
      ],
    }),
    product({
      slug: "matomo",
      name: "Matomo",
      short:
        "An open-source analytics platform you can self-host for free or use as a cloud service, with a 21-day cloud trial.",
      description:
        "Matomo is an open-source web analytics platform positioned as privacy-first. Its site offers a cloud service with a 21-day free trial and an on-premise option that you can download and self-host for free, and it highlights cookieless tracking, data anonymisation, GDPR compliance and 100 percent data ownership.\n\nCloud pricing was not stated on the page we reviewed, and the specific licence terms are not named there. Compare the effort of hosting it yourself with the cost of the cloud service.",
      company: null,
      website: "https://matomo.org/",
      color: "#3152a0",
      category: "analytics",
      aliases: ["Matomo Analytics"],
      flags: {
        openSource: true,
        freeTrial: true,
        selfHosted: true,
        cloud: true,
        freePlan: true,
      },
      features: ["web-analytics"],
      plans: [
        free(
          "on-premise",
          "Matomo On-Premise",
          "The official site offers a free download and says you can self-host for free; hosting and maintenance are your responsibility.",
        ),
        unknownPlan(
          "cloud",
          "Matomo Cloud",
          "Cloud service with a 21-day free trial. The reviewed page showed no price.",
        ),
      ],
      pros: [
        "Can be self-hosted for free or used as a cloud service.",
        "Privacy features are described, including cookieless tracking and data anonymisation.",
        "A 21-day free cloud trial is offered.",
      ],
      cons: [
        "Self-hosting requires servers, updates and backups.",
        "Cloud pricing and the licence name were not stated on the reviewed page.",
        "Compare reporting depth against lighter tools for a small site.",
      ],
      useCases: [
        "Running analytics on infrastructure you control",
        "Measuring traffic with privacy-focused settings",
        "Replacing an ad-supported analytics service",
      ],
      sources: [
        {
          id: "official",
          title: "Matomo — official homepage",
          url: "https://matomo.org/",
          fields: [
            "description",
            "pros",
            "cons",
            "useCases",
            "openSource",
            "freeTrial",
            "selfHosted",
            "cloud",
            "freePlan",
            "plan:on-premise",
            "feature:web-analytics",
          ],
          notes:
            "Homepage describes an open-source, privacy-first analytics platform with a 21-day cloud trial, a free on-premise download and privacy claims. It does not state cloud prices or the licence name.",
        },
      ],
    }),
    product({
      slug: "google-analytics",
      name: "Google Analytics",
      short:
        "Google's free web and app analytics service, using machine learning to surface customer insights.",
      description:
        "Google Analytics measures how customers interact across websites and apps. Google describes understanding customers across devices and platforms, using machine learning to get more value from data, and states the product is free of charge.\n\nBefore choosing it for a site, review Google’s data-processing terms, consent requirements and how it compares with privacy-focused or self-hosted analytics tools.",
      company: "Google",
      website: "https://marketingplatform.google.com/about/analytics/",
      color: "#b45309",
      category: "analytics",
      aliases: ["GA4", "Google Analytics 4"],
      flags: { freePlan: true, aiFeatures: true },
      features: ["web-analytics"],
      pricingModel: "free",
      plans: [
        free(
          "free",
          "Google Analytics — free",
          "The official page states the product is free of charge. Check Google's terms for limits and any paid tiers.",
        ),
      ],
      pros: [
        "Free of charge according to Google's official page.",
        "Covers both websites and apps.",
        "Uses machine learning to surface insights.",
      ],
      cons: [
        "Review Google’s data-processing terms and the consent requirements for your audience.",
        "The reviewed page does not state operating-system or self-hosting options.",
        "Compare with lighter or self-hosted tools if you want simpler or more private reporting.",
      ],
      useCases: [
        "Measuring website and app traffic",
        "Understanding how visitors reach and use a site",
        "Analysing behaviour across devices",
      ],
      sources: [
        {
          id: "official",
          title: "Google Analytics — official overview",
          url: "https://marketingplatform.google.com/about/analytics/",
          fields: [
            "description",
            "company",
            "pros",
            "cons",
            "useCases",
            "freePlan",
            "aiFeatures",
            "pricingModel",
            "plan:free",
            "feature:web-analytics",
          ],
          notes:
            "Overview page describes understanding customers across sites and apps, machine learning, and states the product is free of charge.",
        },
      ],
    }),
  ];
}
