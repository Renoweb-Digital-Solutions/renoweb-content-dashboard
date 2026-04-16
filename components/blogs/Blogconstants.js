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
});

export const DUMMY_BLOGS = [
    {
        id: "b2b-linkedin-content-engine",
        category: "LinkedIn",
        title: "How We Built a B2B LinkedIn Content Engine That Compounded Every Week",
        slug: "b2b-linkedin-content-engine",
        excerpt: "A behind-the-scenes breakdown of the editorial system, repurposing workflow, and signal tracking that helped a B2B brand grow inbound demand on LinkedIn.",
        bannerPreview: null,
        content: "<p>Long-form blog content goes here.</p>",
        author: AUTHORS[0],
        coAuthor: AUTHORS[1],
        publishDate: "2026-02-14",
        tags: ["linkedin", "content-strategy", "b2b"],
        readTime: "8 min read",
        featured: true,
    },
    {
        id: "seo-content-refresh-playbook",
        category: "SEO",
        title: "The SEO Content Refresh Playbook for Underperforming Service Pages",
        slug: "seo-content-refresh-playbook",
        excerpt: "A practical framework for identifying decaying pages, rewriting intent-mismatched sections, and improving rankings without publishing net-new content.",
        bannerPreview: null,
        content: "<p>Long-form blog content goes here.</p>",
        author: AUTHORS[1],
        coAuthor: null,
        publishDate: "2026-01-29",
        tags: ["seo", "content-audit", "organic-growth"],
        readTime: "6 min read",
        featured: false,
    },
    {
        id: "ai-tools-for-cms-teams",
        category: "AI Tools",
        title: "AI Tools We Actually Use in Content Operations Without Losing Editorial Control",
        slug: "ai-tools-for-cms-teams",
        excerpt: "A grounded look at where AI helps content teams move faster, where it creates risk, and the review checkpoints we keep human-led.",
        bannerPreview: null,
        content: "<p>Long-form blog content goes here.</p>",
        author: AUTHORS[0],
        coAuthor: null,
        publishDate: "2026-03-08",
        tags: ["ai", "workflow", "editorial-ops"],
        readTime: "7 min read",
        featured: true,
    },
];
