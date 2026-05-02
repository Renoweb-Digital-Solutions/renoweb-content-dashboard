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