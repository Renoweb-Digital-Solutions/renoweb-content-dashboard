"use client";

import { get, onValue, ref as dbRef, remove, set } from "firebase/database";

import { AUTHORS, initCaseStudyForm, slugify } from "@/components/constants";
import { rtdb } from "@/lib/firebase";
import { uploadFile } from "@/lib/cloudinary";
import { deleteCloudinaryFiles } from "@/app/actions/cloudinary";



function normalizeAuthor(author) {
    if (!author) return null;
    if (typeof author === "string") {
        return AUTHORS.find((item) => item.id === author) || null;
    }

    if (author.id) {
        return AUTHORS.find((item) => item.id === author.id) || author;
    }

    return AUTHORS.find((item) => item.name === author.name) || author;
}



export function caseStudyEntryToForm(entry) {
    const base = initCaseStudyForm();

    return {
        ...base,
        ...entry,
        id: entry.id || "",
        category: entry.category || "",
        title: entry.title || "",
        about_client: entry.about_client || "",
        challenges: entry.challenges?.length ? [...entry.challenges] : [""],
        solutions: {
            approach: entry.solutions?.approach || "",
            process: entry.solutions?.process?.length ? [...entry.solutions.process] : [""],
        },
        conclusion: entry.conclusion || "",
        takeaway: entry.takeaway || "",
        link: entry.link || "",
        author: normalizeAuthor(entry.author) || base.author,
        coAuthor: normalizeAuthor(entry.coAuthor),
        bannerUrl: entry.bannerUrl || "",
        bannerPreview: entry.bannerUrl || null,
        bannerFile: null,
        uiux_issues: entry.uiux_issues?.length
            ? entry.uiux_issues.map((issue) => ({
                id: issue.id || "",
                title: issue.title || "",
                description: issue.description || "",
                beforeCaption: issue.beforeCaption || "",
                beforeImage: issue.beforeImage || "",
                beforeImageFile: null,
                beforeImagePreview: issue.beforeImage || null,
            }))
            : base.uiux_issues,
        website_issues: entry.website_issues?.length ? [...entry.website_issues] : [],
        results_conclusion: entry.results_conclusion || "",
        beforeAfterShowcase: {
            before: {
                image: entry.beforeAfterShowcase?.before?.image || "",
                imageFile: null,
                imagePreview: entry.beforeAfterShowcase?.before?.image || null,
                caption: entry.beforeAfterShowcase?.before?.caption || "",
            },
            after: {
                image: entry.beforeAfterShowcase?.after?.image || "",
                imageFile: null,
                imagePreview: entry.beforeAfterShowcase?.after?.image || null,
                caption: entry.beforeAfterShowcase?.after?.caption || "",
            },
        },
        featured: Boolean(entry.featured),
        seo: entry.seo || base.seo,
        createdAt: entry.createdAt || "",
        updatedAt: entry.updatedAt || "",
    };
}

export function validateCaseStudyForm(form) {
    const requiredChecks = [
        form.category,
        form.title,
        form.about_client,
        form.challenges.some(Boolean),
        form.solutions?.approach,
        form.solutions?.process?.some(Boolean),
        form.conclusion,
        form.takeaway,
        form.author,
    ];

    if (requiredChecks.some((value) => !value)) {
        return "Please complete all required fields before publishing.";
    }

    if (!form.id) {
        return "Title required to generate slug.";
    }

    return null;
}

export async function getCaseStudyById(moduleId, id) {
    const snapshot = await get(dbRef(rtdb, `${moduleId}/case-studies/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
}

export async function saveCaseStudy(moduleId, form, options = {}) {
    const {
        originalId = null,
        confirmOverwrite,
    } = options;

    const validationError = validateCaseStudyForm(form);
    if (validationError) {
        throw new Error(validationError);
    }

    const targetId = form.id;
    const existing = await getCaseStudyById(moduleId, targetId);
    const isSameEntry = existing && originalId && originalId === targetId;

    if (existing && !isSameEntry && confirmOverwrite) {
        const shouldOverwrite = await confirmOverwrite(existing);
        if (!shouldOverwrite) {
            return { cancelled: true };
        }
    }

    let bannerUrl = form.bannerUrl || "";
    if (form.bannerFile) {
        const fileExt = form.bannerFile.name.split(".").pop();
        bannerUrl = await uploadFile(`case-studies/${moduleId}/${targetId}.${fileExt}`, form.bannerFile);
    }

    const uiuxIssues = await Promise.all(
        (form.uiux_issues || []).map(async (issue) => {
            let beforeImage = issue.beforeImage || "";

            if (issue.beforeImageFile && issue.id) {
                const fileExt = issue.beforeImageFile.name.split(".").pop();
                beforeImage = await uploadFile(`case-studies/${moduleId}/${targetId}_${issue.id}.${fileExt}`, issue.beforeImageFile);
            }

            return {
                id: issue.id || "",
                title: issue.title || "",
                description: issue.description || "",
                beforeCaption: issue.beforeCaption || "",
                beforeImage,
            };
        })
    );

    const showcase = form.beforeAfterShowcase || {};
    let beforeImage = showcase.before?.image || "";
    let afterImage = showcase.after?.image || "";

    if (showcase.before?.imageFile) {
        const ext = showcase.before.imageFile.name.split(".").pop();
        beforeImage = await uploadFile(`case-studies/${moduleId}/${targetId}_before.${ext}`, showcase.before.imageFile);
    }

    if (showcase.after?.imageFile) {
        const ext = showcase.after.imageFile.name.split(".").pop();
        afterImage = await uploadFile(`case-studies/${moduleId}/${targetId}_after.${ext}`, showcase.after.imageFile);
    }

    // ── SEO Image upload → Cloudinary ──────────────────────────────────────────
    let seo = form.seo ? { ...form.seo } : {
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImageUrl: "",
    };

    if (seo.ogImageFile) {
        const ext = seo.ogImageFile.name.split(".").pop();
        seo.ogImageUrl = await uploadFile(`seo-images/${moduleId}/${targetId}-og-${Date.now()}.${ext}`, seo.ogImageFile);
    }
    delete seo.ogImageFile;

    const now = new Date().toISOString();
    const payload = {
        id: targetId,
        category: form.category,
        title: form.title,
        about_client: form.about_client,
        challenges: form.challenges.filter(Boolean),
        solutions: {
            approach: form.solutions.approach,
            process: form.solutions.process.filter(Boolean),
        },
        uiux_issues: uiuxIssues.filter((issue) => issue.title || issue.description || issue.beforeImage),
        website_issues: form.website_issues || [],
        results_conclusion: form.results_conclusion || "",
        beforeAfterShowcase: {
            before: {
                image: beforeImage,
                caption: showcase.before?.caption || "",
            },
            after: {
                image: afterImage,
                caption: showcase.after?.caption || "",
            },
        },
        conclusion: form.conclusion,
        takeaway: form.takeaway,
        link: form.link || `/case-studies/${slugify(form.title || targetId)}`,
        author: form.author,
        coAuthor: form.coAuthor || null,
        bannerUrl,
        featured: Boolean(form.featured),
        seo,
        createdAt: form.createdAt || existing?.createdAt || now,
        updatedAt: now,
    };

    await set(dbRef(rtdb, `${moduleId}/case-studies/${targetId}`), payload);

    if (originalId && originalId !== targetId) {
        await remove(dbRef(rtdb, `${moduleId}/case-studies/${originalId}`));
    }

    return { cancelled: false, payload };
}

export async function deleteCaseStudy(moduleId, id) {
    // 1. Fetch the entry to get the image URLs
    const entrySnapshot = await get(dbRef(rtdb, `${moduleId}/case-studies/${id}`));
    const entry = entrySnapshot.exists() ? entrySnapshot.val() : null;

    if (entry) {
        const urlsToDelete = [];

        // Helper to extract path
        const addPath = (url) => {
            if (url && url.includes("res.cloudinary.com")) {
                if (!urlsToDelete.includes(url)) {
                    urlsToDelete.push(url);
                }
            }
        };

        // Extract banner
        addPath(entry.bannerUrl);

        // Extract UI/UX issues images
        if (entry.uiux_issues && Array.isArray(entry.uiux_issues)) {
            entry.uiux_issues.forEach(issue => {
                addPath(issue.beforeImage);
            });
        }

        // Extract before/after showcase images
        if (entry.beforeAfterShowcase) {
            addPath(entry.beforeAfterShowcase.before?.image);
            addPath(entry.beforeAfterShowcase.after?.image);
        }

        // Extract SEO image
        addPath(entry.seo?.ogImageUrl);

        // 2. Delete all collected paths from Cloudinary
        if (urlsToDelete.length > 0) {
            const { error } = await deleteCloudinaryFiles(urlsToDelete);
            
            if (error) {
                console.error("Failed to delete case study images from Cloudinary:", error);
            }
        }
    }

    // 3. Delete the RTDB entry
    await remove(dbRef(rtdb, `${moduleId}/case-studies/${id}`));
}

export function subscribeToCaseStudies(moduleId, onEntries, onError) {
    return onValue(
        dbRef(rtdb, `${moduleId}/case-studies`),
        (snapshot) => {
            const value = snapshot.val() || {};
            const entries = Object.values(value)
                .filter((entry) => entry?.id)
                .sort((left, right) => {
                    const rightTime = Date.parse(right.updatedAt || right.createdAt || 0);
                    const leftTime = Date.parse(left.updatedAt || left.createdAt || 0);
                    return rightTime - leftTime;
                });
            onEntries(entries);
        },
        onError
    );
}
