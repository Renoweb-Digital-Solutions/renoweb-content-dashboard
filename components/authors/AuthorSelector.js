"use client";

import { useMemo, useState } from "react";
import { saveAuthor } from "@/lib/authors";
import { useAuthors } from "./useAuthors";
import AuthorForm from "./AuthorForm";

const ACCENTS = {
    blue: {
        border: "border-blue-600/50",
        bg: "bg-blue-600/10",
        text: "text-blue-400",
        selected: "border-blue-600/50 bg-blue-600/10",
        hover: "hover:border-blue-500",
    },
    indigo: {
        border: "border-indigo-600/50",
        bg: "bg-indigo-600/10",
        text: "text-indigo-400",
        selected: "border-indigo-600/50 bg-indigo-600/10",
        hover: "hover:border-indigo-500",
    },
    amber: {
        border: "border-amber-500/50",
        bg: "bg-amber-500/10",
        text: "text-amber-300",
        selected: "border-amber-500/50 bg-amber-500/10",
        hover: "hover:border-amber-400",
    },
};

function AuthorInitials({ name }) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function AuthorCard({ author, selected, onSelect, accent }) {
    const isSelected = selected?.id === author.id;
    const accentStyle = ACCENTS[accent] || ACCENTS.blue;

    return (
        <button
            key={author.id}
            onClick={() => onSelect(author)}
            className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all duration-200 w-full ${isSelected ? accentStyle.selected : `border-gray-800 bg-gray-900/50 ${accentStyle.hover}`}`}
        >
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected ? accentStyle.text : "bg-gray-800 text-gray-400"}`}>
                {author.imageUrl ? (
                    <img src={author.imageUrl} alt={author.name} className="h-full w-full rounded-full object-cover" />
                ) : (
                    <AuthorInitials name={author.name} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{author.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{author.role}</p>
            </div>
            {isSelected && (
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
}

export default function AuthorSelector({
    primaryAuthor,
    coAuthor,
    onPrimaryChange,
    onCoAuthorChange,
    primaryLabel = "Primary Author",
    coLabel = "Co-Author",
    accent = "blue",
}) {
    const authors = useAuthors();
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const authorList = useMemo(() => authors || [], [authors]);

    const handleCreateAuthor = async (authorPayload) => {
        setSaving(true);
        setError("");

        try {
            const saved = await saveAuthor(authorPayload);
            onPrimaryChange(saved);
            setShowModal(false);
        } catch (err) {
            setError(err?.message || "Unable to save author.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-gray-400">Add a new author directly from the selector.</p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-gray-800 bg-gray-900/70 px-4 py-2 text-xs font-semibold text-white transition hover:border-blue-500 hover:text-blue-300"
                >
                    <span className="text-blue-400">+</span>
                    Add author
                </button>
            </div>

            <div className="grid gap-6">
                <div>
                    <p className="block text-xs text-gray-400 mb-2 font-medium">{primaryLabel}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {authorList.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900/50 p-5 text-sm text-gray-500">
                                No authors available yet. Add a new author above.
                            </div>
                        ) : (
                            authorList.map((author) => (
                                <AuthorCard
                                    key={author.id}
                                    author={author}
                                    selected={primaryAuthor}
                                    onSelect={onPrimaryChange}
                                    accent={accent}
                                />
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <p className="block text-xs text-gray-400 font-medium">{coLabel} <span className="text-gray-600">(optional)</span></p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <button
                            type="button"
                            onClick={() => onCoAuthorChange(null)}
                            className={`flex items-center gap-3 p-3 rounded-2xl border w-full text-left transition-all duration-200 ${!coAuthor ? "border-blue-600/50 bg-blue-600/10" : "border-gray-800 bg-gray-900/50 hover:border-gray-600"}`}
                        >
                            <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">—</div>
                            <span className="text-xs text-gray-400">None</span>
                        </button>
                        {authorList.map((author) => (
                            <AuthorCard
                                key={author.id}
                                author={author}
                                selected={coAuthor}
                                onSelect={onCoAuthorChange}
                                accent={accent}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
                    onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
                >
                    <div
                        className="relative w-full max-w-lg flex flex-col"
                        style={{
                            maxHeight: "90vh",
                            borderRadius: "1.5rem",
                            background: "rgba(10, 14, 28, 0.85)",
                            backdropFilter: "blur(20px) saturate(1.4)",
                            border: "1px solid rgba(59, 130, 246, 0.25)",
                            boxShadow: "0 0 0 1px rgba(59,130,246,0.08), 0 32px 64px -16px rgba(0,0,0,0.8), 0 0 80px -20px rgba(59,130,246,0.15)",
                        }}
                    >
                        {/* Glowing top accent line */}
                        <div
                            style={{
                                position: "absolute",
                                top: 0,
                                left: "10%",
                                right: "10%",
                                height: "1px",
                                borderRadius: "100%",
                                background: "linear-gradient(90deg, transparent, rgba(59,130,246,0.7), transparent)",
                            }}
                        />

                        {/* Header */}
                        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4"
                            style={{ borderBottom: "1px solid rgba(59,130,246,0.1)" }}
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <span
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 28,
                                            height: 28,
                                            borderRadius: "0.5rem",
                                            background: "rgba(59,130,246,0.15)",
                                            border: "1px solid rgba(59,130,246,0.25)",
                                        }}
                                    >
                                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" fill="rgba(96,165,250,1)" />
                                        </svg>
                                    </span>
                                    <h2 className="text-base font-semibold text-white">Create author</h2>
                                </div>
                                <p className="mt-1 text-xs text-gray-500 pl-9">Fill in the details to add a new author to the CMS.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    border: "1px solid rgba(75,85,99,0.6)",
                                    background: "rgba(17,24,39,0.8)",
                                    color: "#9ca3af",
                                    cursor: "pointer",
                                    flexShrink: 0,
                                    fontSize: 13,
                                    transition: "all 0.15s",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "rgba(59,130,246,0.5)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.borderColor = "rgba(75,85,99,0.6)"; }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="overflow-y-auto flex-1 px-6 py-5" style={{ overflowY: "auto" }}>
                            <AuthorForm
                                initialAuthor={null}
                                onSubmit={handleCreateAuthor}
                                onClose={() => setShowModal(false)}
                                submitLabel={saving ? "Saving…" : "Create author"}
                                disabled={saving}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
