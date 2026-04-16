"use client";

// components/cms/research-hub/RHmanage.js
// ─────────────────────────────────────────────────────────────────────────────
// "Manage Research Hub" page — lists all research hub entries from dummy data.
// Supports:
//   • Search / filter by category, content type, featured flag
//   • Delete with confirmation
//   • Update via a rich modal (all fields editable inline)
// Amber/orange accent throughout. Uses dummy JSON from RHconstants.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useMemo } from "react";
import RHRichTextEditor from "./RHrichtexteditor";
import { DUMMY_RESEARCH_HUBS, RH_CATEGORIES, RH_CONTENT_TYPES, AUTHORS, slugify } from "./RHconstants";

// ── Helpers ───────────────────────────────────────────────────────────────────

const CONTENT_TYPE_LABELS = {
    report: "Research Report",
    whitepaper: "Whitepaper",
    infographic: "Infographic",
    dataset: "Dataset",
    "case-analysis": "Case Analysis",
};

function AuthorAvatar({ name, small = false }) {
    const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
    return (
        <div className={`rounded-full bg-gradient-to-br from-amber-500/30 to-orange-900/40 border-2 border-gray-800 flex items-center justify-center font-bold text-amber-400 flex-shrink-0 ${small ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-xs"}`}>
            {initials}
        </div>
    );
}

// ── Delete Confirm Modal ──────────────────────────────────────────────────────

function DeleteConfirmModal({ entry, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-white">Delete Research Entry</h3>
                        <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone</p>
                    </div>
                </div>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    Are you sure you want to delete <span className="text-white font-semibold">&quot;{entry.title}&quot;</span>? This will permanently remove the entry and its associated files.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 bg-gray-900 text-gray-300 text-sm rounded-xl border border-gray-800 hover:bg-gray-800 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-xl font-bold transition"
                    >
                        Delete Entry
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Update Modal ──────────────────────────────────────────────────────────────

function UpdateModal({ entry, onSave, onClose }) {
    const [form, setForm] = useState({ ...entry, content: entry.content || "" });
    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleTitleBlur = () => {
        if (form.title && form.slug === slugify(entry.title)) {
            set("slug", slugify(form.title));
        }
    };

    const [tagInput, setTagInput] = useState("");
    const addTag = () => {
        const t = tagInput.trim().toLowerCase();
        if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
        setTagInput("");
    };
    const removeTag = (t) => set("tags", form.tags.filter((x) => x !== t));

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-4xl shadow-2xl my-4">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Update Research Entry</h3>
                            <p className="text-[10px] text-gray-500 mt-0.5 font-mono truncate max-w-xs">{entry.slug}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-white transition p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">

                    {/* Category + Content Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => set("category", e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none transition appearance-none"
                            >
                                <option value="">Select…</option>
                                {RH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Content Type</label>
                            <select
                                value={form.contentType}
                                onChange={(e) => set("contentType", e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none transition appearance-none"
                            >
                                <option value="">Select…</option>
                                {RH_CONTENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Title */}
                    <div onBlur={handleTitleBlur}>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Title</label>
                        <input
                            value={form.title}
                            onChange={(e) => set("title", e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Slug / ID</label>
                        <input
                            value={form.slug}
                            onChange={(e) => set("slug", e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 font-mono placeholder-gray-600 outline-none transition"
                        />
                    </div>

                    {/* Abstract */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Abstract</label>
                        <textarea
                            rows={3}
                            value={form.abstract}
                            onChange={(e) => set("abstract", e.target.value)}
                            className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Main Content</label>
                        <RHRichTextEditor
                            value={form.content}
                            onChange={(value) => set("content", value)}
                            slug={form.slug || entry.slug}
                        />
                    </div>

                    {/* Publish Date + Read Time + Page Count */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Publish Date</label>
                            <input
                                type="date"
                                value={form.publishDate}
                                onChange={(e) => set("publishDate", e.target.value)}
                                className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-3 py-2.5 text-sm text-gray-200 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Read Time</label>
                            <input
                                value={form.readTime}
                                onChange={(e) => set("readTime", e.target.value)}
                                placeholder="18 min read"
                                className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Pages</label>
                            <input
                                value={form.pageCount}
                                onChange={(e) => set("pageCount", e.target.value)}
                                placeholder="42"
                                className="w-full bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Tags</label>
                        {form.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {form.tags.map((t) => (
                                    <span key={t} className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[11px] font-medium">
                                        #{t}
                                        <button onClick={() => removeTag(t)} className="text-amber-400/60 hover:text-red-400 transition">
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                                placeholder="Add keyword…"
                                className="flex-1 bg-gray-950 border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                            />
                            <button onClick={addTag} className="px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition">Add</button>
                        </div>
                    </div>

                    {/* Authors */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-2 font-medium">Primary Author</label>
                        <div className="grid grid-cols-2 gap-2">
                            {AUTHORS.map((a) => (
                                <button
                                    key={a.id}
                                    onClick={() => set("author", a)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${form.author?.id === a.id ? "border-amber-500/50 bg-amber-500/10" : "border-gray-800 bg-gray-900/50 hover:border-gray-700"}`}
                                >
                                    <AuthorAvatar name={a.name} small />
                                    <div>
                                        <p className="text-xs font-semibold text-white">{a.name}</p>
                                        <p className="text-[10px] text-gray-500">{a.role.split(",")[0]}</p>
                                    </div>
                                    {form.author?.id === a.id && <svg className="w-4 h-4 text-amber-400 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-3 pt-1">
                        <button
                            onClick={() => set("downloadable", !form.downloadable)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.downloadable ? "border-amber-500/50 bg-amber-500/10 text-amber-400" : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"}`}
                        >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${form.downloadable ? "border-amber-500 bg-amber-500" : "border-gray-700"}`}>
                                {form.downloadable && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            Downloadable PDF
                        </button>
                        <button
                            onClick={() => set("featured", !form.featured)}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.featured ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"}`}
                        >
                            <div className={`w-4 h-4 rounded flex items-center justify-center border ${form.featured ? "border-yellow-500 bg-yellow-500" : "border-gray-700"}`}>
                                {form.featured && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                            </div>
                            ★ Featured
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-5 border-t border-gray-800">
                    <button
                        onClick={() => onSave(form)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition shadow-lg shadow-amber-600/20"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Save Changes
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-3 bg-gray-900 text-gray-300 text-sm rounded-xl border border-gray-800 hover:bg-gray-800 transition font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Entry Card ────────────────────────────────────────────────────────────────

function EntryCard({ entry, onEdit, onDelete }) {
    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition group">
            {/* Banner or placeholder */}
            <div className="h-36 bg-gradient-to-br from-amber-900/20 via-gray-900 to-orange-900/10 relative">
                {entry.bannerPreview ? (
                    <img src={entry.bannerPreview} alt={entry.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-900/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                )}
                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {entry.featured && (
                        <span className="px-2 py-0.5 bg-yellow-500/90 text-yellow-950 rounded-md text-[10px] font-bold">★ Featured</span>
                    )}
                    {entry.downloadable && (
                        <span className="px-2 py-0.5 bg-black/70 text-amber-400 rounded-md text-[10px] font-medium border border-amber-500/30">↓ PDF</span>
                    )}
                </div>
                {/* Action buttons — appear on hover */}
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition">
                    <button
                        onClick={() => onEdit(entry)}
                        className="w-8 h-8 rounded-lg bg-black/80 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-amber-400 hover:border-amber-500/50 transition"
                        title="Edit"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(entry)}
                        className="w-8 h-8 rounded-lg bg-black/80 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/50 transition"
                        title="Delete"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4">
                {/* Type badges */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                    <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 rounded-full text-[10px] font-medium border border-amber-500/25">
                        {entry.category}
                    </span>
                    {entry.contentType && (
                        <span className="px-2 py-0.5 bg-orange-500/10 text-orange-400 rounded-full text-[10px] border border-orange-500/20">
                            {CONTENT_TYPE_LABELS[entry.contentType] || entry.contentType}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-1.5 line-clamp-2">{entry.title}</h3>

                {/* Abstract */}
                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-3">{entry.abstract}</p>

                {/* Meta */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <AuthorAvatar name={entry.author.name} small />
                        <div>
                            <p className="text-[10px] font-semibold text-gray-400">{entry.author.name.split(" ")[0]}</p>
                            <p className="text-[9px] text-gray-600">{entry.publishDate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-600">
                        {entry.pageCount && <span>{entry.pageCount}p</span>}
                        {entry.readTime && <span>· {entry.readTime}</span>}
                    </div>
                </div>

                {/* Tags */}
                {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-800">
                        {entry.tags.slice(0, 4).map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-gray-800 text-gray-600 rounded text-[9px]">#{t}</span>
                        ))}
                        {entry.tags.length > 4 && (
                            <span className="px-2 py-0.5 bg-gray-800 text-gray-600 rounded text-[9px]">+{entry.tags.length - 4}</span>
                        )}
                    </div>
                )}

                {/* Bottom CTA row */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
                    <button
                        onClick={() => onEdit(entry)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Update
                    </button>
                    <button
                        onClick={() => onDelete(entry)}
                        className="px-3 py-2 rounded-lg border border-gray-800 bg-gray-900/50 text-gray-500 text-xs font-semibold hover:border-red-500/40 hover:text-red-400 transition"
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function RHManage() {
    const [entries, setEntries] = useState(DUMMY_RESEARCH_HUBS);
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState("");
    const [filterFeatured, setFilterFeatured] = useState(false);

    const [editEntry, setEditEntry] = useState(null);
    const [deleteEntry, setDeleteEntry] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");

    // ── Filter logic ────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        return entries.filter((e) => {
            if (search && !e.title.toLowerCase().includes(search.toLowerCase()) &&
                !e.abstract.toLowerCase().includes(search.toLowerCase())) return false;
            if (filterCategory && e.category !== filterCategory) return false;
            if (filterType && e.contentType !== filterType) return false;
            if (filterFeatured && !e.featured) return false;
            return true;
        });
    }, [entries, search, filterCategory, filterType, filterFeatured]);

    const featuredCount = entries.filter((e) => e.featured).length;
    const downloadableCount = entries.filter((e) => e.downloadable).length;

    // ── Handlers ────────────────────────────────────────────────────────────
    const handleSave = (updated) => {
        setEntries((prev) => prev.map((e) => e.id === updated.id ? updated : e));
        setEditEntry(null);
        flash("Research entry updated successfully");
    };

    const handleDelete = () => {
        setEntries((prev) => prev.filter((e) => e.id !== deleteEntry.id));
        setDeleteEntry(null);
        flash("Research entry deleted");
    };

    const flash = (msg) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    return (
        <div>
            {/* ── Flash message ─────────────────────────────────────────── */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 border border-green-500/40 rounded-xl shadow-2xl">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm text-white font-medium">{successMsg}</span>
                </div>
            )}

            {/* ── Page Header ──────────────────────────────────────────── */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-white">Manage Research Hub</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {entries.length} entries · {featuredCount} featured · {downloadableCount} downloadable
                    </p>
                </div>
                {/* Stats pills */}
                <div className="flex gap-2">
                    <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-lg text-xs font-semibold">
                        {entries.length} Total
                    </span>
                    <span className="px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/25 text-yellow-400 rounded-lg text-xs font-semibold">
                        ★ {featuredCount} Featured
                    </span>
                </div>
            </div>

            {/* ── Filters ────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1 min-w-48">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title or abstract…"
                        className="w-full bg-gray-900/50 border border-gray-800 focus:border-amber-500/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                    />
                </div>

                {/* Category filter */}
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="bg-gray-900/50 border border-gray-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-sm text-gray-400 outline-none transition appearance-none"
                >
                    <option value="">All Categories</option>
                    {RH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                {/* Type filter */}
                <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-900/50 border border-gray-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-sm text-gray-400 outline-none transition appearance-none"
                >
                    <option value="">All Types</option>
                    {RH_CONTENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>

                {/* Featured toggle */}
                <button
                    onClick={() => setFilterFeatured(!filterFeatured)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition ${filterFeatured ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" : "border-gray-800 text-gray-500 hover:border-gray-700"}`}
                >
                    ★ Featured only
                </button>
            </div>

            {/* ── Results count ──────────────────────────────────────────── */}
            {(search || filterCategory || filterType || filterFeatured) && (
                <p className="text-xs text-gray-600 mb-4">
                    Showing {filtered.length} of {entries.length} entries
                    <button onClick={() => { setSearch(""); setFilterCategory(""); setFilterType(""); setFilterFeatured(false); }}
                        className="ml-3 text-amber-500 hover:text-amber-400 transition">
                        Clear filters
                    </button>
                </p>
            )}

            {/* ── Grid ───────────────────────────────────────────────────── */}
            {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((entry) => (
                        <EntryCard
                            key={entry.id}
                            entry={entry}
                            onEdit={setEditEntry}
                            onDelete={setDeleteEntry}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-amber-900/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-500 font-medium">No research entries found</p>
                    <p className="text-gray-700 text-xs mt-1">Try adjusting your filters</p>
                </div>
            )}

            {/* ── Modals ─────────────────────────────────────────────────── */}
            {editEntry && (
                <UpdateModal
                    entry={editEntry}
                    onSave={handleSave}
                    onClose={() => setEditEntry(null)}
                />
            )}
            {deleteEntry && (
                <DeleteConfirmModal
                    entry={deleteEntry}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteEntry(null)}
                />
            )}
        </div>
    );
}
