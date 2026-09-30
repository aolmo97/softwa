// Editorial guides. General decision advice only: product-specific statements
// mirror the catalogue's sourced records and never claim hands-on testing.
export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};
export type Guide = {
  slug: string;
  title: string;
  description: string;
  topic: string;
  published: string;
  sections: GuideSection[];
  software: string[];
  compare: string[];
  categories: string[];
};
export const guides: Guide[] = [
  {
    slug: "how-to-evaluate-a-software-alternative",
    title: "How to evaluate a software alternative before you switch",
    description:
      "A practical framework for choosing between two tools: define the job, list deal-breakers, test with a real project and plan a way back.",
    topic: "Method",
    published: "2026-09-30",
    software: ["notion", "obsidian", "gimp", "photoshop"],
    compare: ["notion-vs-obsidian", "gimp-vs-photoshop"],
    categories: ["productivity", "photo-editing"],
    sections: [
      {
        heading: "Start with the job, not the product",
        paragraphs: [
          "Most switching mistakes begin with a feature list. Two tools can share the same category, and even most of the same menu labels, while being built for different work. Before you compare anything, write down the three to five jobs you actually do in the tool every week. A photographer retouching portraits, an illustrator painting from scratch and a marketer resizing templates all say “image editing”, yet they need very different things.",
          "A useful test is to describe each job as a sentence with an outcome: “export a print-ready PDF that my printer accepts”, “find a note I wrote two years ago in under ten seconds”, “let three colleagues comment on the same file”. Outcomes are easier to check than features, and they keep you from paying for capabilities you will never open.",
        ],
      },
      {
        heading: "Separate deal-breakers from nice-to-haves",
        paragraphs: [
          "Once you know the jobs, sort your requirements into two lists. A deal-breaker is something without which the alternative is useless to you: a platform you must run on, a file format your clients send, a compliance rule, a budget ceiling. Everything else is a preference.",
          "This is the same idea behind the matching tool on this site. A mandatory requirement must be positively confirmed, while unknown information excludes the candidate instead of being treated as a pass. Applying that discipline by hand stops an attractive interface from talking you past a missing essential.",
        ],
        bullets: [
          "Platforms and devices you must support today, not in theory.",
          "File formats you receive from or deliver to other people.",
          "Where your data has to live, and who is allowed to see it.",
          "The total you can spend per month or year, including extra seats.",
        ],
      },
      {
        heading: "Check that your data can leave and enter",
        paragraphs: [
          "The cost of switching is mostly the cost of moving your existing material. Ask two questions for every candidate: can I import what I already have, and can I export everything again if I change my mind? Open or widely supported formats reduce lock-in because more than one program can read them. Proprietary containers and features that only exist inside one application deserve extra caution.",
          "Do not trust a tick in a comparison table for this. Import support can mean anything from a faithful copy to a rough text dump. Try it on real material, including the awkward files: the oldest document, the one with the most attachments, the layered file that took a week to build.",
        ],
      },
      {
        heading: "Understand the cost model, not just the headline price",
        paragraphs: [
          "Pricing pages are written to make the entry price look small. Look for the details that change the total. Some plans are billed monthly but require an annual commitment. Some free plans limit storage, history or collaboration. Team prices often depend on the number of seats, and different seat types can cost different amounts. Promotional first-year prices may apply only to new customers.",
          "Cost is also time. A free tool that needs an afternoon of setup and a weekend of migration is not free for you. Equally, an expensive tool that removes an hour of friction every day may be the cheaper choice. Write the cost down in both money and hours for the first year.",
        ],
      },
      {
        heading: "Read the licence and know who maintains it",
        paragraphs: [
          "“Free” is not one thing. A programme can be free of charge but closed, open source with paid hosting, or commercial software with a free tier. Each arrangement affects what you may do with it, whether you can self-host it, and what happens if the company changes direction. Our guide on free, open-source and freemium labels explains the differences in detail.",
          "Look at maintenance too. Is there a company behind the project, a foundation, a small group of volunteers? Neither is automatically better. What matters is whether the project is still releasing updates and whether you would find help if something broke.",
        ],
      },
      {
        heading: "Test with a representative project",
        paragraphs: [
          "Pick one real piece of work and complete it end to end in the alternative. Not a demo, not the tutorial file: something with a deadline shape. Notice where you slow down, which shortcuts you miss, and which step you cannot do at all. Keep notes as you go, because memory is unreliable after the first frustrating hour.",
          "If other people depend on your output, send them the result and ask whether it opens correctly. Layout, fonts, formatting and comments are the details that break quietly when files cross between tools.",
        ],
      },
      {
        heading: "Plan the rollback and the overlap",
        paragraphs: [
          "Do not cancel the old tool on the day you start the new one. Keep both running for a defined period, long enough to hit a full cycle of your normal work, usually a month. During that time, work only in the new tool and open the old one only when you are blocked. Each time you go back, write down why.",
          "At the end of the overlap you will have a short, honest list of what the alternative could not do. If the list contains a deal-breaker, you have learned that cheaply. If it contains only preferences, you can switch with confidence and a clear export of everything you left behind.",
        ],
      },
      {
        heading: "Record why you decided",
        paragraphs: [
          "Write two paragraphs explaining what you chose and why, and store them with your migration notes. Software choices get revisited when prices change or a colleague asks why you left. A short record saves the argument, and it makes the next evaluation faster because your criteria are already written down.",
        ],
      },
    ],
  },
  {
    slug: "switching-from-photoshop",
    title: "Switching from Photoshop: pick the alternative that matches your work",
    description:
      "Photoshop covers several different jobs. This guide maps retouching, painting, vector art, templates and interface design to the alternatives in our catalogue.",
    topic: "Design",
    published: "2026-09-30",
    software: [
      "photoshop",
      "gimp",
      "krita",
      "inkscape",
      "illustrator",
      "canva",
      "figma",
      "penpot",
    ],
    compare: [
      "gimp-vs-photoshop",
      "krita-vs-photoshop",
      "canva-vs-photoshop",
      "illustrator-vs-inkscape",
      "figma-vs-penpot",
    ],
    categories: ["photo-editing", "design"],
    sections: [
      {
        heading: "There is no single Photoshop alternative",
        paragraphs: [
          "Photoshop is used for retouching photographs, compositing images, painting, mocking up layouts and preparing web graphics. Because one product covers all of those, people who say they want an alternative usually want a replacement for one or two of those jobs. Naming the job first saves you from testing five tools that were never built for it.",
          "Everything below comes from the official pages recorded in our catalogue. We have not tested these programs hands-on, so treat the notes as a starting point for your own trial, and check each vendor's current plans before you commit.",
        ],
      },
      {
        heading: "Retouching photos and combining images",
        paragraphs: [
          "If you edit photographs and build composites with layers and masks, the closest match in our catalogue is GIMP. It is a community-developed image editor distributed under the GNU General Public License, and it runs on Windows, macOS and Linux without a subscription. Photoshop's own record notes that selections, masks and adjustment layers allow controlled edits, so test exactly those steps in GIMP.",
          "Three checks matter before you move. First, exchange a layered document with a collaborator who still uses Photoshop and see what survives. Second, confirm that the plug-ins you rely on exist for the GIMP version you would install. Third, run your print or colour-managed output through the real workflow, because two tools can look identical on screen and differ in the file your printer receives.",
        ],
      },
      {
        heading: "Digital painting and illustration",
        paragraphs: [
          "If your Photoshop time is mostly drawing, Krita is built around that workflow. Its record highlights customisable brushes, stroke stabilisers, comic-layout tools and a 2D animation workspace, and the core application is free. Test it with your own tablet and brush presets, because pen behaviour and imported brush resources are where painters notice differences first.",
          "Krita is not the answer to photo editing. Our catalogue entry itself advises testing your specific photo-editing tasks before treating it as a Photoshop replacement. Choose it because you paint, not because it is free.",
        ],
      },
      {
        heading: "Vector artwork: Illustrator and Inkscape",
        paragraphs: [
          "Logos, icons and diagrams are usually vector work, and Photoshop is not the right tool for them anyway. The catalogue pairs Illustrator with Inkscape. Inkscape is free and open source and uses SVG as its native format, which is useful when you want editable artwork that many programs can open. Illustrator is Adobe's vector application, and the advertised monthly price requires an annual commitment.",
          "Compatibility is the risk. If clients, agencies or printers send you Illustrator files, test them in Inkscape first, paying attention to text, effects and layout. Ask your supplier which formats they need instead of assuming that identical-looking output means identical files.",
        ],
      },
      {
        heading: "Templates and quick social graphics",
        paragraphs: [
          "Some Photoshop use is really template work: presentations, social posts and branded documents produced repeatedly. Canva is aimed at that pattern, with templates, stock content and brand tools. It has a free plan and a paid Pro plan, and premium assets and larger AI allowances need the paid tier.",
          "Two cautions apply. Templates speed things up but tie your look to the platform's asset library, so review the content licence for whatever appears in your deliverables. And Canva is not a substitute for pixel-level retouching, so use it for the layout job, not the photo job.",
        ],
      },
      {
        heading: "Interface design: Figma and Penpot",
        paragraphs: [
          "Teams that use Photoshop to mock up screens should look at dedicated interface tools. Figma offers shared files, comments, components and developer handoff, with a free Starter plan and paid seats that differ in capability and price. Penpot is an open-source alternative that you can use as a hosted service or run yourself, and its layout tools follow web concepts such as CSS Grid and Flex.",
          "Self-hosting Penpot gives control over where designs live, but it also means maintaining servers and backups. Try a real project with your developers before deciding, and test migration of existing files and any integrations you depend on.",
        ],
      },
      {
        heading: "Compare costs and commitments honestly",
        paragraphs: [
          "Price is often the reason people leave Photoshop, so put numbers side by side. As recorded from official pages, Photoshop’s desktop and web plan for individuals in the United States is listed at 22.99 USD per month on an annual commitment billed monthly, and a free mobile edition exists that does not replace the desktop app. Canva lists a free plan and a Pro plan at 144 USD per year. Figma lists a free Starter plan and a Professional full seat at 16 USD per month. Penpot lists a free hosted plan and an Unlimited plan at 7 USD per month.",
          "Treat these as orientation, not quotes. They are US prices at the time of our editorial review, taxes and regional pricing differ, and plans change. The number that matters is your own yearly total, including extra seats, add-ons and the hours you will spend learning a new tool. A free program that costs you a week of lost work is not necessarily cheaper than a subscription.",
        ],
      },
      {
        heading: "A short trial you can run this week",
        paragraphs: [
          "Choose one recent project and repeat it in the candidate tool, keeping notes on every step that felt slower or impossible. Then answer four questions honestly.",
        ],
        bullets: [
          "Could I finish the deliverable to the same standard?",
          "Did files round-trip with the people who need them?",
          "What did I miss that I would use every week?",
          "What is the total yearly cost, including extra seats and add-ons?",
        ],
      },
    ],
  },
  {
    slug: "moving-your-notes-between-apps",
    title: "Moving your notes between apps: Notion, Obsidian and Joplin",
    description:
      "How to compare hosted workspaces and local-first notes, what usually breaks in a migration, and a step-by-step plan that keeps your original safe.",
    topic: "Productivity",
    published: "2026-09-30",
    software: ["notion", "obsidian", "joplin"],
    compare: ["notion-vs-obsidian", "joplin-vs-notion", "joplin-vs-obsidian"],
    categories: ["productivity"],
    sections: [
      {
        heading: "Two different ideas of a note",
        paragraphs: [
          "Note apps look similar but rest on different ideas. Notion is a shared workspace where documents, databases and forms sit together, which suits people who want project information and written context in one place. Obsidian and Joplin are built around notes you keep yourself: Obsidian keeps working data locally on your device, and Joplin is an offline-first, open-source application that stores notes in Markdown.",
          "That difference decides most of the trade-offs. A hosted workspace makes collaboration and structure easy and puts your data on someone else's service. A local-first tool gives you files you control and puts backup, synchronisation and sharing on you.",
        ],
      },
      {
        heading: "What each tool's record tells us",
        paragraphs: [
          "Notion has a free plan and paid Plus and Business plans, and paid costs depend on the number of billable members. Permissions and organisational controls vary by plan, so check that the tier you need includes what your team expects.",
          "Obsidian's core application is free, including for commercial use, and it can be used without signing up. Optional Sync adds end-to-end encrypted synchronisation with version history, and Publish is a separate paid service. Joplin is free and open source, imports Markdown files and exported Evernote content, and can synchronise through services such as Nextcloud, Dropbox, OneDrive or Joplin Cloud, with end-to-end encryption available.",
          "Prices and allowances change, so use these notes to decide what to test, and read the vendor's current pages before paying.",
        ],
      },
      {
        heading: "What usually breaks in a migration",
        paragraphs: [
          "Plain text moves easily. Structure does not. Databases with properties, relations and views, embedded files, comments, page permissions and internal links are the things most likely to arrive flattened or missing. That is not a criticism of any product; it is what happens whenever information leaves a system that models it richly and lands in one that stores files.",
        ],
        bullets: [
          "Structured data: check that properties and relations survive, or accept a manual rebuild.",
          "Attachments and images: confirm they are copied, not just linked to the old service.",
          "Internal links: test a few pages that link to each other.",
          "Formatting: tables, checklists and code blocks are common casualties.",
          "Dates: creation and edit times may reset, which matters if you sort by them.",
        ],
      },
      {
        heading: "A safe migration plan",
        paragraphs: [
          "Treat the move as a project with a rollback, not an afternoon of dragging files. The steps below keep your original untouched until you are sure.",
        ],
        bullets: [
          "Export everything from the old app and store the export somewhere separate as a backup.",
          "Import a sample of about twenty notes chosen for variety: long, short, image-heavy, table-heavy.",
          "Open each imported note and compare it with the original for formatting and attachments.",
          "Decide how you will back up and synchronise in the new tool before adding more material.",
          "Move the rest in batches, checking a few notes from each batch.",
          "Use both tools in parallel for two to four weeks, writing new notes only in the new one.",
          "Archive the old workspace instead of deleting it, and delete only when you have not needed it for a full month.",
        ],
      },
      {
        heading: "Backups and sync are your responsibility with local notes",
        paragraphs: [
          "Local files are not automatically safe. Obsidian's own record notes that local notes still need a backup strategy, and the same is true for Joplin. Decide where copies live, how often they are made and how you would restore them, then test a restore once. Encrypted synchronisation protects notes in transit and at rest on the sync service, but it is not a substitute for a backup.",
          "If several people edit the same notes, test the shared workflow before you abandon a team workspace. The catalogue advises this for Obsidian's shared vaults specifically.",
        ],
      },
      {
        heading: "Rebuild your workflow, not just your notes",
        paragraphs: [
          "Notes are only half of what you are moving. The other half is the habits built around them: templates you copy for meetings, tags you use to find things, a weekly review, a place where tasks live. A migration that copies every page but forgets the workflow leaves you with an archive you do not use.",
          "Before the move, write down the five routines you rely on most and decide how each will work in the new tool. Some will translate directly, some will need a plugin or a different structure, and a few you may decide to drop. Doing this on paper first is quicker than discovering the gaps one frustrating morning at a time.",
          "Keep the structure simple at the start. Local-first tools reward a light folder and tag scheme, and hosted workspaces reward a small number of well-designed databases. You can add complexity later, once you know what you actually search for.",
        ],
      },
      {
        heading: "Which one fits you",
        paragraphs: [
          "Choose a hosted workspace when collaboration, permissions and structured project information matter most, and you accept a subscription tied to the number of people. Choose a local-first tool when ownership of the files, offline use and low ongoing cost matter more, and you are comfortable managing your own backups. If you are unsure, start with a small personal collection in a local-first tool: it is cheap to try, and Markdown makes leaving it easy.",
        ],
      },
    ],
  },
  {
    slug: "open-source-free-freemium-explained",
    title: "Free, open source, freemium: what the labels on software really mean",
    description:
      "Free of charge, free software, open source, freemium and free trial are different things. Learn how to read them and avoid surprises.",
    topic: "Licences and pricing",
    published: "2026-09-30",
    software: ["gimp", "visual-studio-code", "vscodium", "obsidian", "dropbox"],
    compare: ["visual-studio-code-vs-vscodium"],
    categories: ["code-editors", "productivity"],
    sections: [
      {
        heading: "Why the labels matter",
        paragraphs: [
          "Software listings use a handful of words that sound alike and mean different things. Mixing them up leads to real problems: a team builds a workflow on a free tier that is later capped, or assumes an open-source project is free to host at any scale. Knowing what each label promises, and what it does not, makes comparisons more honest.",
        ],
      },
      {
        heading: "Free of charge is a price, not a licence",
        paragraphs: [
          "A tool is free of charge when you can use it without paying. That says nothing about whether you may modify it, redistribute it or use it commercially. Some free-of-charge software is closed, and its terms can change. Always look for a statement about commercial use if you are a business or a freelancer, because personal-use-only terms are common.",
          "Visual Studio Code is a useful example. Its core editor is free for private and commercial use, yet the Microsoft-distributed binary is under Microsoft's own licence terms, which are different from the MIT licence that covers the source code. So the same name can carry more than one set of rules depending on what you download.",
        ],
      },
      {
        heading: "Open source and free software describe rights",
        paragraphs: [
          "Open source and free software (in the sense of freedom) describe what you are allowed to do with the source code: inspect it, change it and share it, subject to a licence. GIMP is distributed under the GNU General Public License, which is one such licence. Others, like MIT, are more permissive. The specific licence tells you what conditions apply if you modify or redistribute the software.",
          "Open source does not automatically mean no cost, and it does not mean the company behind a hosted version is free of charge. It also does not guarantee a project is well maintained. It means the code is available under terms that allow certain uses.",
        ],
      },
      {
        heading: "Derived builds and what changes",
        paragraphs: [
          "VSCodium shows how a build can differ from its source. It supplies community-built binaries from the Visual Studio Code source, distributed under the MIT licence with telemetry disabled. That does not mean every Microsoft service or extension will work unchanged, and its own record advises checking compatibility and licensing for each extension you need. When you choose a derived build, you are choosing a different distribution with its own support arrangements.",
        ],
      },
      {
        heading: "Freemium, free plans and trials",
        paragraphs: [
          "Freemium means a free tier exists alongside paid ones. The free tier is designed to be useful and to make you consider upgrading. Dropbox's Basic plan, for example, offers a small storage allowance with paid plans adding capacity and recovery options. Read the limits: storage, history length, collaborators, export options and AI allowances are the usual ceilings.",
          "A free trial is different. It lets you use paid features for a period, then expects payment or reverts. A free plan continues indefinitely but with limits. Confirm which one you are getting, and whether a card is required at the start.",
          "Obsidian shows a common hybrid: the application itself is free, including for commercial use, while optional Sync and Publish are separate paid services. The core promise and the add-ons have different prices.",
        ],
      },
      {
        heading: "Telemetry, data and what the software sends home",
        paragraphs: [
          "Licence and price are only part of the picture. Applications can also collect usage data, send crash reports or connect to cloud services by default. Some projects document this clearly and let you switch it off; others make it harder to find. VSCodium’s own description highlights that telemetry is disabled in its distribution, and Visual Studio Code’s record notes that AI features can be disabled when you do not need them.",
          "If privacy or compliance matters to you, look for a settings page or documentation that lists what is collected and how to turn it off. Then check again after major updates, because defaults can change.",
        ],
      },
      {
        heading: "Commercial use and business risk",
        paragraphs: [
          "Personal use is rarely the problem; business use is. Before adopting a tool for a company, confirm that its terms allow commercial use, that any extensions or plug-ins you need carry compatible licences, and that you understand what happens if the vendor changes its terms. Open-source licences reduce some of this risk because you can keep using a version you already have, but they do not remove the need to read the conditions.",
          "For hosted products, also ask what happens to your data if the company is acquired or the free tier disappears. A written export plan is the practical answer.",
        ],
      },
      {
        heading: "Questions to ask before you rely on a label",
        paragraphs: [
          "Use the questions below as a quick filter when a product page says “free”.",
        ],
        bullets: [
          "Free for whom: personal use, students, nonprofits, businesses?",
          "Free until when: forever, for a trial period, or until a usage cap?",
          "Which parts are free: the app, the cloud service, the AI features?",
          "What licence covers the code, and does it differ from the binary?",
          "What happens to my data if I stop paying or the plan changes?",
          "Who maintains it, and how are security fixes delivered?",
        ],
      },
      {
        heading: "Why our catalogue says “unknown”",
        paragraphs: [
          "When we cannot confirm a licence or a price from an official source, we record it as unknown instead of guessing. An unknown is honest information: it tells you to check before relying on the product for that point. Our methodology page explains how unknown values affect match scores.",
        ],
      },
    ],
  },
  {
    slug: "self-hosting-vs-hosted-services",
    title: "Self-hosting or hosted service? A decision guide for small teams",
    description:
      "Running your own file sync, password vault or design tool gives control and adds work. Compare responsibilities, costs and exit plans before you choose.",
    topic: "Infrastructure",
    published: "2026-09-30",
    software: ["nextcloud", "dropbox", "bitwarden", "penpot"],
    compare: ["dropbox-vs-nextcloud", "figma-vs-penpot"],
    categories: ["cloud-storage", "password-managers"],
    sections: [
      {
        heading: "What you are really choosing",
        paragraphs: [
          "Self-hosting means you run the software on infrastructure you control. A hosted service means the vendor runs it and you pay through a subscription or by accepting limits. The trade is control against effort. Neither is universally better, and many teams use both for different tools.",
          "Several products in our catalogue offer both routes. Nextcloud is an open-source file synchronisation platform that can be deployed on infrastructure you control, while Dropbox is a hosted service. Bitwarden and Penpot are open source and can be self-hosted as well as used as services.",
        ],
      },
      {
        heading: "What self-hosting gives you",
        paragraphs: [
          "The main benefit is control over where data lives and who operates the service. That can matter for compliance, for privacy preferences or simply for independence from a vendor's pricing changes. It can also lower recurring licence costs, although hosting and support costs depend on how you deploy.",
          "Control is real only if you use it. Deciding the location of your files is not useful if backups are missing or the server is never patched.",
        ],
      },
      {
        heading: "What self-hosting takes from you",
        paragraphs: [
          "Every self-hosted service becomes a small piece of operations work. The catalogue records for Nextcloud, Bitwarden and Penpot all make the same point in different words: self-hosting requires administration, backups and infrastructure. Be honest about who will do that work, and what happens when they are on holiday.",
        ],
        bullets: [
          "Updates and security patches, applied promptly and tested.",
          "Backups that are automatic, stored elsewhere and restored in a test at least once.",
          "TLS certificates, domain names and firewall rules.",
          "Monitoring, so you find out about downtime before your users do.",
          "Capacity planning as storage and users grow.",
          "A named person responsible, and a second person who can step in.",
        ],
      },
      {
        heading: "What a hosted service takes care of, and what it does not",
        paragraphs: [
          "A hosted service removes most operations work. You gain managed synchronisation, recovery windows and support, and you pay for it in subscription fees and vendor dependence. Read the plan differences carefully: recovery and version-history windows differ across plans, and team security and administration features are not uniform across tiers.",
          "Hosted does not mean you can forget about backups. If a service is your only copy of important files, an accidental deletion or a locked account can still hurt. Keep an independent copy of anything you cannot afford to lose.",
        ],
      },
      {
        heading: "Special care for password vaults",
        paragraphs: [
          "A password manager holds the keys to everything else, so the stakes of a mistake are high. Self-hosting a vault can be appropriate for teams with real operational discipline, but a badly maintained server is a worse risk than a managed one. If you self-host, treat the vault server as critical infrastructure with tested backups and prompt updates. If you do not have that capacity, a hosted plan is a reasonable choice.",
        ],
      },
      {
        heading: "A realistic view of the costs",
        paragraphs: [
          "People compare a subscription price with the price of a small server and conclude that self-hosting is cheap. The real comparison includes your time. Count the hours to install, secure and update the service, the cost of storage and off-site backups, and the risk that something breaks at a bad moment. For a team with spare operational capacity those costs can be small. For a team without it, they are often larger than the subscription they replace.",
          "The catalogue records reflect this: hosting and support costs for self-hosted Nextcloud depend on the deployment you choose, while hosted plans tie price to storage and features. Neither number tells you the total until you add your own labour.",
        ],
      },
      {
        heading: "Security and compliance considerations",
        paragraphs: [
          "Running a service yourself makes you responsible for its security. That means keeping software patched, limiting who can reach the server, using strong authentication and watching for unusual activity. A vendor that operates thousands of installations has a security team; you have whoever is on your list.",
          "If you handle regulated or client data, check what your obligations are before choosing either route. Sometimes a hosted service with clear certifications and contracts is the easier way to comply, and sometimes keeping data on your own infrastructure is the requirement.",
        ],
      },
      {
        heading: "A simple way to decide",
        paragraphs: [
          "Score your situation against these questions. Mostly yes on the first group points toward a hosted service, mostly yes on the second toward self-hosting.",
        ],
        bullets: [
          "Hosted: we have nobody with time to run servers; downtime would hurt more than fees; we need vendor support and clear service terms.",
          "Self-hosted: we have regular operational capacity; data location or independence is a firm requirement; hosting cost and effort are lower than long-term subscription cost.",
        ],
      },
      {
        heading: "Always have an exit plan",
        paragraphs: [
          "Whichever route you pick, write down how you would leave it. Know how to export your data in a usable format, how long it would take, and what you would move to. A working exit plan is the best protection against price changes, outages and changes of direction, and it makes the original choice much less risky.",
        ],
      },
    ],
  },
  {
    slug: "password-manager-migration-checklist",
    title: "Password manager migration checklist: moving between 1Password and Bitwarden",
    description:
      "Switching password managers is safe when you do it carefully. Follow this checklist for exports, recovery, shared vaults and cleaning up afterwards.",
    topic: "Security",
    published: "2026-09-30",
    software: ["1password", "bitwarden"],
    compare: ["1password-vs-bitwarden"],
    categories: ["password-managers"],
    sections: [
      {
        heading: "Before you start",
        paragraphs: [
          "Moving credentials is one of the more sensitive migrations you can do, so slow and methodical is better than fast. This checklist is general guidance for moving between password managers, using 1Password and Bitwarden as the example pair from our catalogue. It is not a security audit, and you should follow each vendor's own import and export instructions.",
          "Pick a quiet time, make sure you can access your email and any recovery methods, and do not begin the move if you are travelling or unable to fix problems.",
        ],
      },
      {
        heading: "Compare what you actually need",
        paragraphs: [
          "Both products offer personal and family options. Bitwarden's record describes an open-source password manager with a free personal option, a Premium tier that adds features such as integrated authentication, attachments and emergency access, and a self-hosting route. 1Password's record describes subscriptions for individuals and families with Watchtower alerts for weak or compromised credentials, sharing options and a trial.",
          "Check the current price and the exact plan that includes the features you use, especially shared family vaults and emergency access. Promotional annual prices may apply only to eligible new customers in the first year, so look at the renewal price too.",
        ],
      },
      {
        heading: "Prepare your accounts",
        paragraphs: [
          "Before touching any export, make sure you can recover both accounts. Note where your recovery codes or emergency kit are stored, and confirm that you can sign in to the email account that receives verification messages. Recovering shared access before migrating an existing vault is explicit advice in the 1Password record, and it applies in both directions.",
        ],
        bullets: [
          "Store recovery information for the old and the new manager somewhere safe and offline.",
          "Confirm two-factor authentication works on both accounts.",
          "List which family members or colleagues share vaults or items with you.",
          "Update the browser extension and applications on every device you use.",
        ],
      },
      {
        heading: "Export carefully",
        paragraphs: [
          "Exports are the riskiest step. An exported file can contain your credentials in readable form, depending on the format and options you choose. Treat it as if it were the passwords themselves: create it on a device you trust, do not email it or place it in a shared or synced folder, and never leave it in Downloads.",
          "Some managers can produce an encrypted export. If yours offers one, prefer it, and check that the new manager can read it. Otherwise, plan to delete the file securely as soon as the import has been verified.",
        ],
      },
      {
        heading: "Import and verify",
        paragraphs: [
          "Import into the new manager and then check the result before you trust it. Open a sample of logins that cover different types: ordinary websites, notes, credit cards, identities and items with attachments. Look for missing fields, duplicated entries and items that landed in the wrong folder.",
        ],
        bullets: [
          "Compare item counts between the old and the new vault.",
          "Test sign-in on several important accounts using autofill from the new manager.",
          "Check that authenticator codes, if stored in the vault, still generate valid codes.",
          "Confirm that attachments and notes arrived.",
          "Re-create sharing: shared vaults and items are often not carried across in an export.",
        ],
      },
      {
        heading: "Special cases: two-factor codes, passkeys and shared items",
        paragraphs: [
          "Some things do not travel in a normal export. If you store two-factor authentication codes in your vault, confirm how the new manager handles them, and be ready to re-enrol codes for critical accounts. Passkeys may need to be recreated rather than imported, so keep the old manager until you have checked each account you care about.",
          "Shared vaults, family members and emergency contacts are another common gap. Exports often contain your own items but not the sharing relationships around them, so plan to invite people again and confirm that everyone can still reach what they need.",
        ],
      },
      {
        heading: "Run both for a while, then clean up",
        paragraphs: [
          "Keep the old manager available for a couple of weeks after the import. You will discover odd entries you had forgotten, and you can fix them without stress. When you are confident, delete the export file, remove the old vault only after a final check, and turn off the old browser extension so autofill does not compete with the new one.",
          "This is also a good moment to improve your habits. Use the new manager's health or alert tools to find weak, reused or compromised passwords, and change the ones protecting your most important accounts, starting with email and banking.",
        ],
      },
      {
        heading: "If something goes wrong",
        paragraphs: [
          "Stay calm and do not delete anything. If entries are missing after an import, the old vault is still your source of truth: fix the export settings and import again into a clean vault instead of editing by hand. If you cannot sign in to the new manager, use the recovery information you stored before you began. If you suspect that an export file was exposed, change the passwords for your most important accounts first and treat the rest as a follow-up task.",
        ],
      },
      {
        heading: "Common mistakes to avoid",
        paragraphs: [
          "The most frequent problems are avoidable. People leave exports lying around, forget to migrate two-factor codes, or delete the old vault before checking the new one. Some cancel the old subscription before confirming that the family or team sharing they need exists in the new plan. Take it in stages, verify each stage and keep your recovery information current.",
        ],
      },
    ],
  },
];
export function guideBySlug(slug: string) {
  return guides.find((g) => g.slug === slug);
}
export function guideWordCount(g: Guide) {
  return g.sections
    .flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])])
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
}
