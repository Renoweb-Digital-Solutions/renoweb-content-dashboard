"use client";

import { useEffect, useMemo, useState } from "react";

function slugify(value) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function AuthorForm({ initialAuthor = null, onSubmit, onClose, submitLabel = "Save author", disabled = false }) {
    const [name, setName] = useState(initialAuthor?.name || "");
    const [role, setRole] = useState(initialAuthor?.role || "");
    const [bio, setBio] = useState(initialAuthor?.bio || "");
    const [linkedin, setLinkedin] = useState(initialAuthor?.linkedin || "");
    const [x, setX] = useState(initialAuthor?.x || "");
    const [instagram, setInstagram] = useState(initialAuthor?.instagram || "");
    const [profileFile, setProfileFile] = useState(null);
    const [profilePreview, setProfilePreview] = useState(initialAuthor?.imageUrl || null);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const resetForm = () => {
        setName(initialAuthor?.name || "");
        setRole(initialAuthor?.role || "");
        setBio(initialAuthor?.bio || "");
        setLinkedin(initialAuthor?.linkedin || "");
        setX(initialAuthor?.x || "");
        setInstagram(initialAuthor?.instagram || "");
        setProfilePreview(initialAuthor?.imageUrl || null);
        setProfileFile(null);
        setError("");
    };

    useEffect(() => {
        resetForm();
    }, [initialAuthor]);

    const id = useMemo(() => initialAuthor?.id || slugify(name), [initialAuthor?.id, name]);

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setProfileFile(file);
        setProfilePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("Author name is required.");
            return;
        }

        if (!role.trim()) {
            setError("Designation is required.");
            return;
        }

        if (!bio.trim()) {
            setError("Author bio is required.");
            return;
        }

        if (bio.length > 500) {
            setError("Bio cannot exceed 500 characters.");
            return;
        }

        setError("");
        setSubmitting(true);

        try {
            await onSubmit({
                id,
                name: name.trim(),
                role: role.trim(),
                bio: bio.trim(),
                linkedin: linkedin.trim(),
                x: x.trim(),
                instagram: instagram.trim(),
                imageFile: profileFile,
                imageUrl: initialAuthor?.imageUrl || null,
                imagePath: initialAuthor?.imagePath || null,
            });

            if (!initialAuthor) {
                resetForm();
            }
        } catch (err) {
            setError(err?.message || "Failed to save author.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-5 rounded-3xl border border-gray-800 bg-gray-900/80 p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-white">{initialAuthor ? "Edit author" : "Add new author"}</h2>
                    <p className="text-sm text-gray-400">Name, designation, bio, and profile picture.</p>
                </div>
                <div className="text-right text-xs text-gray-500">
                    {bio.length}/500
                </div>
            </div>

            <div className="grid gap-4">
                <label className="block text-xs font-semibold text-gray-300">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="Author full name"
                    disabled={disabled || submitting}
                />
            </div>

            <div className="grid gap-4">
                <label className="block text-xs font-semibold text-gray-300">Designation</label>
                <input
                    type="text"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="Founder, Head of Product, Research Lead"
                    disabled={disabled || submitting}
                />
            </div>

            <div className="grid gap-4">
                <label className="block text-xs font-semibold text-gray-300">Short bio</label>
                <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    className="min-h-[120px] w-full rounded-2xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="Describe the author in 500 characters or fewer."
                    maxLength={500}
                    disabled={disabled || submitting}
                />
            </div>

            <div className="grid gap-4">
                <label className="block text-xs font-semibold text-gray-300">LinkedIn profile (optional)</label>
                <input
                    type="url"
                    value={linkedin}
                    onChange={(event) => setLinkedin(event.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="https://www.linkedin.com/in/username"
                    disabled={disabled || submitting}
                />
            </div>

            <div className="grid gap-4">
                <label className="block text-xs font-semibold text-gray-300">X profile (optional)</label>
                <input
                    type="url"
                    value={x}
                    onChange={(event) => setX(event.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="https://x.com/username"
                    disabled={disabled || submitting}
                />
            </div>

            <div className="grid gap-4">
                <label className="block text-xs font-semibold text-gray-300">Instagram profile (optional)</label>
                <input
                    type="url"
                    value={instagram}
                    onChange={(event) => setInstagram(event.target.value)}
                    className="w-full rounded-2xl border border-gray-800 bg-gray-950/50 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
                    placeholder="https://www.instagram.com/username"
                    disabled={disabled || submitting}
                />
            </div>

            <div className="grid gap-3">
                <label className="block text-xs font-semibold text-gray-300">Profile picture</label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="flex h-16 w-16 items-center justify-center rounded-3xl border border-dashed border-gray-700 bg-gray-950/70 text-xs text-gray-500 hover:border-blue-500 hover:text-blue-300 transition cursor-pointer">
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={disabled || submitting} />
                        Upload
                    </label>
                    <div className="min-h-[64px] min-w-[64px] overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/80">
                        {profilePreview ? (
                            <img src={profilePreview} alt="Preview" className="h-16 w-16 object-cover" />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center text-[10px] text-gray-500">No image</div>
                        )}
                    </div>
                </div>
                <p className="text-[11px] text-gray-500">Profile images are stored in Supabase and referenced by the author record.</p>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={disabled || submitting}
                    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {submitting ? "Saving…" : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={resetForm}
                    disabled={disabled || submitting}
                    className="rounded-2xl border border-gray-800 bg-gray-950/80 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={disabled || submitting}
                    className="text-sm font-semibold text-gray-400 hover:text-gray-200"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
