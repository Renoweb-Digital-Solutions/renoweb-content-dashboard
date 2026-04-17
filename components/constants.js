export const AUTHORS = [
    {
        id: "gourab",
        name: "Gourab Majumder",
        role: "Founder & CEO, Renoweb Digital Solutions",
        bio: "Gourab Majumder is a B2B consultant, business mentor specializing in SaaS growth, content strategy, CX, and data-driven innovation for digital businesses.",
        image: null,
        social: {
            linkedin: "https://www.linkedin.com/in/gourabmajumderofficial-marketingmaestro/",
            email: "gourab@renoweb.com"
        },
    },
    {
        id: "samaresh",
        name: "Samaresh Das",
        role: "Head of Software Development, Renoweb Digital Solutions",
        bio: "Samaresh Das is a MERN stack developer with expertise in front-end development, React.js, and modern JavaScript. He develops responsive, user-centric web applications optimized for real-world use.",
        image: null,
        "social": {
            "linkedin": "https://www.linkedin.com/in/samaresh-d-ab9621212/",
            "email": "samareshmail679@gmail.com"
        }
    }
];

export const CATEGORIES = [
    "Lead Gen",
    "SMM OS",
    "Organic",
    "Performance OS",
    "LinkedIn",
    "Community Management",
    "Dev OS",
    "Client Highlights",
];

export const slugify = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const initCaseStudyForm = () => ({
    id: "",
    category: "",
    title: "",
    about_client: "",
    challenges: [""],
    solutions: { approach: "", process: [""] },
    conclusion: "",
    takeaway: "",
    link: "",
    author: AUTHORS[0],
    coAuthor: null,
    bannerFile: null,
    bannerPreview: null,
    uiux_issues: [
        { id: "", title: "", description: "", beforeCaption: "", beforeImageFile: null, beforeImagePreview: null }
    ],
    website_issues: [],
    results_conclusion: "",
    beforeAfterShowcase: {
        before: { imageFile: null, imagePreview: null, caption: "" },
        after: { imageFile: null, imagePreview: null, caption: "" },
    },
    bannerUrl: "",
    featured: false,
    createdAt: "",
    updatedAt: "",
});

export const DUMMY_CASE_STUDIES = [
    {
        id: "saas-demand-gen-rebuild",
        category: "Lead Gen",
        title: "Rebuilding a SaaS Demand Gen Funnel for Cleaner Pipeline Attribution",
        about_client: "A B2B SaaS company struggling with fragmented lead capture and unclear campaign attribution across paid and organic channels.",
        challenges: [
            "Leads from multiple landing pages were not mapped to the right acquisition sources.",
            "Sales teams lacked confidence in the quality and recency of handoff data.",
        ],
        solutions: {
            approach: "We consolidated forms, standardized attribution parameters, and aligned campaign taxonomy across the funnel.",
            process: [
                "Audited existing form and CRM touchpoints.",
                "Rebuilt conversion flows with consistent source capture and cleaner reporting.",
            ],
        },
        conclusion: "The rebuilt funnel gave the team a single reliable source of truth for demand attribution.",
        takeaway: "Operational clarity often unlocks growth before more ad spend does.",
        link: "https://example.com/case-studies/saas-demand-gen-rebuild",
        author: AUTHORS[0],
        coAuthor: AUTHORS[1],
        bannerPreview: null,
        bannerUrl: "",
        uiux_issues: [],
        website_issues: ["Inconsistent CTAs", "Tracking gaps across forms"],
        results_conclusion: "Qualified pipeline reporting became clearer and weekly campaign reviews were faster.",
        beforeAfterShowcase: {
            before: { image: "", caption: "Legacy landing flow with disconnected tracking." },
            after: { image: "", caption: "Unified funnel with consistent attribution capture." },
        },
        featured: true,
        createdAt: "2026-02-02T10:00:00.000Z",
    },
    {
        id: "community-led-growth-ops",
        category: "Community Management",
        title: "Turning a Passive Audience Into an Active Community-Led Growth Loop",
        about_client: "A founder-led brand with strong reach but weak repeat engagement and low conversion from community touchpoints.",
        challenges: [
            "Audience interaction was one-directional and event participation dropped over time.",
            "Community content lacked a clear bridge to business outcomes.",
        ],
        solutions: {
            approach: "We redesigned the community operating system around recurring formats, response rituals, and clearer CTA sequencing.",
            process: [
                "Mapped audience segments and content response patterns.",
                "Introduced recurring engagement mechanics and conversion pathways.",
            ],
        },
        conclusion: "The new structure made community participation more predictable and commercially useful.",
        takeaway: "Consistency and response design matter more than constant novelty in community programs.",
        link: "https://example.com/case-studies/community-led-growth-ops",
        author: AUTHORS[1],
        coAuthor: null,
        bannerPreview: null,
        bannerUrl: "",
        uiux_issues: [],
        website_issues: ["Weak event landing page hierarchy"],
        results_conclusion: "Repeat participation improved and event signups became easier to attribute.",
        beforeAfterShowcase: {
            before: { image: "", caption: "Generic announcements without feedback loops." },
            after: { image: "", caption: "Structured participation cycles with response prompts." },
        },
        featured: false,
        createdAt: "2026-01-18T09:30:00.000Z",
    },
    {
        id: "dev-os-site-migration",
        category: "Dev OS",
        title: "Site Migration With Better UX, Better Content Structure, and Less Publishing Friction",
        about_client: "A service business needed a faster site structure and a content workflow that non-developers could actually maintain.",
        challenges: [
            "Legacy pages were hard to update and content ownership was unclear.",
            "The old UX buried important proof points below the fold.",
        ],
        solutions: {
            approach: "We paired IA cleanup with a publishing workflow designed around reusable sections and clearer ownership.",
            process: [
                "Restructured page templates around editorial priorities.",
                "Simplified CMS inputs and publishing handoffs for internal teams.",
            ],
        },
        conclusion: "The migration reduced operational drag while improving the user journey.",
        takeaway: "A better CMS is often a UX project for the internal team as much as the visitor.",
        link: "https://example.com/case-studies/dev-os-site-migration",
        author: AUTHORS[0],
        coAuthor: null,
        bannerPreview: null,
        bannerUrl: "",
        uiux_issues: [],
        website_issues: ["Cluttered navigation", "Unclear proof hierarchy"],
        results_conclusion: "Publishing became faster and the site surfaced trust signals earlier in the journey.",
        beforeAfterShowcase: {
            before: { image: "", caption: "Dense templates with inconsistent content blocks." },
            after: { image: "", caption: "Lean templates built for repeatable publishing." },
        },
        featured: true,
        createdAt: "2026-03-11T14:20:00.000Z",
    },
];
