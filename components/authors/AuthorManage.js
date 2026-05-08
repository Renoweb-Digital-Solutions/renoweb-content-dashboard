"use client";

import { useState } from "react";
import { deleteAuthor, saveAuthor } from "@/lib/authors";
import { useAuthors } from "./useAuthors";
import AuthorForm from "./AuthorForm";

export default function AuthorManage() {
    const authors = useAuthors();
    const [activeAuthor, setActiveAuthor] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleStartNew = () => {
        setActiveAuthor(null);
        setFeedback("");
    };

    const handleSave = async (authorPayload) => {
        const creatingNew = !activeAuthor;
        setIsSaving(true);
        setFeedback("");

        try {
            const saved = await saveAuthor(authorPayload);
            if (!creatingNew) {
                setActiveAuthor(saved);
            }
            setFeedback("Author saved successfully.");
        } catch (err) {
            setFeedback(err?.message || "Unable to save author.");
            throw err;
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (authorId) => {
        if (!authorId) return;
        if (!window.confirm("Delete this author and remove their profile photo from Supabase?")) {
            return;
        }

        setIsDeleting(true);
        setFeedback("");

        try {
            await deleteAuthor(authorId);
            if (activeAuthor?.id === authorId) {
                setActiveAuthor(null);
            }
            setFeedback("Author deleted successfully.");
        } catch (err) {
            setFeedback(err?.message || "Unable to delete author.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
                    <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-blue-400">Author directory</p>
                        <h2 className="mt-3 text-2xl font-semibold text-white">All authors</h2>
                        <p className="mt-2 text-sm text-gray-400">View author bios, edit profiles, or delete authors from the CMS.</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {authors.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-gray-700 bg-gray-900/60 p-8 text-gray-400">
                            No authors have been added yet. Use the form on the right to create your first author.
                        </div>
                    ) : (
                        authors.map((author) => (
                            <div key={author.id} className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5 transition hover:border-blue-500/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-3xl bg-gray-800">
                                        {author.imageUrl ? (
                                            <img src={author.imageUrl} alt={author.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-lg font-semibold text-gray-500">{author.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-base font-semibold text-white truncate">{author.name}</p>
                                        <p className="mt-1 text-sm text-gray-400 truncate">{author.role}</p>
                                        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{author.bio}</p>
                                    </div>
                                </div>

                                <div className="mt-5 flex flex-wrap gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveAuthor(author)}
                                        className="rounded-2xl border border-gray-800 bg-gray-950/80 px-4 py-2 text-sm font-semibold text-white transition hover:border-blue-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(author.id)}
                                        className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed"
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-5">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-gray-400">{activeAuthor ? "Update author" : "Create author"}</p>
                            <h2 className="mt-2 text-2xl font-semibold text-white">{activeAuthor ? activeAuthor.name : "Author details"}</h2>
                        </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-400">Add and update author records. Profile pictures are uploaded into Supabase and author metadata is stored in Firebase.</p>
                </div>

                <AuthorForm
                    initialAuthor={activeAuthor}
                    onSubmit={handleSave}
                    onClose={handleStartNew}
                    submitLabel={isSaving ? "Saving…" : activeAuthor ? "Update author" : "Create author"}
                    disabled={isSaving}
                />

                {feedback ? (
                    <div className="rounded-3xl border border-gray-800 bg-gray-900/70 p-4 text-sm text-gray-300">{feedback}</div>
                ) : null}
            </div>
        </div>
    );
}
