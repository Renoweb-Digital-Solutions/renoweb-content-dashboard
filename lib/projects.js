"use client";

import { get, onValue, ref as dbRef, remove, set } from "firebase/database";

import { initProjectForm, slugify } from "@/components/projects/ProjectsConstants";
import { rtdb } from "@/lib/firebase";
import { uploadFile } from "@/lib/cloudinary";
import { deleteCloudinaryFiles } from "@/app/actions/cloudinary";

// ── Helpers ──────────────────────────────────────────────────────────────────



// ── Entry → Form Mapper ─────────────────────────────────────────────────────

export function projectEntryToForm(entry) {
    const base = initProjectForm();

    const normalizedImages = Array(5).fill(null);
    if (entry.images && Array.isArray(entry.images)) {
        for (let i = 0; i < 5; i++) {
            if (entry.images[i]) normalizedImages[i] = entry.images[i];
        }
    }

    return {
        ...base,
        ...entry,
        id: entry.id || "",
        category: entry.category || "",
        title: entry.title || "",
        slug: entry.slug || entry.id || "",
        excerpt: entry.excerpt || "",
        content: entry.content || "",
        author: entry.author || base.author || null,
        images: normalizedImages,
        imageFiles: [null, null, null, null, null],
        imagePreviews: [...normalizedImages],
        publishDate: entry.publishDate || "",
        featured: Boolean(entry.featured),
        schemaStructuredData: entry.schemaStructuredData || "",
        seo: entry.seo || base.seo,
        createdAt: entry.createdAt || "",
        updatedAt: entry.updatedAt || "",
    };
}

// ── Validation ───────────────────────────────────────────────────────────────

export function validateProjectForm(form) {
    let imageCount = 0;
    for(let i = 0; i < 5; i++) {
        if(form.images[i] || form.imageFiles[i]) {
            imageCount++;
        }
    }

    const requiredChecks = [
        form.category,
        form.title,
        form.excerpt,
        form.content && form.content.replace(/<[^>]*>/g, "").trim().length > 10,
        form.publishDate,
        imageCount >= 2,
    ];

    if (requiredChecks.some((value) => !value)) {
        if (imageCount < 2) {
            return "Please upload at least 2 gallery images.";
        }
        return "Please complete all required fields before publishing.";
    }

    return null;
}

// ── Get by ID ────────────────────────────────────────────────────────────────

export async function getProjectBySlug(moduleId, slug) {
    const snapshot = await get(dbRef(rtdb, `${moduleId}/projects/${slug}`));
    return snapshot.exists() ? snapshot.val() : null;
}

// ── Save / Update ────────────────────────────────────────────────────────────

export async function saveProject(moduleId, form, options = {}) {
    const {
        originalSlug = null,
        confirmOverwrite,
    } = options;

    const validationError = validateProjectForm(form);
    if (validationError) {
        return { error: validationError };
    }

    const targetSlug = form.slug || slugify(form.title);

    if (!targetSlug) {
        throw new Error("Title required to generate slug.");
    }

    const existing = await getProjectBySlug(moduleId, targetSlug);
    const isSameEntry = existing && originalSlug && originalSlug === targetSlug;

    if (existing && !isSameEntry && confirmOverwrite) {
        const shouldOverwrite = await confirmOverwrite(existing);
        if (!shouldOverwrite) {
            return { cancelled: true };
        }
    }

    // ── Image upload → Cloudinary ─────────────────────────────────────────────
    let uploadedImages = [...form.images];
    
    for (let i = 0; i < 5; i++) {
        if (form.imageFiles[i]) {
            const file = form.imageFiles[i];
            const ext = file.name.split(".").pop();
            const fileName = `project-gallery/${moduleId}/${targetSlug}-${i}-${Date.now()}.${ext}`;
            const url = await uploadFile(fileName, file);
            uploadedImages[i] = url;
        }
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
            const fileName = `project-images/${moduleId}/${targetSlug}/${Date.now()}-${Math.floor(Math.random() * 1000)}.${ext}`;
            const uploadedUrl = await uploadFile(fileName, blob);

            // Replace blob URL with Cloudinary URL in HTML
            finalContent = finalContent.replace(blobUrl, uploadedUrl);
        } catch (err) {
            console.error("Failed to upload inline image:", err);
        }
    }

    // 2. Diff and delete orphaned images from Cloudinary
    if (originalSlug) {
        const originalEntry = originalSlug === targetSlug ? existing : await getProjectBySlug(moduleId, originalSlug);

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
        title: form.title,
        slug: targetSlug,
        excerpt: form.excerpt,
        content: finalContent,
        author: form.author || null,
        images: uploadedImages,
        publishDate: form.publishDate,
        featured: Boolean(form.featured),
        schemaStructuredData: form.schemaStructuredData || "",
        seo,
        createdAt: form.createdAt || existing?.createdAt || now,
        updatedAt: now,
    };

    // ── Save to Firebase RTDB ────────────────────────────────────────────────
    await set(dbRef(rtdb, `${moduleId}/projects/${targetSlug}`), payload);

    // ── If slug changed during update, remove old entry ──────────────────────
    if (originalSlug && originalSlug !== targetSlug) {
        await remove(dbRef(rtdb, `${moduleId}/projects/${originalSlug}`));
    }

    return { cancelled: false, payload };
}

// ── Delete ───────────────────────────────────────────────────────────────────

export async function deleteProject(moduleId, slug) {
    // 1. Fetch the entry to get the content and gallery URLs
    const entry = await getProjectBySlug(moduleId, slug);

    if (entry) {
        const urlsToDelete = [];

        // Extract gallery images
        if (entry.images && Array.isArray(entry.images)) {
            for (let i = 0; i < entry.images.length; i++) {
                if (entry.images[i] && entry.images[i].includes("res.cloudinary.com")) {
                    urlsToDelete.push(entry.images[i]);
                }
            }
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
    await remove(dbRef(rtdb, `${moduleId}/projects/${slug}`));
}

// ── Real-time Subscription ───────────────────────────────────────────────────

export function subscribeToProjectEntries(moduleId, onEntries, onError) {
    return onValue(
        dbRef(rtdb, `${moduleId}/projects`),
        (snapshot) => {
            const value = snapshot.val() || {};
            const entries = Object.values(value)
                .filter((entry) => entry?.id)
                .map(projectEntryToForm)
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
