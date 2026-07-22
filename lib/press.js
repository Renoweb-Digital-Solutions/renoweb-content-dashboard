"use client";

import { get, onValue, ref as dbRef, remove, set, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

async function uploadFile(fileName, file) {
    const { error } = await supabase.storage
        .from("contentimages")
        .upload(fileName, file, { upsert: true });

    if (error) {
        throw error;
    }

    return supabase.storage.from("contentimages").getPublicUrl(fileName).data.publicUrl;
}

export function validatePressForm(form) {
    if (!form.title) return "Title is required.";
    if (!form.date) return "Date is required.";
    if (!form.link) return "Link is required.";
    if (form.description && form.description.length > 200) return "Description must be within 200 characters.";
    return null;
}

export async function getPressById(id) {
    const snapshot = await get(dbRef(rtdb, `press/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
}

export async function savePress(form, originalId = null) {
    const validationError = validatePressForm(form);
    if (validationError) {
        return { error: validationError };
    }

    const targetId = form.id || originalId || `press-${Date.now()}`;

    let imageUrl = form.imageUrl || "";
    let logoUrl = form.logoUrl || "";

    if (form.imageFile) {
        const ext = form.imageFile.name.split(".").pop();
        imageUrl = await uploadFile(`press-images/${targetId}-main-${Date.now()}.${ext}`, form.imageFile);
    }
    
    if (form.logoFile) {
        const ext = form.logoFile.name.split(".").pop();
        logoUrl = await uploadFile(`press-images/${targetId}-logo-${Date.now()}.${ext}`, form.logoFile);
    }

    const payload = {
        id: targetId,
        title: form.title,
        description: form.description || "",
        date: form.date,
        link: form.link,
        imageUrl,
        logoUrl,
        isFeatured: form.isFeatured || false,
        createdAt: form.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    if (payload.isFeatured) {
        // If this one is featured, un-feature all others
        const snapshot = await get(dbRef(rtdb, "press"));
        if (snapshot.exists()) {
            const updates = {};
            const data = snapshot.val();
            for (const key in data) {
                if (data[key].isFeatured && key !== payload.id) {
                    updates[`press/${key}/isFeatured`] = false;
                }
            }
            if (Object.keys(updates).length > 0) {
                await update(dbRef(rtdb), updates);
            }
        }
    }

    await set(dbRef(rtdb, `press/${payload.id}`), payload);

    if (originalId && originalId !== targetId) {
        await remove(dbRef(rtdb, `press/${originalId}`));
    }

    return { payload };
}

export async function deletePress(id) {
    const entry = await getPressById(id);

    if (entry && entry.imageUrl) {
        const match = entry.imageUrl.match(/\/contentimages\/([^"'\s]+)/);
        if (match && match[1]) {
            const { error } = await supabase.storage
                .from("contentimages")
                .remove([match[1]]);
            if (error) {
                console.error("Failed to delete main image from Supabase:", error);
            }
        }
    }

    if (entry && entry.logoUrl) {
        const match = entry.logoUrl.match(/\/contentimages\/([^"'\s]+)/);
        if (match && match[1]) {
            const { error } = await supabase.storage
                .from("contentimages")
                .remove([match[1]]);
            if (error) {
                console.error("Failed to delete logo image from Supabase:", error);
            }
        }
    }

    await remove(dbRef(rtdb, `press/${id}`));
}

export async function toggleFeaturedPress(id, currentlyFeatured) {
    const updates = {};
    const snapshot = await get(dbRef(rtdb, "press"));
    
    if (snapshot.exists()) {
        const data = snapshot.val();
        for (const key in data) {
            if (data[key].isFeatured && key !== id) {
                updates[`press/${key}/isFeatured`] = false;
            }
        }
    }
    
    // Toggle the targeted one
    updates[`press/${id}/isFeatured`] = !currentlyFeatured;
    
    if (Object.keys(updates).length > 0) {
        await update(dbRef(rtdb), updates);
    }
}

export function subscribeToPressEntries(onEntries, onError) {
    return onValue(
        dbRef(rtdb, "press"),
        (snapshot) => {
            const value = snapshot.val() || {};
            const entries = Object.values(value)
                .filter((entry) => entry?.id)
                .sort((left, right) => {
                    const rightTime = Date.parse(right.date || 0);
                    const leftTime = Date.parse(left.date || 0);
                    return rightTime - leftTime;
                });
            onEntries(entries);
        },
        onError
    );
}
