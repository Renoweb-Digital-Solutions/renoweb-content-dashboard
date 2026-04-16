// components/cms/research-hub/RHconstants.js
// ─────────────────────────────────────────────────────────────────────────────
// All Research Hub-specific constants and the form initialiser.
// Accent colour: amber/orange (amber-500 / orange-400) — distinct from Blog blue.
// ─────────────────────────────────────────────────────────────────────────────

export const AUTHORS = [
    {
        id: "gourab",
        name: "Gourab Majumder",
        role: "Founder & CEO, Renoweb Digital Solutions",
        bio: "Gourab Majumder is a B2B consultant, business mentor specializing in SaaS growth, content strategy, CX, and data-driven innovation for digital businesses.",
        image: null,
        social: {
            linkedin: "https://www.linkedin.com/in/gourabmajumderofficial-marketingmaestro/",
            email: "gourab@renoweb.com",
        },
    },
    {
        id: "samaresh",
        name: "Samaresh Das",
        role: "Head of Software Development, Renoweb Digital Solutions",
        bio: "Samaresh Das is a MERN stack developer with expertise in front-end development, React.js, and modern JavaScript.",
        image: null,
        social: {
            linkedin: "https://www.linkedin.com/in/samaresh-d-ab9621212/",
            email: "samareshmail679@gmail.com",
        },
    },
];

export const RH_CATEGORIES = [
    "Market Research",
    "Industry Report",
    "Case Analysis",
    "Whitepaper",
    "Survey",
    "Trend Report",
    "Competitive Analysis",
    "Technical Research",
];

export const RH_CONTENT_TYPES = [
    { value: "report", label: "Research Report" },
    { value: "whitepaper", label: "Whitepaper" },
    { value: "infographic", label: "Infographic" },
    { value: "dataset", label: "Dataset" },
    { value: "case-analysis", label: "Case Analysis" },
];

export const slugify = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const initRHForm = () => ({
    id: "",
    category: "",
    contentType: "",
    title: "",
    slug: "",
    abstract: "",
    bannerFile: null,
    bannerPreview: null,
    content: "",
    author: AUTHORS[0],
    coAuthor: null,
    publishDate: new Date().toISOString().slice(0, 10),
    tags: [],
    readTime: "",
    pageCount: "",
    downloadable: false,
    featured: false,
});

// ── Dummy data for Manage Research Hub ───────────────────────────────────────
export const DUMMY_RESEARCH_HUBS = [
    {
        id: "rh-001",
        category: "Market Research",
        contentType: "report",
        title: "The State of B2B SaaS Marketing in 2024: Trends & Benchmarks",
        slug: "b2b-saas-marketing-2024",
        abstract:
            "A comprehensive analysis of B2B SaaS marketing patterns, budget allocations, and ROI benchmarks across 200+ companies in the South Asian market.",
        bannerPreview: null,
        content: "<p>Full research content here…</p>",
        author: AUTHORS[0],
        coAuthor: null,
        publishDate: "2024-11-15",
        tags: ["saas", "b2b", "marketing", "2024"],
        readTime: "18 min read",
        pageCount: "42",
        downloadable: true,
        featured: true,
    },
    {
        id: "rh-002",
        category: "Trend Report",
        contentType: "whitepaper",
        title: "LinkedIn Algorithm Decoded: Organic Reach Playbook for 2025",
        slug: "linkedin-algorithm-2025",
        abstract:
            "A data-backed whitepaper dissecting LinkedIn's 2025 algorithm changes and how B2B brands can adapt their content strategy to maintain organic visibility.",
        bannerPreview: null,
        content: "<p>Full research content here…</p>",
        author: AUTHORS[0],
        coAuthor: AUTHORS[1],
        publishDate: "2025-01-08",
        tags: ["linkedin", "algorithm", "organic-reach"],
        readTime: "12 min read",
        pageCount: "28",
        downloadable: true,
        featured: false,
    },
    {
        id: "rh-003",
        category: "Competitive Analysis",
        contentType: "case-analysis",
        title: "Performance Marketing ROI: Paid Ads vs Organic — Who Wins in 2025?",
        slug: "paid-vs-organic-roi-2025",
        abstract:
            "Side-by-side analysis of paid advertising and organic content strategies across 50 B2B campaigns, measuring CAC, LTV, and 12-month ROI.",
        bannerPreview: null,
        content: "<p>Full research content here…</p>",
        author: AUTHORS[1],
        coAuthor: null,
        publishDate: "2025-02-20",
        tags: ["paid-ads", "seo", "roi", "performance"],
        readTime: "22 min read",
        pageCount: "55",
        downloadable: false,
        featured: true,
    },
    {
        id: "rh-004",
        category: "Survey",
        contentType: "dataset",
        title: "Customer Experience in Digital Agencies: 2025 Survey Results",
        slug: "cx-digital-agencies-survey-2025",
        abstract:
            "Raw survey data and analysis from 500+ B2B buyers on what they expect from digital marketing agencies — pricing, communication, and deliverables.",
        bannerPreview: null,
        content: "<p>Full research content here…</p>",
        author: AUTHORS[0],
        coAuthor: null,
        publishDate: "2025-03-05",
        tags: ["cx", "survey", "agencies", "b2b-buyers"],
        readTime: "9 min read",
        pageCount: "18",
        downloadable: true,
        featured: false,
    },
];