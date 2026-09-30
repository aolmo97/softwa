// Official-source editorial review: 2026-09-29.
import type { CatalogueContent } from './catalogue-content';
export const content1: Record<string, CatalogueContent> = {
  "premiere-pro": {
    "company": "Adobe",
    "description": "Premiere is a video editor for assembling footage, refining sound, adjusting colour and adding titles or captions. Text-Based Editing lets you work with a transcript when building a cut, while its other AI tools can help locate footage or improve speech.\n\nIt is relevant for creators who need an editing timeline alongside audio and finishing tools. The desktop application is sold by subscription; the free mobile app is a different entry point. Check the codecs, hardware and collaboration process used in your projects before moving from another editor.",
    "pros": [
      "Timeline editing, colour tools and audio mixing in one application.",
      "Transcript-based editing can help assemble spoken-content videos.",
      "Titles, captions and effects support finished video delivery."
    ],
    "cons": [
      "The desktop application has no perpetual purchase option.",
      "Stock content and additional generative usage can cost extra.",
      "Mobile and desktop features should not be treated as interchangeable."
    ],
    "useCases": [
      "Editing interviews and narrative videos",
      "Creating captioned social content",
      "Video post-production with audio and colour"
    ],
    "features": [
      "video-editing",
      "color-grading",
      "templates"
    ],
    "facts": {
      "aiFeatures": true,
      "cloud": true,
      "freePlan": true
    },
    "pricingModel": "freemium",
    "platforms": [
      "windows",
      "macos"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Premiere — desktop",
        "amount": 22.99,
        "currency": "USD",
        "period": "month",
        "notes": "Displayed US single-app annual plan billed monthly; check introductory eligibility and renewal terms."
      },
      {
        "id": "mobile",
        "name": "Premiere mobile",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Separate mobile editor. Additional generative credits can require payment."
      }
    ],
    "url": "https://www.adobe.com/products/premiere.html",
    "platformUrl": "https://helpx.adobe.com/premiere/desktop/get-started/technical-requirements/adobe-premiere-pro-technical-requirements.html",
    "note": "Desktop and mobile editions are scoped separately. Official product information covers timeline, colour, audio, AI, subscription terms and free mobile entry."
  },
  "davinci-resolve": {
    "company": "Blackmagic Design",
    "description": "DaVinci Resolve combines video editing, colour correction, visual effects, motion graphics and audio post-production. The application organizes these tasks into dedicated workspaces, including Fusion for effects and Fairlight for audio, so a project can move through several finishing stages in one environment.\n\nA free edition provides an entry point, while Studio adds features including further AI tools. Choose the edition around your footage, delivery format and effects requirements. A free download alone does not establish that every codec or Studio feature will be available on your operating system.",
    "pros": [
      "Editing, colour, effects and audio in one application.",
      "Free edition for evaluating a real production workflow.",
      "Studio is offered as a paid software purchase."
    ],
    "cons": [
      "AI tools and other advanced capabilities depend on the edition.",
      "Check codec and delivery limits for your operating system.",
      "Cloud collaboration services and hardware may add separate costs."
    ],
    "useCases": [
      "Editing and colour-grading videos",
      "Audio and visual-effects post-production",
      "Finishing projects in one application"
    ],
    "pricingModel": "freemium",
    "plans": [
      {
        "id": "base",
        "name": "DaVinci Resolve",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Free desktop edition; format and feature limits differ from Studio."
      },
      {
        "id": "studio",
        "name": "DaVinci Resolve Studio",
        "amount": 295,
        "currency": "USD",
        "period": "one-time",
        "notes": "Listed US software price. Confirm regional taxes and current licensing terms."
      }
    ],
    "url": "https://www.blackmagicdesign.com/products/davinciresolve",
    "note": "Official overview lists editing workspaces, free and Studio editions, the $295 purchase, supported desktop systems and edition-specific AI."
  },
  "kdenlive": {
    "company": "KDE community",
    "description": "Kdenlive is a free, open-source video editor developed within the KDE community. Its workflow includes organizing footage, timeline editing, audio mixing, effects, colour tools and subtitles. Proxy media can help with editing heavier footage, while nested sequences support organizing more complex timelines.\n\nIt is an option for creators looking for a desktop editor without a subscription, including on Linux. Before adopting it, run a short project through import, effects and export on your own computer. This reveals more about suitability than a simple list of supported formats.",
    "pros": [
      "Proxy media and nested sequences support practical editing workflows.",
      "Includes audio mixing, colour tools and subtitles.",
      "Free desktop releases for Linux, Windows and macOS."
    ],
    "cons": [
      "Test performance and export using your own media and hardware.",
      "Check whether required external effects and plug-ins are available.",
      "Review the documentation for your installed release before migrating projects."
    ],
    "useCases": [
      "Editing tutorials and independent videos",
      "Captioned video production",
      "Video editing on Linux"
    ],
    "features": [
      "video-editing",
      "color-grading"
    ],
    "url": "https://kdenlive.org/",
    "note": "Official overview documents proxy media, nested sequences, audio, colour and subtitle tools, desktop platforms and KDE community development."
  },
  "notion": {
    "company": "Notion",
    "description": "Notion brings documents, a knowledge base and project databases into a shared workspace. Databases can organize tasks using properties, subtasks and dependencies, while forms and published pages help collect or share information. Higher plans add controls and AI workflows aimed at teams.\n\nIt suits people who want project information and written context together. Choose a plan according to collaboration and administration needs, not just note-taking. AI trials on lower tiers should not be confused with the ongoing capabilities of Business, and member-based billing needs to be included in the budget.",
    "pros": [
      "Documents and structured project information can live together.",
      "Databases, forms and publishing support several team workflows.",
      "A Free plan provides an entry point for personal organization."
    ],
    "cons": [
      "Free and Plus include trial access to some AI capabilities.",
      "Permissions and organizational controls vary by plan.",
      "Paid workspace costs depend on billable members."
    ],
    "useCases": [
      "Team wikis and documentation",
      "Project tracking with linked context",
      "Personal knowledge and planning"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true
    },
    "platforms": [
      "windows",
      "macos"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Free",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Personal organization with basic forms and sites; AI trial access."
      },
      {
        "id": "plus",
        "name": "Plus",
        "amount": 10,
        "currency": "USD",
        "period": "month",
        "notes": "Displayed USD per-member monthly equivalent; check chosen billing cycle. Expanded collaboration, uploads and charts."
      },
      {
        "id": "business",
        "name": "Business",
        "amount": 20,
        "currency": "USD",
        "period": "month",
        "notes": "Displayed USD per-member monthly equivalent; check chosen billing cycle. Broader AI and workspace controls."
      }
    ],
    "url": "https://www.notion.com/pricing",
    "platformUrl": "https://www.notion.com/desktop",
    "note": "Pricing supports databases, plan differences, member-based billing and displayed USD amounts; desktop download page supports Windows and macOS."
  },
  "obsidian": {
    "company": "Obsidian",
    "description": "Obsidian is a note-taking application that keeps your working data locally on your device. The app can be used without signing up, and core use is free for both personal and commercial work. Its desktop and mobile downloads make it an option for keeping a knowledge collection across different devices.\n\nSync and Publish are optional services rather than requirements for local notes. Sync adds encrypted device synchronization and version history; Publish turns notes into a website. Decide whether you need these services separately from deciding whether the note-taking application suits your workflow.",
    "pros": [
      "Local data remains accessible independently of hosted add-ons.",
      "Core use is free, including commercial work.",
      "Optional Sync includes end-to-end encryption and version history."
    ],
    "cons": [
      "Official Sync and Publish are separate paid services.",
      "Local notes still need a backup strategy.",
      "Test shared-vault collaboration before replacing a team workspace."
    ],
    "useCases": [
      "Private personal knowledge collections",
      "Offline note-taking",
      "Publishing selected notes as a website"
    ],
    "pricingModel": "freemium",
    "platforms": [
      "windows",
      "macos",
      "linux",
      "android",
      "ios"
    ],
    "features": [
      "notes",
      "encryption"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Obsidian app",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Personal and commercial use; optional support licenses do not unlock required core features."
      },
      {
        "id": "sync",
        "name": "Sync",
        "amount": 48,
        "currency": "USD",
        "period": "year",
        "notes": "$4 per user/month billed annually; $5 on monthly billing. Optional service."
      },
      {
        "id": "publish",
        "name": "Publish",
        "amount": 96,
        "currency": "USD",
        "period": "year",
        "notes": "$8 per site/month billed annually; $10 on monthly billing. Optional service."
      }
    ],
    "url": "https://obsidian.md/pricing",
    "platformUrl": "https://obsidian.md/download",
    "note": "Pricing verifies local data, free core, optional services and encryption scoped to Sync. Downloads list the five desktop and mobile platforms."
  },
  "joplin": {
    "company": "Joplin contributors",
    "description": "Joplin is a free, open-source application for notes and to-dos, organized into notebooks with tags and full-text search. It stores notes in Markdown and can import Markdown files or exported Evernote content. Its offline-first design keeps data available on your computer or phone without a connection.\n\nSynchronization can use services such as Nextcloud, Dropbox, OneDrive or Joplin Cloud, with end-to-end encryption available. It is useful to distinguish the free application from the hosting service you choose. Test an import with attachments and formatting before moving your complete note collection.",
    "pros": [
      "Offline-first notes across desktop and mobile platforms.",
      "Markdown and import tools support moving existing material.",
      "Choice of synchronization services with encryption support."
    ],
    "cons": [
      "Synchronization setup and hosting costs depend on your chosen service.",
      "Review imported formatting and attachments before deleting originals.",
      "Cloud collaboration features should be checked separately from local notes."
    ],
    "useCases": [
      "Offline research notes",
      "Importing and organizing existing notebooks",
      "Notes with a chosen synchronization provider"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true,
      "offlineSupport": true
    },
    "features": [
      "notes",
      "markdown",
      "encryption",
      "task-management"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Joplin application",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Free local note-taking application; synchronization providers may charge separately."
      },
      {
        "id": "cloud",
        "name": "Joplin Cloud",
        "amount": null,
        "currency": null,
        "period": "month",
        "notes": "Optional hosted synchronization service. See its current plan page for regional pricing."
      }
    ],
    "url": "https://joplinapp.org/help/",
    "note": "Official documentation supports free software, Markdown, offline access, imports, encryption, synchronization choices and five native platforms."
  },
  "trello": {
    "company": "Atlassian",
    "description": "Trello organizes work around boards and cards, with an inbox for capturing tasks and planning tools for arranging what comes next. Its plans expand from a free workspace to additional boards, automation, views and administrative controls.\n\nIt is a candidate for teams whose work can be understood visually as items moving through a process. Compare the free workspace limits with the number of collaborators and boards you actually need. Paid subscriptions upgrade a workspace, and guests using multiple boards can become billable members.",
    "pros": [
      "Board-and-card organization makes task status visible.",
      "Automation and additional planning views are available on paid plans.",
      "Free entry for trying a small workspace."
    ],
    "cons": [
      "The Free workspace has board and collaboration limits.",
      "Multi-board guests can count toward the paid bill.",
      "Trello is cloud-only, with no on-premises edition."
    ],
    "useCases": [
      "Visual project and task boards",
      "Editorial or content calendars",
      "Tracking a repeatable team process"
    ],
    "pricingModel": "freemium",
    "facts": {
      "cloud": true,
      "selfHosted": false,
      "aiFeatures": true
    },
    "platforms": [
      "web",
      "android",
      "ios"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Free",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Up to 10 boards per workspace; check collaborator and automation limits."
      },
      {
        "id": "standard",
        "name": "Standard",
        "amount": 60,
        "currency": "USD",
        "period": "year",
        "notes": "$5 per user/month billed annually; $6 billed monthly. Unlimited boards and more automation."
      },
      {
        "id": "premium",
        "name": "Premium",
        "amount": 120,
        "currency": "USD",
        "period": "year",
        "notes": "$10 per user/month billed annually; includes additional views and workspace controls."
      }
    ],
    "url": "https://trello.com/pricing",
    "note": "Pricing page supports board limits, Standard and Premium amounts, cloud-only deployment, billing scope and paid AI features."
  },
  "asana": {
    "company": "Asana",
    "description": "Asana organizes work into tasks and projects, with views that help a team follow progress and deadlines. Personal includes list, board and calendar views; Starter adds planning tools such as timelines and Gantt views, plus reporting dashboards, forms and automation.\n\nIt is useful to evaluate Asana around how work enters a team, who owns it and how progress is reported. The free Personal tier currently targets one or two people, so a larger team should budget for paid seats. AI requests and credits have their own allowances even within paid plans.",
    "pros": [
      "Multiple project views support different ways of tracking work.",
      "Paid planning tools connect timelines, reports and automation.",
      "Forms can turn incoming requests into structured work."
    ],
    "cons": [
      "Personal is limited to two users in the reviewed plan.",
      "Starter and higher tiers are billed per user.",
      "Included AI requests and credits have usage limits."
    ],
    "useCases": [
      "Coordinating team projects and deadlines",
      "Tracking requests through a workflow",
      "Reporting progress across project tasks"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true
    },
    "platforms": [
      "windows",
      "macos",
      "android",
      "ios"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Personal",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Up to 2 users; unlimited tasks and projects with list, board and calendar views."
      },
      {
        "id": "starter",
        "name": "Starter",
        "amount": 131.88,
        "currency": "USD",
        "period": "year",
        "notes": "$10.99 per user/month billed annually; $13.49 billed monthly. Adds timelines, Gantt views and reporting."
      }
    ],
    "url": "https://asana.com/pricing",
    "platformUrl": "https://asana.com/download",
    "note": "Current pricing explicitly limits Personal to two users; Starter rates and capabilities are listed. Official download page supports desktop and mobile platforms."
  }
};
