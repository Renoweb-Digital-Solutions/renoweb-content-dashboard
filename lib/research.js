"use client";

import { get, onValue, ref as dbRef, remove, set } from "firebase/database";

import { AUTHORS, initRHForm, slugify } from "@/components/research/RHconstants";
import { rtdb } from "@/lib/firebase";
import { uploadFile } from "@/lib/cloudinary";
import { deleteCloudinaryFiles } from "@/app/actions/cloudinary";

// ── Helpers ──────────────────────────────────────────────────────────────────

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



// ── Entry → Form Mapper ─────────────────────────────────────────────────────

export function researchEntryToForm(entry) {
    const base = initRHForm();

    return {
        ...base,
        ...entry,
        id: entry.id || "",
        category: entry.category || "",
        contentType: entry.contentType || "",
        title: entry.title || "",
        slug: entry.slug || entry.id || "",
        abstract: entry.abstract || "",
        content: entry.content || "",
        author: normalizeAuthor(entry.author) || base.author,
        coAuthor: normalizeAuthor(entry.coAuthor),
        bannerUrl: entry.bannerUrl || "",
        bannerPreview: entry.bannerUrl || null,
        bannerFile: null,
        publishDate: entry.publishDate || "",
        readTime: entry.readTime || "",
        pageCount: entry.pageCount || "",
        tags: Array.isArray(entry.tags) ? [...entry.tags] : [],
        downloadable: Boolean(entry.downloadable),
        featured: Boolean(entry.featured),
        seo: entry.seo || base.seo,
        createdAt: entry.createdAt || "",
        updatedAt: entry.updatedAt || "",
    };
}

// ── Validation ───────────────────────────────────────────────────────────────

export function validateResearchForm(form) {
    const requiredChecks = [
        form.category,
        form.contentType,
        form.title,
        form.abstract,
        form.content && form.content.replace(/<[^>]*>/g, "").trim().length > 50,
        form.publishDate,
        form.author,
    ];

    if (requiredChecks.some((value) => !value)) {
        return "Please complete all required fields before publishing.";
    }

    return null;
}

// ── Get by ID ────────────────────────────────────────────────────────────────

export async function getResearchBySlug(moduleId, slug) {
    const snapshot = await get(dbRef(rtdb, `${moduleId}/research-hub/${slug}`));
    return snapshot.exists() ? snapshot.val() : null;
}

// ── Save / Update ────────────────────────────────────────────────────────────

export async function saveResearch(moduleId, form, options = {}) {
    const {
        originalSlug = null,
        confirmOverwrite,
    } = options;

    const validationError = validateResearchForm(form);
    if (validationError) {
        throw new Error(validationError);
    }

    const targetSlug = form.slug || slugify(form.title);

    if (!targetSlug) {
        throw new Error("Title required to generate slug.");
    }

    const existing = await getResearchBySlug(moduleId, targetSlug);
    const isSameEntry = existing && originalSlug && originalSlug === targetSlug;

    if (existing && !isSameEntry && confirmOverwrite) {
        const shouldOverwrite = await confirmOverwrite(existing);
        if (!shouldOverwrite) {
            return { cancelled: true };
        }
    }

    // ── Banner upload → Cloudinary ─────────────────────────────────────────────
    let bannerUrl = form.bannerUrl || "";

    if (form.bannerFile) {
        const ext = form.bannerFile.name.split(".").pop();
        bannerUrl = await uploadFile(`research-hub-banners/${moduleId}/${targetSlug}.${ext}`, form.bannerFile);
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
        seo.ogImageUrl = await uploadFile(`seo-images/${moduleId}/${targetSlug}-og-${Date.now()}.${ext}`, seo.ogImageFile);
    }
    delete seo.ogImageFile;

    // ── Parse and sync Rich Text Content Images ──────────────────────────────
    let finalContent = form.content || "";
    
    // 1. Find all blob: URLs (newly inserted images)
    const blobRegex = /src="(blob:https?:\/\/[^"]+)"/g;
    const blobMatches = [...finalContent.matchAll(blobRegex)];
    
    for (const match of blobMatches) {
        const blobUrl = match[1];
        try {
            // Fetch blob from browser memory
            const res = await fetch(blobUrl);
            const blob = await res.blob();
            
            // Upload to Cloudinary
            const ext = blob.type.split('/')[1] || 'png';
            const fileName = `research-hub-images/${moduleId}/${targetSlug}/${Date.now()}-${Math.floor(Math.random()*1000)}.${ext}`;
            const uploadedUrl = await uploadFile(fileName, blob);
            
            // Replace blob URL with Cloudinary URL in HTML
            finalContent = finalContent.replace(blobUrl, uploadedUrl);
        } catch (err) {
            console.error("Failed to upload inline image:", err);
        }
    }

    // 2. Diff and delete orphaned images from Cloudinary
    if (originalSlug) {
        const originalEntry = originalSlug === targetSlug ? existing : await getResearchBySlug(moduleId, originalSlug);
        
        if (originalEntry && originalEntry.content) {
            const getCloudinaryPaths = (html) => {
                const urlRegex = /https:\/\/res\.cloudinary\.com\/[^"'\s>]+/g;
                return [...html.matchAll(urlRegex)].map(m => m[0]);
            };

            const oldPaths = getCloudinaryPaths(originalEntry.content);
            const newPaths = getCloudinaryPaths(finalContent);

            const orphanedPaths = oldPaths.filter(p => !newPaths.includes(p));

            if (orphanedPaths.length > 0) {
                const { error } = await deleteCloudinaryFiles(orphanedPaths);
                if (error) console.error("Failed to delete orphaned images:", error);
            }
        }
    }

    // ── Build payload ────────────────────────────────────────────────────────
    const now = new Date().toISOString();
    const payload = {
        id: targetSlug,
        category: form.category,
        contentType: form.contentType,
        title: form.title,
        slug: targetSlug,
        abstract: form.abstract,
        content: finalContent,
        author: form.author,
        coAuthor: form.coAuthor || null,
        bannerUrl,
        publishDate: form.publishDate,
        readTime: form.readTime || `${Math.max(1, Math.ceil(
            (form.content.replace(/<[^>]*>/g, "").trim().split(/\s+/).filter(Boolean).length) / 200
        ))} min read`,
        pageCount: form.pageCount || "",
        tags: (form.tags || []).filter(Boolean),
        downloadable: Boolean(form.downloadable),
        featured: Boolean(form.featured),
        seo,
        createdAt: form.createdAt || existing?.createdAt || now,
        updatedAt: now,
    };

    // ── Save to Firebase RTDB ────────────────────────────────────────────────
    await set(dbRef(rtdb, `${moduleId}/research-hub/${targetSlug}`), payload);

    // ── If slug changed during update, remove old entry ──────────────────────
    if (originalSlug && originalSlug !== targetSlug) {
        await remove(dbRef(rtdb, `${moduleId}/research-hub/${originalSlug}`));
    }

    return { cancelled: false, payload };
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteResearch(moduleId, slug) {
    // 1. Fetch the entry to get the content and banner URL
    const entry = await getResearchBySlug(moduleId, slug);
    
    if (entry) {
        const urlsToDelete = [];

        // Extract banner path from bannerUrl
        if (entry.bannerUrl && entry.bannerUrl.includes("res.cloudinary.com")) {
            urlsToDelete.push(entry.bannerUrl);
        }

        // Extract SEO image path
        if (entry.seo?.ogImageUrl && entry.seo.ogImageUrl.includes("res.cloudinary.com")) {
            if (!urlsToDelete.includes(entry.seo.ogImageUrl)) {
                urlsToDelete.push(entry.seo.ogImageUrl);
            }
        }

        // Extract inline image paths from rich text content
        if (entry.content) {
            const urlRegex = /https:\/\/res\.cloudinary\.com\/[^"'\s>]+/g;
            const matches = [...entry.content.matchAll(urlRegex)];
            for (const match of matches) {
                if (match[0] && !urlsToDelete.includes(match[0])) {
                    urlsToDelete.push(match[0]);
                }
            }
        }

        // 2. Delete all collected paths from Cloudinary
        if (urlsToDelete.length > 0) {
            const { error } = await deleteCloudinaryFiles(urlsToDelete);
            
            if (error) {
                console.error("Failed to delete images from Cloudinary:", error);
            }
        }
    }

    // 3. Delete the RTDB entry
    await remove(dbRef(rtdb, `${moduleId}/research-hub/${slug}`));
}

// ── Real-time Subscription ───────────────────────────────────────────────────

export function subscribeToResearchEntries(moduleId, onEntries, onError) {
    return onValue(
        dbRef(rtdb, `${moduleId}/research-hub`),
        (snapshot) => {
            const value = snapshot.val() || {};
            const entries = Object.values(value)
                .filter((entry) => entry?.id)
                .map(researchEntryToForm)
                .sort((left, right) => {
                    const rightTime = Date.parse(right.updatedAt || right.createdAt || right.publishDate || 0);
                    const leftTime = Date.parse(left.updatedAt || left.createdAt || left.publishDate || 0);
                    return rightTime - leftTime;
                });

            onEntries(entries);
        },
        onError
    );
}
