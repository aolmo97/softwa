// Official-source editorial review: 2026-09-29.
import type { CatalogueContent } from './catalogue-content';
export const content0: Record<string, CatalogueContent> = {
  "photoshop": {
    "company": "Adobe",
    "description": "Photoshop is an image editor for retouching photographs and building layered compositions. Selections, masks and adjustment layers let you change one part of an image while keeping the rest intact. Its generative tools can add, remove or extend image content.\n\nIt fits photographers, visual designers and creators who need control over individual edits. Desktop, web and mobile editions have different capabilities. The desktop subscription is separate from the free mobile entry option, so compare the edition you will actually use.",
    "pros": [
      "Layer masks and adjustment layers support controlled, nondestructive edits.",
      "Combines retouching, compositing and generative image tools.",
      "Desktop and web workflows are available within the subscription."
    ],
    "cons": [
      "Annual billing by month is an annual commitment; review cancellation terms.",
      "The free mobile edition does not replace the full desktop app.",
      "AI allowances and features vary by plan."
    ],
    "useCases": [
      "Retouching product and portrait photos",
      "Combining images for campaign artwork",
      "Preparing layered graphics"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Photoshop — desktop and web",
        "amount": 22.99,
        "currency": "USD",
        "period": "month",
        "notes": "US individual plan, annual commitment billed monthly. Check taxes and cancellation terms."
      },
      {
        "id": "mobile",
        "name": "Photoshop mobile — free entry",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Mobile edition only; premium features require a subscription. Not the desktop editor."
      }
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true,
      "cloud": true
    },
    "platforms": [
      "windows",
      "macos",
      "web"
    ],
    "url": "https://www.adobe.com/products/photoshop.html",
    "platformUrl": "https://helpx.adobe.com/photoshop/system-requirements.html",
    "note": "Desktop subscription and free mobile entry are distinct editions. Product page supports editing tools, plan amounts and cloud storage; technical requirements support desktop platforms."
  },
  "gimp": {
    "company": "GIMP contributors",
    "license": "GNU GPL",
    "description": "GIMP is a community-developed image editor for photo retouching, image composition and creating original graphics. It provides a desktop workflow for editing images without buying a subscription, with source code distributed under the GNU General Public License.\n\nIt is a relevant option when you need a free image-manipulation tool on Windows, macOS or Linux. Before moving an established workflow, try a representative project: file exchange, plug-ins and print requirements matter more than whether two applications share the same feature labels.",
    "pros": [
      "Free software with source code available for inspection and modification.",
      "Photo retouching and image composition in a desktop application.",
      "Available across the three major desktop operating systems."
    ],
    "cons": [
      "Test Photoshop file exchange on layered documents before migrating.",
      "Check your print and colour-management requirements with the actual output workflow.",
      "Existing plug-ins should be checked against the GIMP version you install."
    ],
    "useCases": [
      "Retouching photos without a subscription",
      "Creating image composites",
      "Preparing graphics on Linux"
    ],
    "url": "https://www.gimp.org/about/",
    "extraUrl": "https://www.gimp.org/docs/userfaq.html",
    "note": "Project description and FAQ support the community model, GPL licensing, editing scope and migration considerations."
  },
  "krita": {
    "company": "Krita contributors",
    "description": "Krita is a painting application built around brushes, drawing assistance and layered artwork. Its brush engines, stabilizers and customizable workspace help artists develop illustrations, while vector and text tools can support comic panels. It also includes a workspace for 2D animation.\n\nThe strongest reason to consider Krita is a drawing or painting workflow. Evaluate it using your own tablet, brush presets and sample artwork. A photography workflow should be tested separately, since having layers does not make painting tools interchangeable with a photo editor.",
    "pros": [
      "Customizable brushes and stroke stabilizers for drawing.",
      "Painting, comic layout tools and 2D animation in one application.",
      "Free core application without a required subscription."
    ],
    "cons": [
      "For a Photoshop migration, test your specific photo-editing tasks.",
      "Check tablet behaviour and imported brush resources on your system.",
      "Validate layered file exchange with collaborators before switching."
    ],
    "useCases": [
      "Digital illustration and concept art",
      "Comics and painted textures",
      "Hand-drawn 2D animation"
    ],
    "features": [
      "digital-painting",
      "layers",
      "vector-graphics"
    ],
    "url": "https://krita.org/en/features/",
    "note": "Feature documentation supports brushes, stabilization, vectors, text, animation and subscription-free use. Migration checks are editorial guidance."
  },
  "canva": {
    "company": "Canva",
    "description": "Canva combines templates, stock content and editing tools for producing presentations, social graphics and branded materials. Its plans bundle design assets, cloud storage and AI allowances, making the choice of plan part of the creative workflow.\n\nIt is worth considering when repeatable layouts and access to ready-made content are more important than a specialist editing environment. Start with the Free plan and test the actual assets and export workflow you need. Premium content, brand tools and AI usage are not identical across plans.",
    "pros": [
      "Templates and visual assets support recurring content production.",
      "Brand kits and scheduling are available on paid plans.",
      "A Free plan lets you try the design workflow before upgrading."
    ],
    "cons": [
      "Premium assets and larger AI allowances require a paid plan.",
      "AI usage is shared across tools and subject to limits.",
      "Review content licensing for the assets used in your deliverables."
    ],
    "useCases": [
      "Social posts and campaign graphics",
      "Presentations and reusable layouts",
      "Consistent branded content"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Canva Free",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Free templates and editing with limited AI access."
      },
      {
        "id": "pro",
        "name": "Canva Pro",
        "amount": 144,
        "currency": "USD",
        "period": "year",
        "notes": "US price for one person, billed yearly. Includes premium assets and brand tools; taxes extra."
      }
    ],
    "url": "https://www.canva.com/pricing/",
    "note": "Pricing page supports Free and Pro, annual US pricing, templates, brand kits, scheduling, cloud storage and AI limits."
  },
  "figma": {
    "company": "Figma",
    "description": "Figma Design is a shared workspace for designing interfaces and reviewing them with other people. Multiplayer editing and comments keep feedback alongside the design. Components, variables and shared libraries help teams reuse decisions across screens, while prototypes make flows easier to discuss before implementation.\n\nIt suits product teams coordinating designers and developers. Choose seats according to what each person needs: Full, Dev and Collab seats do not unlock the same products. Test the free Starter plan against your team-file, library and handoff requirements before selecting a paid tier.",
    "pros": [
      "Shared files and comments support collaborative design reviews.",
      "Reusable components and libraries help maintain a design system.",
      "Prototyping and developer handoff connect design with implementation."
    ],
    "cons": [
      "Seat types have different capabilities and prices.",
      "Starter provides limited access; larger team workflows may need a paid plan.",
      "AI credits have plan-specific allowances."
    ],
    "useCases": [
      "Designing website and app interfaces",
      "Maintaining shared design systems",
      "Prototyping user journeys"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true
    },
    "features": [
      "prototyping",
      "team-collaboration",
      "vector-graphics"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Starter",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Limited product access, unlimited drafts and a capped AI allowance."
      },
      {
        "id": "professional",
        "name": "Professional — Full seat",
        "amount": 16,
        "currency": "USD",
        "period": "month",
        "notes": "Displayed USD price per Full seat; billing options are monthly or annual. Confirm selected cycle at checkout."
      }
    ],
    "url": "https://www.figma.com/design/",
    "pricingUrl": "https://www.figma.com/pricing/",
    "note": "Design page supports collaboration, vector editing, libraries and prototyping. Pricing is scoped to Starter and the displayed Professional Full seat, not Dev or Collab seats."
  },
  "penpot": {
    "company": "Kaleidos",
    "description": "Penpot is an open-source platform for collaborative interface design and prototyping. Its layout tools use CSS Grid and Flex concepts, and its components, design tokens and shared libraries support reusable design systems. Developers can inspect designs using familiar web standards.\n\nTeams can use the hosted service or operate an installation themselves. That choice is useful when control over infrastructure is a requirement, but self-hosting also creates maintenance work. Try a real design file and handoff process before assuming it will replace every part of an existing Figma workflow.",
    "pros": [
      "Open-source platform with a self-hosting option.",
      "Layout and inspection use web standards such as CSS and SVG.",
      "Core design tools are included in the free hosted plan."
    ],
    "cons": [
      "Hosted plans differ in storage, history and administrative controls.",
      "Self-hosting requires maintenance, backups and server resources.",
      "Test file migration and required integrations with a real project."
    ],
    "useCases": [
      "Collaborative UI design",
      "Design systems using web layout concepts",
      "Design teams requiring self-hosting"
    ],
    "pricingModel": "freemium",
    "facts": {
      "freePlan": true,
      "cloud": true
    },
    "platforms": [
      "web"
    ],
    "plans": [
      {
        "id": "base",
        "name": "Professional — hosted",
        "amount": 0,
        "currency": "USD",
        "period": "free",
        "notes": "Core design and collaboration tools; storage and history limits apply."
      },
      {
        "id": "unlimited",
        "name": "Unlimited — hosted",
        "amount": 7,
        "currency": "USD",
        "period": "month",
        "notes": "Per editor per month, with a published $175 monthly cap; extended storage and history."
      }
    ],
    "url": "https://penpot.app/",
    "pricingUrl": "https://penpot.app/pricing",
    "note": "Product and pricing pages support self-hosting, open standards, core tools and hosted prices. Hosting costs are separate from software access."
  },
  "illustrator": {
    "company": "Adobe",
    "description": "Illustrator is Adobe's vector graphics application for creating logos, illustrations and graphic artwork. Vector-based shapes can be resized for different outputs, and its drawing and generative tools support creating and refining visual assets.\n\nIt is relevant when the deliverable needs editable vector artwork rather than only a finished image. Compare it with Inkscape using the files your clients or printers actually accept. Subscription terms and the tools included in your chosen edition should be reviewed alongside the drawing workflow.",
    "pros": [
      "Vector drawing for reusable logos and illustrations.",
      "Tools for creating and refining graphic shapes.",
      "Generative design features complement manual editing."
    ],
    "cons": [
      "The advertised monthly amount requires an annual commitment.",
      "Check export, fonts and printer requirements using a sample deliverable.",
      "AI features and entitlements can vary by plan."
    ],
    "useCases": [
      "Logo and brand artwork",
      "Vector illustrations",
      "Scalable graphics for multiple outputs"
    ],
    "platforms": [
      "windows",
      "macos"
    ],
    "url": "https://www.adobe.com/products/illustrator.html",
    "platformUrl": "https://helpx.adobe.com/illustrator/system-requirements.html",
    "note": "Official product page supports vector editing, generative features and the US single-app price. Desktop requirements list Windows and macOS."
  },
  "inkscape": {
    "company": "Inkscape contributors",
    "description": "Inkscape is a free, open-source vector editor that uses SVG as its native format. The project identifies illustrations, icons, logos, diagrams, maps and web graphics as its main uses. It runs on Windows, macOS and Linux.\n\nIt is a practical candidate for creating editable vector artwork without an ongoing software subscription. If you exchange files with Illustrator users or a print supplier, make compatibility testing part of the decision. Start with a document containing the fonts, effects and output settings that your normal work depends on.",
    "pros": [
      "Uses the open SVG format for editable vector documents.",
      "No subscription is required for the free desktop application.",
      "Available for Windows, macOS and Linux."
    ],
    "cons": [
      "Validate your supplier's required formats before changing tools.",
      "Test text, effects and layout when exchanging documents with other editors.",
      "Compare your actual print workflow instead of assuming identical output."
    ],
    "useCases": [
      "Creating logos and icons",
      "Illustrations and web graphics",
      "Diagrams and maps"
    ],
    "url": "https://github.com/inkscape/inkscape",
    "note": "The project-owned README supports SVG, desktop platforms, open-source distribution and listed artwork uses. Compatibility checks are editorial advice."
  }
};
