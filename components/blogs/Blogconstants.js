// components/cms/blog/blogConstants.js
// ─────────────────────────────────────────────────────────────────────────────
// All blog-specific constants and the form initialiser.
// AUTHORS + slugify are duplicated here intentionally so the blog module stays
// self-contained. If you ever centralise them, import from @/components/constants
// and remove these.
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

export const BLOG_CATEGORIES = [
    "Marketing",
    "Growth",
    "SEO",
    "LinkedIn",
    "Paid Ads",
    "Strategy",
    "Dev",
    "AI Tools",
];

export const slugify = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const initBlogForm = () => ({
    id: "",
    category: "",
    title: "",
    slug: "",
    excerpt: "",
    bannerFile: null,
    bannerPreview: null,
    content: "",
    author: AUTHORS[0],
    coAuthor: null,
    publishDate: new Date().toISOString().slice(0, 10),
    tags: [],
    readTime: "",
    schemaStructuredData: "",
});
