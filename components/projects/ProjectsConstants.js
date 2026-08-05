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
