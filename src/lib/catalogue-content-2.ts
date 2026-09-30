// Official-source editorial review: 2026-09-29.
import type { CatalogueContent } from './catalogue-content';
export const content2: Record<string, CatalogueContent> = {
  "slack": {
    "company": "Slack",
    "description": "Slack brings team conversations into channels, direct messages and audio or video huddles. Integrations connect other tools to the workspace, and paid plans add broader history, group collaboration and administrative capabilities.\n\nIt is relevant for teams that want conversations organized around ongoing work. The free tier is useful for evaluating that workflow, but its history and integration limits affect how much context remains accessible. Compare retention, external collaboration and security requirements before deciding which plan is sufficient for a business.",
    "pros": [
      "Channels and direct messages organize ongoing team communication.",
      "Huddles support real-time audio and video conversations.",
      "Integrations bring other work tools into the conversation."
    ],
    "cons": [
      "Free search covers 90 days of message history.",
      "Free workspaces are limited to 10 app integrations and one-to-one huddles.",
      "Paid prices and AI entitlements should be checked against current promotions."
    ],
    "useCases": [
      "Team project communication",
      "Connecting work notifications and discussions",
      "Coordination with external collaborators"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true
    },
    "platforms": [
      "windows",
      "macos",
      "linux",
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
        "notes": "90-day searchable history, up to 10 integrations and one-to-one huddles."
      },
      {
        "id": "pro",
        "name": "Pro",
        "amount": null,
        "currency": null,
        "period": "month",
        "notes": "Per-user subscription with unlimited history and group huddles. Promotional and regular rates differ; confirm the current checkout amount."
      }
    ],
    "url": "https://slack.com/pricing",
    "platformUrl": "https://slack.com/downloads/other",
    "note": "Free limits and Pro capabilities verified. Paid amounts intentionally not normalized because the source displays promotional rates alongside regular prices."
  },
  "discord": {
    "company": "Discord",
    "description": "Discord provides voice, video and text conversations for groups and communities. Its desktop and mobile applications let members stay involved from different devices, and its streaming features support sharing activities with friends.\n\nCore access is free, while Nitro and Nitro Basic are optional subscriptions for enhancements such as larger uploads, customization or higher-quality streaming. It is worth evaluating for a community-oriented space, but a work-chat migration should also check moderation, membership and record-keeping needs. Optional subscription perks are not equivalent to business administration features.",
    "pros": [
      "Text, voice and video communication in one service.",
      "Native desktop and mobile applications.",
      "Optional subscriptions let members add perks without requiring everyone to subscribe."
    ],
    "cons": [
      "Upload and streaming capabilities depend on the subscription tier.",
      "Nitro pricing varies by region and purchase context.",
      "Review moderation and business record-keeping needs before replacing a workplace tool."
    ],
    "useCases": [
      "Community and interest-group conversations",
      "Voice chat while gaming",
      "Sharing live activities with friends"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true
    },
    "platforms": [
      "windows",
      "macos",
      "linux",
      "android",
      "ios",
      "web"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Discord core",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Core access; premium upload, streaming and personalization perks are separate."
      },
      {
        "id": "nitro",
        "name": "Nitro / Nitro Basic",
        "amount": null,
        "currency": null,
        "period": "month",
        "notes": "Optional monthly or annual subscriptions. Current regional amounts are shown in the app."
      }
    ],
    "url": "https://discord.com/download",
    "pricingUrl": "https://support.discord.com/hc/en-us/articles/115000435108-What-are-Nitro-Nitro-Basic",
    "extraUrl": "https://discord.com/press-releases/discord-launches-nitro-rewards",
    "note": "Downloads support communication and platforms. Official Nitro documentation explains subscriptions and regional rates; the press release confirms free access with an optional membership."
  },
  "visual-studio-code": {
    "company": "Microsoft",
    "license": "Microsoft Software License Terms",
    "description": "Visual Studio Code is a code editor that combines editing with debugging, task running and version-control workflows. Microsoft provides desktop builds for Windows, macOS and Linux, alongside a browser-based edition. The core editor is free for private and commercial use.\n\nAI features connect to separate model or Copilot arrangements, and can be disabled. The source code and the Microsoft distribution also have different licensing scopes: this listing represents the official downloadable product. Evaluate language support and required extensions using an actual repository before choosing it over a full IDE.",
    "pros": [
      "Free core editor for personal and commercial projects.",
      "Debugging, task execution and version control support a development workflow.",
      "AI features can be disabled when they are not needed."
    ],
    "cons": [
      "Copilot or external model services have their own terms and allowances.",
      "The Microsoft binary uses its product license, distinct from the MIT source.",
      "Check required language tooling and extensions for your project."
    ],
    "useCases": [
      "Editing application source code",
      "Running and debugging development tasks",
      "Working with version-controlled repositories"
    ],
    "pricingModel": "free",
    "facts": {
      "freePlan": true,
      "commercialUse": true,
      "apiAvailable": true
    },
    "plans": [
      {
        "id": "base",
        "name": "VS Code core editor",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Free for private or commercial use. Copilot and external model services are separate."
      }
    ],
    "url": "https://code.visualstudio.com/docs/supporting/faq",
    "extraUrl": "https://vscodium.com/",
    "note": "Microsoft FAQ supports cost, commercial use, editor functions and extension APIs. Distribution licensing is scoped separately from the underlying MIT source."
  },
  "vscodium": {
    "company": "VSCodium community",
    "description": "VSCodium supplies community-built binaries from the Visual Studio Code source. Its build process removes Microsoft-specific product configuration, and the project distributes the resulting editor under the MIT license with telemetry disabled.\n\nIt is aimed at people who want the VS Code codebase with a different distribution and licensing setup. That does not establish that every Microsoft service or extension will work in the same way. Check your required extensions, update route and team setup before switching an existing development environment.",
    "pros": [
      "MIT-licensed binaries built from the VS Code source.",
      "Telemetry is disabled in the project distribution.",
      "Installers and package-manager options cover major desktop platforms."
    ],
    "cons": [
      "Check compatibility and licensing for every required extension.",
      "Microsoft-specific services should not be assumed to transfer unchanged.",
      "Package-manager builds can have their own support and update arrangements."
    ],
    "useCases": [
      "Development with a community-distributed editor",
      "Teams preferring MIT-licensed editor binaries",
      "Using the VS Code codebase with telemetry disabled"
    ],
    "url": "https://vscodium.com/",
    "note": "Project documentation supports binary licensing, build differences, disabled telemetry, platforms and package-management considerations."
  },
  "dropbox": {
    "company": "Dropbox",
    "description": "Dropbox is a hosted service for storing, synchronizing and sharing files. Basic provides a small free storage allowance, while paid plans expand storage and add capabilities for recovery, transfers and team administration. File history can help recover earlier versions within the plan's retention window.\n\nIt is useful when you want managed file sharing without running a server. Choose a tier around total storage, recovery needs and the number of people involved. A subscription with more space does not automatically include the administrative or security controls of a team plan.",
    "pros": [
      "Managed file synchronization and sharing.",
      "Basic provides 2 GB of free storage.",
      "Version history and recovery are available with plan-specific retention."
    ],
    "cons": [
      "The Basic allowance can be restrictive for large media collections.",
      "Recovery windows differ across plans.",
      "Team security and administration features are not uniform across tiers."
    ],
    "useCases": [
      "Sharing files with clients or collaborators",
      "Keeping working files available across devices",
      "Recovering earlier file versions"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true
    },
    "platforms": [
      "web"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Basic",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "2 GB of storage; 30-day recovery and version history described on the Basic page."
      },
      {
        "id": "plus",
        "name": "Plus",
        "amount": 9.99,
        "currency": "USD",
        "period": "month",
        "notes": "Displayed USD monthly equivalent for one person and 2 TB. Confirm the selected billing cycle at checkout."
      }
    ],
    "url": "https://www.dropbox.com/plans",
    "extraUrl": "https://www.dropbox.com/basic",
    "note": "Official plans and Basic pages support storage, recovery and sharing. The displayed paid amount depends on the selected billing cycle."
  },
  "nextcloud": {
    "company": "Nextcloud",
    "description": "Nextcloud Files is an open-source file synchronization and sharing platform that can be deployed on infrastructure you control. It supports shared links, access permissions, file locking and version recovery, with desktop and mobile clients connecting to the server.\n\nIt is relevant when deciding where files live and who operates the service is part of the requirement. Self-hosting transfers responsibility for updates, backups, storage and availability to the operator. Managed providers and enterprise arrangements offer other deployment routes, so compare the full operating cost rather than only the software download.",
    "pros": [
      "Self-hosting gives control over the server deployment.",
      "Sharing permissions, locking and file history support collaboration.",
      "Desktop and mobile clients connect users to the same service."
    ],
    "cons": [
      "Self-hosting requires administration, backups and infrastructure.",
      "Hosting and support costs depend on the deployment choice.",
      "Office collaboration depends on the chosen integrations and setup."
    ],
    "useCases": [
      "File sharing on controlled infrastructure",
      "Organization-managed synchronization",
      "Collaborative folders with access policies"
    ],
    "platforms": [
      "windows",
      "macos",
      "linux",
      "android",
      "ios",
      "web"
    ],
    "features": [
      "file-sharing",
      "team-collaboration"
    ],
    "plans": [
      {
        "id": "deployment",
        "name": "Self-hosted deployment",
        "amount": null,
        "currency": null,
        "period": "unknown",
        "notes": "Server software and client deployment are available. Budget separately for infrastructure, administration and optional support."
      },
      {
        "id": "enterprise",
        "name": "Enterprise / managed hosting",
        "amount": null,
        "currency": null,
        "period": "unknown",
        "notes": "Request a quote or compare providers for the chosen deployment and support scope."
      }
    ],
    "url": "https://nextcloud.com/files/",
    "platformUrl": "https://nextcloud.com/install/",
    "note": "Files documentation supports permissions, locking, versioning and web collaboration. Installation page lists native clients and deployment choices; no zero total hosting cost is claimed."
  },
  "bitwarden": {
    "company": "Bitwarden",
    "description": "Bitwarden is an open-source password manager with an encrypted vault and applications for browsers, desktop systems and mobile devices. Its free personal option covers basic password management, while Premium adds features such as integrated authentication, attachments and emergency access.\n\nFamilies and business plans change sharing and administrative capabilities. Self-hosting is an available deployment route, with plan conditions that should be reviewed separately. Choose according to who needs access to shared credentials and which recovery or administration features are required, rather than price alone.",
    "pros": [
      "A free personal entry option for password management.",
      "Open-source software with a self-hosting option.",
      "Clients for browsers, desktop and mobile devices."
    ],
    "cons": [
      "Emergency access and other Premium features require a paid tier.",
      "Business sharing and policies depend on the organization plan.",
      "Self-hosting adds operational responsibilities and edition considerations."
    ],
    "useCases": [
      "Managing personal passwords across devices",
      "Sharing credentials within a family",
      "Organization password management"
    ],
    "pricingModel": "freemium",
    "platforms": [
      "windows",
      "macos",
      "linux",
      "android",
      "ios",
      "web"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Free",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Basic personal password management."
      },
      {
        "id": "premium",
        "name": "Premium",
        "amount": 19.8,
        "currency": "USD",
        "period": "year",
        "notes": "US annual subscription; $1.65 monthly equivalent. Taxes excluded."
      },
      {
        "id": "families",
        "name": "Families",
        "amount": 47.88,
        "currency": "USD",
        "period": "year",
        "notes": "US annual subscription for up to 6 users; taxes excluded."
      }
    ],
    "url": "https://bitwarden.com/pricing/",
    "platformUrl": "https://bitwarden.com/download/",
    "note": "Current personal prices, plan differences and business self-hosting are documented on the pricing page; downloads verify native and web clients."
  },
  "1password": {
    "company": "1Password",
    "description": "1Password stores passwords and other credentials in encrypted vaults, with tools for generating, saving and autofilling login details. Watchtower identifies weak or compromised credentials, while sharing options let people exchange selected items or use shared family vaults.\n\nThe Individual and Families subscriptions target different access needs, and both offer a trial. Introductory offers should be compared with the regular renewal rate. Before importing an existing vault, test access on your devices and decide how your household or team will manage recovery and shared information.",
    "pros": [
      "Password generation, autofill and credential sharing.",
      "Watchtower alerts help identify credentials needing attention.",
      "Desktop, mobile and browser support across major platforms."
    ],
    "cons": [
      "Promotional annual prices apply only to eligible new customers in the first year.",
      "Family and business administration are different offerings.",
      "Plan recovery and shared access before migrating an existing vault."
    ],
    "useCases": [
      "Personal passwords and secure information",
      "Household credential sharing",
      "Credentials used across desktop and mobile"
    ],
    "pricingModel": "subscription",
    "facts": {
      "freeTrial": true
    },
    "features": [
      "password-management",
      "encryption"
    ],
    "plans": [
      {
        "id": "individual",
        "name": "Individual",
        "amount": 47.88,
        "currency": "USD",
        "period": "year",
        "notes": "Regular USD annual rate ($3.99/month equivalent). An eligible first-year offer may be lower; 14-day trial."
      },
      {
        "id": "families",
        "name": "Families",
        "amount": 71.88,
        "currency": "USD",
        "period": "year",
        "notes": "Regular USD annual rate ($5.99/month equivalent). Introductory offers and membership limits should be checked."
      }
    ],
    "url": "https://1password.com/pricing/personal",
    "note": "Personal pricing page distinguishes regular and promotional annual rates, trial duration, encryption, autofill, Watchtower and platform support."
  }
};
