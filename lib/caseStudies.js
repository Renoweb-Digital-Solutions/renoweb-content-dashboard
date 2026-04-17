"use client";

import { get, onValue, ref as dbRef, remove, set } from "firebase/database";

import { AUTHORS, initCaseStudyForm, slugify } from "@/components/constants";
import { rtdb } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

export const CASE_STUDY_PATHS = ["case-studies"];

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

function uploadPath(fileName) {
    return supabase.storage.from("contentimages").getPublicUrl(fileName).data.publicUrl;
}

async function uploadFile(fileName, file) {
    const { error } = await supabase.storage
        .from("contentimages")
        .upload(fileName, file, { upsert: true });

    if (error) {
        throw error;
    }

    return uploadPath(fileName);
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

export async function getCaseStudyById(id) {
    const snapshots = await Promise.all(
        CASE_STUDY_PATHS.map((path) => get(dbRef(rtdb, `${path}/${id}`)))
    );

    const existing = snapshots.find((snapshot) => snapshot.exists());
    return existing?.val() || null;
}

export async function saveCaseStudy(form, options = {}) {
    const {
        originalId = null,
        confirmOverwrite,
    } = options;

    const validationError = validateCaseStudyForm(form);
    if (validationError) {
        throw new Error(validationError);
    }

    const targetId = form.id;
    const existing = await getCaseStudyById(targetId);
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
        bannerUrl = await uploadFile(`case-studies/${targetId}.${fileExt}`, form.bannerFile);
    }

    const uiuxIssues = await Promise.all(
        (form.uiux_issues || []).map(async (issue) => {
            let beforeImage = issue.beforeImage || "";

            if (issue.beforeImageFile && issue.id) {
                const fileExt = issue.beforeImageFile.name.split(".").pop();
                beforeImage = await uploadFile(`case-studies/${targetId}_${issue.id}.${fileExt}`, issue.beforeImageFile);
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
        beforeImage = await uploadFile(`case-studies/${targetId}_before.${ext}`, showcase.before.imageFile);
    }

    if (showcase.after?.imageFile) {
        const ext = showcase.after.imageFile.name.split(".").pop();
        afterImage = await uploadFile(`case-studies/${targetId}_after.${ext}`, showcase.after.imageFile);
    }

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
        createdAt: form.createdAt || existing?.createdAt || now,
        updatedAt: now,
    };

    await Promise.all(
        CASE_STUDY_PATHS.map((path) => set(dbRef(rtdb, `${path}/${targetId}`), payload))
    );

    if (originalId && originalId !== targetId) {
        await Promise.all(
            CASE_STUDY_PATHS.map((path) => remove(dbRef(rtdb, `${path}/${originalId}`)))
        );
    }

    return { cancelled: false, payload };
}

export async function deleteCaseStudy(id) {
    await Promise.all(
        CASE_STUDY_PATHS.map((path) => remove(dbRef(rtdb, `${path}/${id}`)))
    );
}

export function subscribeToCaseStudies(onEntries, onError) {
    const state = {};

    const emit = () => {
        const merged = CASE_STUDY_PATHS.reduce((accumulator, path) => {
            const items = state[path] || [];

            items.forEach((entry) => {
                accumulator.set(entry.id, entry);
            });

            return accumulator;
        }, new Map());

        const entries = [...merged.values()].sort((left, right) => {
            const rightTime = Date.parse(right.updatedAt || right.createdAt || 0);
            const leftTime = Date.parse(left.updatedAt || left.createdAt || 0);
            return rightTime - leftTime;
        });

        onEntries(entries);
    };

    const unsubscribers = CASE_STUDY_PATHS.map((path) => onValue(
        dbRef(rtdb, path),
        (snapshot) => {
            const value = snapshot.val() || {};
            state[path] = Object.values(value).filter((entry) => entry?.id);
            emit();
        },
        onError
    ));

    return () => {
        unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
}
