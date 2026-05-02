"use client";

import { useMemo, useState, useEffect } from "react";

import BlogRichTextEditor from "./Blogrichtexteditor";
import { AUTHORS, BLOG_CATEGORIES, slugify } from "./Blogconstants";
import { subscribeToBlogEntries, deleteBlog, saveBlog } from "@/lib/blogs";
import { useNetwork } from "@/lib/networkContext";


function AuthorAvatar({ name, small = false }) {
    const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

    return (
        <div className={`rounded-full bg-gradient-to-br from-blue-500/30 to-cyan-900/40 border-2 border-gray-800 flex items-center justify-center font-bold text-blue-300 flex-shrink-0 ${small ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-xs"}`}>
            {initials}
        </div>
    );
}

function DeleteConfirmModal({ entry, onCancel, onConfirm }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-black p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Delete Blog Post</h3>
                        <p className="text-xs text-gray-500">This action cannot be undone.</p>
                    </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-400">
                    Are you sure you want to delete <span className="font-semibold text-white">&quot;{entry.title}&quot;</span>?
                </p>

                <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

function UpdateModal({ entry, onClose, onSave, saving }) {
    const [form, setForm] = useState({
        ...entry,
        content: entry.content || "",
        tags: [...(entry.tags || [])],
    });
    const [tagInput, setTagInput] = useState("");

    const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));

    const handleTitleBlur = () => {
        if (form.title && form.slug === slugify(entry.title)) {
            updateField("slug", slugify(form.title));
        }
    };

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (!tag || form.tags.includes(tag)) {
            setTagInput("");
            return;
        }

        updateField("tags", [...form.tags, tag]);
        setTagInput("");
    };

    const removeTag = (tag) => updateField("tags", form.tags.filter((item) => item !== tag));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
            <div className="my-4 w-full max-w-4xl rounded-2xl border border-gray-800 bg-black shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-500/25 bg-blue-500/15">
                            <svg className="h-4 w-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Update Blog Post</h3>
                            <p className="max-w-xs truncate font-mono text-[10px] text-gray-500">{entry.slug}</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-1 text-gray-600 transition hover:text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="max-h-[70vh] space-y-5 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-400">Category</label>
                            <select
                                value={form.category}
                                onChange={(event) => updateField("category", event.target.value)}
                                className="w-full appearance-none rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                            >
                                <option value="">Select...</option>
                                {BLOG_CATEGORIES.map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-gray-400">Publish Date</label>
                            <input
                                type="date"
                                value={form.publishDate}
                                onChange={(event) => updateField("publishDate", event.target.value)}
                                className="w-full rounded-lg border border-gray-800 bg-gray-950 px-3 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                            />
                        </div>
                    </div>

                    <div onBlur={handleTitleBlur}>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">Title</label>
                        <input
                            value={form.title}
                            onChange={(event) => updateField("title", event.target.value)}
                            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">Slug</label>
                        <input
                            value={form.slug}
                            onChange={(event) => updateField("slug", event.target.value)}
                            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 font-mono text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">Excerpt</label>
                        <textarea
                            rows={4}
                            value={form.excerpt}
                            onChange={(event) => updateField("excerpt", event.target.value)}
                            className="w-full resize-none rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">Main Content</label>
                        <BlogRichTextEditor
                            value={form.content}
                            onChange={(value) => updateField("content", value)}
                            slug={form.slug || entry.slug}
                        />
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">Read Time</label>
                        <input
                            value={form.readTime}
                            onChange={(event) => updateField("readTime", event.target.value)}
                            className="w-full rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-medium text-gray-400">Primary Author</label>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {AUTHORS.map((author) => (
                                <button
                                    key={author.id}
                                    onClick={() => updateField("author", author)}
                                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${form.author?.id === author.id ? "border-blue-500/50 bg-blue-500/10" : "border-gray-800 bg-gray-900/50 hover:border-gray-700"}`}
                                >
                                    <AuthorAvatar name={author.name} small />
                                    <div>
                                        <p className="text-xs font-semibold text-white">{author.name}</p>
                                        <p className="text-[10px] text-gray-500">{author.role.split(",")[0]}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-medium text-gray-400">Tags</label>
                        {form.tags.length > 0 && (
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                {form.tags.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[11px] font-medium text-blue-400">
                                        #{tag}
                                        <button onClick={() => removeTag(tag)} className="text-blue-400/70 transition hover:text-red-400">
                                            <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <input
                                value={tagInput}
                                onChange={(event) => setTagInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === ",") {
                                        event.preventDefault();
                                        addTag();
                                    }
                                }}
                                placeholder="Add tag..."
                                className="flex-1 rounded-lg border border-gray-800 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                            />
                            <button onClick={addTag} className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2.5 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20">
                                Add
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => updateField("featured", !form.featured)}
                        className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${form.featured ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300" : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"}`}
                    >
                        <div className={`flex h-4 w-4 items-center justify-center rounded border ${form.featured ? "border-cyan-400 bg-cyan-400" : "border-gray-700"}`}>
                            {form.featured && (
                                <svg className="h-2.5 w-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        Featured Post
                    </button>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-800 px-6 py-4">
                    <button onClick={onClose} className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800">
                        Cancel
                    </button>
                    <button onClick={() => onSave(form)} disabled={saving} className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50">
                        {saving && (
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

function EntryCard({ entry, onDelete, onEdit }) {
    return (
        <div className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-gray-700">
            <div className="relative h-36 bg-gradient-to-br from-blue-950/40 via-gray-900 to-cyan-950/20">
                {entry.bannerPreview ? (
                    <img src={entry.bannerPreview} alt={entry.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="h-8 w-8 text-blue-900/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h8l8 8v8a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                )}

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-blue-500/30 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-blue-300">
                        {entry.category}
                    </span>
                    {entry.featured && (
                        <span className="rounded-full bg-cyan-400 px-2 py-0.5 text-[10px] font-bold text-cyan-950">
                            Featured
                        </span>
                    )}
                </div>

                <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                    <button onClick={() => onEdit(entry)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-black/80 text-gray-400 transition hover:border-blue-500/50 hover:text-blue-400" title="Edit">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onClick={() => onDelete(entry)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-black/80 text-gray-400 transition hover:border-red-500/50 hover:text-red-400" title="Delete">
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4">
                <h3 className="mb-1.5 line-clamp-2 text-sm font-bold leading-snug text-white">{entry.title}</h3>
                <p className="mb-3 line-clamp-3 text-[11px] leading-relaxed text-gray-500">{entry.excerpt}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AuthorAvatar name={entry.author.name} small />
                        <div>
                            <p className="text-[10px] font-semibold text-gray-400">{entry.author.name.split(" ")[0]}</p>
                            <p className="text-[9px] text-gray-600">{entry.publishDate}</p>
                        </div>
                    </div>
                    <span className="text-[10px] text-gray-600">{entry.readTime}</span>
                </div>

                {entry.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1 border-t border-gray-800 pt-3">
                        {entry.tags.slice(0, 4).map((tag) => (
                            <span key={tag} className="rounded bg-gray-800 px-2 py-0.5 text-[9px] text-gray-600">#{tag}</span>
                        ))}
                        {entry.tags.length > 4 && (
                            <span className="rounded bg-gray-800 px-2 py-0.5 text-[9px] text-gray-600">+{entry.tags.length - 4}</span>
                        )}
                    </div>
                )}

                <div className="mt-3 flex gap-2 border-t border-gray-800 pt-3">
                    <button onClick={() => onEdit(entry)} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Update
                    </button>
                    <button onClick={() => onDelete(entry)} className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:border-red-500/40 hover:text-red-400">
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function BlogManage() {
    const { setLoading, setSaved } = useNetwork();
    const [entries, setEntries] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [editEntry, setEditEntry] = useState(null);
    const [deleteEntry, setDeleteEntry] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [saving, setSaving] = useState(false);

    // ── Subscribe to real-time updates ──────────────────────────────────────────
    useEffect(() => {
        const unsubscribe = subscribeToBlogEntries(
            (data) => {
                setEntries(data);
                setLoadingData(false);
            },
            (error) => {
                console.error("Failed to load blogs:", error);
                setLoadingData(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const filteredEntries = useMemo(() => {
        return entries.filter((entry) => {
            const query = search.toLowerCase();
            const matchesSearch = !search
                || entry.title.toLowerCase().includes(query)
                || entry.excerpt.toLowerCase().includes(query);

            const matchesCategory = !category || entry.category === category;
            const matchesFeatured = !featuredOnly || entry.featured;

            return matchesSearch && matchesCategory && matchesFeatured;
        });
    }, [category, entries, featuredOnly, search]);

    const featuredCount = entries.filter((entry) => entry.featured).length;

    const flash = (message) => {
        setSuccessMsg(message);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    const handleSave = async (updatedEntry) => {
        try {
            setSaving(true);
            setLoading(true);
            
            const result = await saveBlog(updatedEntry, {
                originalSlug: editEntry.slug,
                confirmOverwrite: async () =>
                    window.confirm("A blog post with this slug already exists. Overwrite?"),
            });

            if (result?.cancelled) {
                return;
            }

            setEditEntry(null);
            flash("Blog post updated successfully");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to update blog post");
        } finally {
            setSaving(false);
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await deleteBlog(deleteEntry.slug);
            setDeleteEntry(null);
            flash("Blog post deleted");
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (error) {
            console.error(error);
            alert("Failed to delete blog post");
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-gray-800 border-t-blue-500"></div>
                <p className="text-sm font-medium text-gray-500">Loading blog posts...</p>
            </div>
        );
    }

    return (
        <div>
            {successMsg && (
                <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-green-500/40 bg-gray-900 px-5 py-3 shadow-2xl">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                        <svg className="h-3 w-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-white">{successMsg}</span>
                </div>
            )}

            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-white">Manage Blogs</h1>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {entries.length} posts · {featuredCount} featured
                    </p>
                </div>

                <div className="flex gap-2">
                    <span className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                        {entries.length} Total
                    </span>
                    <span className="rounded-lg border border-cyan-500/25 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                        {featuredCount} Featured
                    </span>
                </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
                <div className="relative min-w-48 flex-1">
                    <svg className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search title or excerpt..."
                        className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-gray-200 outline-none transition focus:border-blue-500/60"
                    />
                </div>

                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="appearance-none rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-2.5 text-sm text-gray-400 outline-none transition focus:border-blue-500/60"
                >
                    <option value="">All Categories</option>
                    {BLOG_CATEGORIES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <button
                    onClick={() => setFeaturedOnly((current) => !current)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${featuredOnly ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-300" : "border-gray-800 text-gray-500 hover:border-gray-700"}`}
                >
                    Featured only
                </button>
            </div>

            {(search || category || featuredOnly) && (
                <p className="mb-4 text-xs text-gray-600">
                    Showing {filteredEntries.length} of {entries.length} posts
                    <button
                        onClick={() => {
                            setSearch("");
                            setCategory("");
                            setFeaturedOnly(false);
                        }}
                        className="ml-3 text-blue-400 transition hover:text-blue-300"
                    >
                        Clear filters
                    </button>
                </p>
            )}

            {filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredEntries.map((entry) => (
                        <EntryCard
                            key={entry.id}
                            entry={entry}
                            onDelete={setDeleteEntry}
                            onEdit={setEditEntry}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                        <svg className="h-7 w-7 text-blue-900/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="font-medium text-gray-500">No blog posts found</p>
                    <p className="mt-1 text-xs text-gray-700">Try adjusting your filters.</p>
                </div>
            )}

            {editEntry && (
                <UpdateModal
                    entry={editEntry}
                    onClose={() => setEditEntry(null)}
                    onSave={handleSave}
                    saving={saving}
                />
            )}

            {deleteEntry && (
                <DeleteConfirmModal
                    entry={deleteEntry}
                    onCancel={() => setDeleteEntry(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
