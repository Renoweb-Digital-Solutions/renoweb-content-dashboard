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

export const PROJECT_CATEGORIES = [
    "Web/software dev",
    "SEO",
    "Branding",
    "Marketing"
];

export const slugify = (s) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const initProjectForm = () => ({
    id: "",
    category: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: AUTHORS[0],
    images: [null, null, null, null, null],
    imageFiles: [null, null, null, null, null],
    imagePreviews: [null, null, null, null, null],
    publishDate: new Date().toISOString().slice(0, 10),
    featured: false,
    schemaStructuredData: "",
    seo: {
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImageFile: null,
        ogImageUrl: "",
    },
});
