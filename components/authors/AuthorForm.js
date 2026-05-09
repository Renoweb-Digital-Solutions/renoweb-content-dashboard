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
        <div className="space-y-4">
            {/* Name + Designation row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        style={{
                            background: "rgba(15,23,42,0.6)",
                            border: "1px solid rgba(59,130,246,0.15)",
                            borderRadius: "0.75rem",
                            padding: "10px 14px",
                            fontSize: "0.8125rem",
                            color: "#fff",
                            outline: "none",
                            width: "100%",
                            transition: "border-color 0.15s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)")}
                        placeholder="Author full name"
                        disabled={disabled || submitting}
                    />
                </div>
                <div className="grid gap-1.5">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Designation</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(event) => setRole(event.target.value)}
                        style={{
                            background: "rgba(15,23,42,0.6)",
                            border: "1px solid rgba(59,130,246,0.15)",
                            borderRadius: "0.75rem",
                            padding: "10px 14px",
                            fontSize: "0.8125rem",
                            color: "#fff",
                            outline: "none",
                            width: "100%",
                            transition: "border-color 0.15s",
                        }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)")}
                        placeholder="Founder, Research Lead…"
                        disabled={disabled || submitting}
                    />
                </div>
            </div>

            {/* Bio */}
            <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Short bio</label>
                    <span style={{ fontSize: "10px", color: bio.length > 450 ? "#f87171" : "#6b7280" }}>{bio.length}/500</span>
                </div>
                <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    style={{
                        background: "rgba(15,23,42,0.6)",
                        border: "1px solid rgba(59,130,246,0.15)",
                        borderRadius: "0.75rem",
                        padding: "10px 14px",
                        fontSize: "0.8125rem",
                        color: "#fff",
                        outline: "none",
                        width: "100%",
                        minHeight: "80px",
                        resize: "vertical",
                        transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.15)")}
                    placeholder="Describe the author in 500 characters or fewer."
                    maxLength={500}
                    disabled={disabled || submitting}
                />
            </div>

            {/* Social links — 2 columns */}
            <div className="grid gap-1.5">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Social profiles <span style={{ color: "#4b5563", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    {[
                        { val: linkedin, set: setLinkedin, placeholder: "linkedin.com/in/…", icon: "in" },
                        { val: x, set: setX, placeholder: "x.com/username", icon: "𝕏" },
                        { val: instagram, set: setInstagram, placeholder: "instagram.com/…", icon: "ig" },
                    ].map(({ val, set, placeholder, icon }) => (
                        <div key={icon} style={{ position: "relative" }}>
                            <span style={{
                                position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
                                fontSize: 10, fontWeight: 700, color: "rgba(96,165,250,0.7)", pointerEvents: "none", userSelect: "none",
                            }}>{icon}</span>
                            <input
                                type="url"
                                value={val}
                                onChange={(event) => set(event.target.value)}
                                style={{
                                    background: "rgba(15,23,42,0.6)",
                                    border: "1px solid rgba(59,130,246,0.12)",
                                    borderRadius: "0.75rem",
                                    padding: "9px 12px 9px 28px",
                                    fontSize: "0.75rem",
                                    color: "#fff",
                                    outline: "none",
                                    width: "100%",
                                    transition: "border-color 0.15s",
                                }}
                                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.6)")}
                                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(59,130,246,0.12)")}
                                placeholder={placeholder}
                                disabled={disabled || submitting}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Profile picture */}
            <div className="grid gap-2">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400">Profile picture</label>
                <div className="flex items-center gap-3">
                    <label
                        style={{
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            width: 60, height: 60, borderRadius: "50%",
                            border: "1.5px dashed rgba(59,130,246,0.3)",
                            background: "rgba(15,23,42,0.6)",
                            color: "#6b7280", fontSize: 10, cursor: "pointer",
                            transition: "all 0.15s", flexShrink: 0,
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.7)"; e.currentTarget.style.color = "#93c5fd"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"; e.currentTarget.style.color = "#6b7280"; }}
                    >
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={disabled || submitting} />
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ marginBottom: 2 }}>
                            <path d="M4 16l4-4 3 3 4-5 5 6H4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                        </svg>
                        Upload
                    </label>
                    <div style={{
                        width: 60, height: 60, borderRadius: "50%", overflow: "hidden",
                        border: "1.5px solid rgba(59,130,246,0.2)",
                        background: "rgba(15,23,42,0.7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                    }}>
                        {profilePreview ? (
                            <img src={profilePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <span style={{ fontSize: 9, color: "#4b5563" }}>No image</span>
                        )}
                    </div>
                    <p style={{ fontSize: 10, color: "#4b5563", lineHeight: 1.4 }}>
                        Stored in Supabase.<br />JPG, PNG, WebP · max 2 MB.
                    </p>
                </div>
            </div>

            {error ? (
                <div style={{
                    background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "0.75rem", padding: "8px 12px", fontSize: "0.8125rem", color: "#fca5a5",
                }}>
                    {error}
                </div>
            ) : null}

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={disabled || submitting}
                    style={{
                        flex: 1,
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "0.75rem",
                        background: submitting ? "rgba(59,130,246,0.5)" : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                        border: "1px solid rgba(59,130,246,0.4)",
                        boxShadow: "0 4px 14px rgba(59,130,246,0.25)",
                        padding: "10px 16px",
                        fontSize: "0.8125rem", fontWeight: 600, color: "#fff",
                        cursor: disabled || submitting ? "not-allowed" : "pointer",
                        opacity: disabled || submitting ? 0.6 : 1,
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!disabled && !submitting) e.currentTarget.style.boxShadow = "0 4px 20px rgba(59,130,246,0.4)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(59,130,246,0.25)"; }}
                >
                    {submitting ? "Saving…" : submitLabel}
                </button>
                <button
                    type="button"
                    onClick={resetForm}
                    disabled={disabled || submitting}
                    style={{
                        borderRadius: "0.75rem",
                        border: "1px solid rgba(75,85,99,0.5)",
                        background: "rgba(17,24,39,0.7)",
                        padding: "10px 14px",
                        fontSize: "0.8125rem", fontWeight: 500, color: "#9ca3af",
                        cursor: disabled || submitting ? "not-allowed" : "pointer",
                        opacity: disabled || submitting ? 0.5 : 1,
                        transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!disabled && !submitting) { e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)"; e.currentTarget.style.color = "#e5e7eb"; } }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(75,85,99,0.5)"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                    Reset
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={disabled || submitting}
                    style={{
                        borderRadius: "0.75rem",
                        border: "1px solid transparent",
                        background: "transparent",
                        padding: "10px 14px",
                        fontSize: "0.8125rem", fontWeight: 500, color: "#6b7280",
                        cursor: disabled || submitting ? "not-allowed" : "pointer",
                        transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => { if (!disabled && !submitting) e.currentTarget.style.color = "#d1d5db"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

