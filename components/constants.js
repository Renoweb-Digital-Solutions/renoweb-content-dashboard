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
});