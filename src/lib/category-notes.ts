// Editorial buying notes shown on category pages. General guidance only: no
// product claims, so nothing here needs source verification.
export type CategoryNote = { intro: string; questions: string[] };
export const categoryNotes: Record<string, CategoryNote> = {
  "cloud-storage": {
    intro:
      "File storage tools differ less in how they store files than in who runs them, how long they keep old versions and how easily you can share. Decide first whether you want a managed service or a platform you operate yourself, then compare storage allowances and recovery options for the plan you would actually use.",
    questions: [
      "How much storage do I need now and in a year?",
      "How far back can I recover a deleted or overwritten file?",
      "Who is allowed to see my files, and where are they stored?",
      "Can I export everything in a usable form if I leave?",
    ],
  },
  "code-editors": {
    intro:
      "Code editors converge on similar features, so the deciding factors are usually licensing, extension support and what runs on your machine. Check how the editor is distributed, whether it collects telemetry, and whether the extensions and language tooling your project needs work with the build you install.",
    questions: [
      "Which languages and frameworks do I need first-class support for?",
      "Do my required extensions work in this distribution?",
      "Is the licence acceptable for commercial work?",
      "Can I turn off optional cloud or AI features if I want to?",
    ],
  },
  communication: {
    intro:
      "Team chat tools are chosen for the people they connect. The best product on paper fails if your colleagues or community will not use it. Look at how conversations are organised, how history and search are limited on free plans, and what moderation and admin controls you need.",
    questions: [
      "Who has to join, and are they already on another platform?",
      "How much history and search is included in the plan I can afford?",
      "What moderation, roles and admin controls do I need?",
      "How easily can I bring in or export conversations?",
    ],
  },
  design: {
    intro:
      "Design covers several separate jobs: interface design, vector artwork, templates and branding. Start by naming the deliverable and who must open your files, because collaboration and file exchange usually matter more than the toolbox. Try the same small project in each candidate before committing.",
    questions: [
      "What is the final deliverable: screens, a logo, a presentation, print artwork?",
      "Who needs to edit or comment on my files?",
      "Which file formats do clients and printers require?",
      "How do seat types and team plans change the total price?",
    ],
  },
  "office-suites": {
    intro:
      "Office suites are judged by how well they handle the documents you already have. Before comparing price, test real files: formatting, tables, macros and comments are where differences show. Decide whether you need cloud storage and real-time collaboration built in, and whether a free desktop suite covers the rest.",
    questions: [
      "Which file formats do colleagues and clients send me?",
      "Do I need real-time co-editing and cloud storage, or only desktop apps?",
      "Do I rely on macros, add-ins or advanced spreadsheet features?",
      "What is the total yearly cost for everyone who needs a licence?",
    ],
  },
  "audio-editing": {
    intro:
      "Audio tools range from simple recorders to full multitrack workstations. Match the tool to the job: cleaning a voice recording is a different task from mixing a multi-instrument project. Check plug-in support, format handling and how easily you can restore noisy recordings before deciding.",
    questions: [
      "Do I record, edit, mix, or restore audio, and how often?",
      "Which file formats and plug-ins does my workflow need?",
      "Will collaborators need my project files or only the exports?",
      "Would a free editor cover this work before I pay for a subscription?",
    ],
  },
  "3d": {
    intro:
      "3D software is a large investment of learning time, so choose around your pipeline. Consider whether your work is modeling, animation, motion graphics or rendering, which file formats you must exchange, and whether a studio or client dictates the tool. Free and paid suites can overlap heavily; test a real project.",
    questions: [
      "Is my main task modeling, animation, motion design or rendering?",
      "Which file formats and render engines does my pipeline require?",
      "Does a client or studio require a particular package?",
      "What are the hardware and operating-system requirements?",
    ],
  },
  analytics: {
    intro:
      "Web analytics tools differ in how much they collect, where the data lives and what consent they require. Decide what you actually need to know about your visitors, then weigh reporting depth against privacy and cost. Self-hosting gives control but adds maintenance, while hosted tools are simpler to run.",
    questions: [
      "Which questions must analytics answer for my site?",
      "Do I need cookies, and what consent will my audience be asked for?",
      "Would I host it myself or use a hosted service?",
      "How does price change as my traffic grows?",
    ],
  },
  "password-managers": {
    intro:
      "A password manager holds the keys to your other accounts, so trust and recovery matter more than features. Compare how each product handles sharing, emergency access and account recovery, and decide whether a managed service or a self-hosted option fits the effort you can realistically sustain.",
    questions: [
      "What happens if I forget my master password or lose a device?",
      "Do I need family or team sharing, and what does it cost?",
      "Can I import my existing vault and export it again?",
      "Would I be able to run and maintain a self-hosted server safely?",
    ],
  },
  "photo-editing": {
    intro:
      "Photo editing ranges from quick corrections to layered compositing. Match the tool to the amount of control you need, and test how it handles your real files, including raw formats, colour profiles and layered documents shared with other people. Free tools can be excellent, provided the file exchange works for you.",
    questions: [
      "Do I need layers, masks and non-destructive adjustments?",
      "Which file formats and colour profiles does my workflow use?",
      "Will collaborators or printers need my layered files?",
      "Does the tool run on the operating systems I use?",
    ],
  },
  productivity: {
    intro:
      "Productivity and note-taking tools pull in two directions: hosted workspaces that make collaboration easy, and local-first tools that give you ownership of the files. Consider how your notes and documents will leave the tool one day, and test structured data such as databases and attachments during a trial import.",
    questions: [
      "Do I work alone, or does a team need shared editing and permissions?",
      "Do I want my notes as files on my own device?",
      "How will I back up and synchronise across devices?",
      "What does the plan cost per person as the team grows?",
    ],
  },
  "project-management": {
    intro:
      "Project management tools succeed when the team keeps them up to date, so simplicity often beats depth. Compare how work is visualised, how permissions and reporting scale, and how pricing changes as you add people. A short pilot with a real project will show what a feature list cannot.",
    questions: [
      "Which view suits how we plan: boards, lists, timelines?",
      "How many people need access, and at what price per seat?",
      "What reporting or automation do we genuinely need?",
      "Can we import our existing tasks and keep the history?",
    ],
  },
  "video-editing": {
    intro:
      "Video editors demand a lot from your hardware and your time to learn them. Consider the formats you shoot, the machine you edit on and the delivery requirements of your clients before comparing price. A free editor can be more than enough, but confirm codec support and export options with your own footage.",
    questions: [
      "Which camera formats and codecs do I need to import?",
      "Will my computer handle the editor smoothly?",
      "What export formats and resolutions do my clients require?",
      "Do I need colour grading, audio tools or motion graphics in the same app?",
    ],
  },
};
