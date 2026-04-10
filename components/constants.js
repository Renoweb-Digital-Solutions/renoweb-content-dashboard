export const AUTHORS = [
    {
        id: "gourab",
        name: "Gourab Majumder",
        role: "Founder & CEO, Renoweb Digital Solutions",
        bio: "Gourab Majumder is a B2B consultant, business mentor specializing in SaaS growth, content strategy, CX, and data-driven innovation.",
        image: null,
        social: {
            linkedin: "https://www.linkedin.com/in/gourabmajumderofficial-marketingmaestro/",
            email: "gourab@renoweb.com",
        },
    },
    {
        id: "sarah",
        name: "Sarah Chen",
        role: "Head of Growth, Renoweb Digital Solutions",
        bio: "Sarah specializes in performance marketing, paid acquisition, and data-driven growth strategies.",
        image: null,
        social: { linkedin: "", email: "sarah@renoweb.com" },
    },
    {
        id: "arjun",
        name: "Arjun Sharma",
        role: "SEO & Content Lead, Renoweb Digital Solutions",
        bio: "Arjun drives organic growth through technical SEO, content frameworks, and conversion-focused copywriting.",
        image: null,
        social: { linkedin: "", email: "arjun@renoweb.com" },
    },
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
});