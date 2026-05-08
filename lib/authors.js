import { get, onValue, ref as dbRef, remove, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";

const BUCKET = "contentimages";

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function toAuthor(id, payload) {
    return {
        id,
        name: payload.name || "",
        role: payload.role || "",
        bio: payload.bio || "",
        linkedin: payload.linkedin || "",
        x: payload.x || "",
        instagram: payload.instagram || "",
        imageUrl: payload.imageUrl || null,
        imagePath: payload.imagePath || null,
        createdAt: payload.createdAt || "",
        updatedAt: payload.updatedAt || "",
    };
}

export async function getAuthorById(authorId) {
    if (!authorId) return null;
    const snapshot = await get(dbRef(rtdb, `authors/${authorId}`));
    if (!snapshot.exists()) return null;
    return toAuthor(authorId, snapshot.val());
}

export async function getAuthorsOnce() {
    const snapshot = await get(dbRef(rtdb, "authors"));
    const data = snapshot.val() || {};
    return Object.entries(data)
        .map(([id, author]) => toAuthor(id, author))
        .sort((a, b) => a.name.localeCompare(b.name));
}

export function subscribeToAuthors(onAuthors, onError) {
    return onValue(
        dbRef(rtdb, "authors"),
        (snapshot) => {
            const data = snapshot.val() || {};
            const authors = Object.entries(data)
                .map(([id, author]) => toAuthor(id, author))
                .sort((a, b) => a.name.localeCompare(b.name));
            onAuthors(authors);
        },
        (err) => {
            if (onError) onError(err);
        }
    );
}

async function uploadProfileImage(authorId, file) {
    if (!file || !authorId) return null;
    const ext = file.name.split(".").pop();
    const filePath = `authorimages/${authorId}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: true });

    if (error) {
        throw error;
    }

    return {
        imagePath: filePath,
        imageUrl: supabase.storage.from(BUCKET).getPublicUrl(filePath).data?.publicUrl || null,
    };
}

async function deleteProfileImagePath(path) {
    if (!path) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
        console.error("Failed to delete author profile image:", error);
    }
}

export async function saveAuthor(author) {
    if (!author?.name) {
        throw new Error("Author name is required.");
    }

    const id = author.id ? author.id : slugify(author.name);
    if (!id) {
        throw new Error("Author ID could not be generated from the name.");
    }

    const existing = await getAuthorById(id);
    const payload = {
        name: author.name.trim(),
        role: author.role.trim(),
        bio: author.bio.trim().slice(0, 500),
        linkedin: author.linkedin?.trim() || existing?.linkedin || "",
        x: author.x?.trim() || existing?.x || "",
        instagram: author.instagram?.trim() || existing?.instagram || "",
        imageUrl: existing?.imageUrl || null,
        imagePath: existing?.imagePath || null,
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    if (author.imageFile) {
        const uploaded = await uploadProfileImage(id, author.imageFile);
        payload.imageUrl = uploaded.imageUrl;
        payload.imagePath = uploaded.imagePath;

        if (existing?.imagePath && existing.imagePath !== uploaded.imagePath) {
            await deleteProfileImagePath(existing.imagePath);
        }
    }

    await set(dbRef(rtdb, `authors/${id}`), payload);
    return toAuthor(id, payload);
}

export async function deleteAuthor(authorId) {
    if (!authorId) {
        throw new Error("Author ID is required for deletion.");
    }

    const existing = await getAuthorById(authorId);
    if (existing?.imagePath) {
        await deleteProfileImagePath(existing.imagePath);
    }

    await remove(dbRef(rtdb, `authors/${authorId}`));
}
