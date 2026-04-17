"use client";

import { useEffect, useMemo, useState } from "react";

import CaseStudyForm from "@/components/case_studies/CaseStudyForm";
import { CATEGORIES } from "@/components/constants";
import {
    caseStudyEntryToForm,
    deleteCaseStudy,
    saveCaseStudy,
    subscribeToCaseStudies,
} from "@/lib/caseStudies";

function SuccessToast({ message }) {
    if (!message) return null;

    return (
        <div className="fixed right-6 top-6 z-50 flex items-center gap-3 rounded-xl border border-green-500/40 bg-gray-900 px-5 py-3 shadow-2xl">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20">
                <svg className="h-3 w-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <span className="text-sm font-medium text-white">{message}</span>
        </div>
    );
}

function DeleteConfirmModal({ entry, onCancel, onConfirm, deleting }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-black p-6 shadow-2xl">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">
                        <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">Delete Case Study</h3>
                        <p className="text-xs text-gray-500">This action cannot be undone.</p>
                    </div>
                </div>

                <p className="mb-6 text-sm leading-relaxed text-gray-400">
                    Are you sure you want to delete <span className="font-semibold text-white">&quot;{entry.title}&quot;</span>?
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={deleting}
                        className="flex-1 rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={deleting}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {deleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function UpdateModal({ entry, onClose, onSaved }) {
    const [form, setForm] = useState(() => caseStudyEntryToForm(entry));
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setForm(caseStudyEntryToForm(entry));
    }, [entry]);

    const handleReset = () => {
        setForm(caseStudyEntryToForm(entry));
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            const result = await saveCaseStudy(form, {
                originalId: entry.id,
                confirmOverwrite: async () => window.confirm("A case study with this slug already exists. Overwrite?"),
            });

            if (result?.cancelled) {
                return;
            }

            onSaved("Case study updated successfully");
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to update case study. Check console.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm">
            <div className="my-4 flex max-h-[90vh] w-full max-w-6xl flex-col rounded-2xl border border-gray-800 bg-black shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-800 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/15">
                            <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Update Case Study</h3>
                            <p className="max-w-xs truncate font-mono text-[10px] text-gray-500">{entry.id}</p>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-1 text-gray-600 transition hover:text-white">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto px-6 py-6">
                    <CaseStudyForm
                        form={form}
                        setForm={setForm}
                        onReset={handleReset}
                        showHeader={false}
                    />
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-800 px-6 py-4">
                    <button
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-xl border border-gray-800 bg-gray-900 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function EntryCard({ entry, onEdit, onDelete }) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 transition hover:border-gray-700">
            <div className="relative h-36 bg-gradient-to-br from-emerald-950/30 via-gray-900 to-teal-950/20">
                {entry.bannerUrl ? (
                    <img src={entry.bannerUrl} alt={entry.title} className="h-full w-full object-cover" />
                ) : null}

                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full border border-emerald-500/30 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        {entry.category}
                    </span>
                    {entry.featured && (
                        <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-emerald-950">
                            Featured
                        </span>
                    )}
                </div>

                <div className="absolute right-3 top-3 flex gap-1.5 opacity-0 transition group-hover:opacity-100">
                    <button
                        onClick={() => onEdit(entry)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-black/80 text-gray-400 transition hover:border-emerald-500/50 hover:text-emerald-400"
                        title="Edit"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => onDelete(entry)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-700 bg-black/80 text-gray-400 transition hover:border-red-500/50 hover:text-red-400"
                        title="Delete"
                    >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="space-y-3 p-4">
                <h3 className="line-clamp-2 text-sm font-bold text-white">{entry.title}</h3>
                <p className="line-clamp-3 text-[11px] leading-relaxed text-gray-500">{entry.about_client}</p>

                <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-[10px] text-gray-600">
                    <span className="truncate">{entry.id}</span>
                    <span>{entry.website_issues?.length || 0} issues</span>
                </div>

                <div className="flex gap-2 border-t border-gray-800 pt-3">
                    <button
                        onClick={() => onEdit(entry)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Update
                    </button>
                    <button
                        onClick={() => onDelete(entry)}
                        className="rounded-lg border border-gray-800 bg-gray-900/50 px-3 py-2 text-xs font-semibold text-gray-500 transition hover:border-red-500/40 hover:text-red-400"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    );
}

export default function CaseStudyManage() {
    const [entries, setEntries] = useState([]);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [featuredOnly, setFeaturedOnly] = useState(false);
    const [editEntry, setEditEntry] = useState(null);
    const [deleteEntry, setDeleteEntry] = useState(null);
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToCaseStudies(
            (nextEntries) => {
                setEntries(nextEntries);
                setLoading(false);
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );

        return unsubscribe;
    }, []);

    const filteredEntries = useMemo(() => {
        return entries.filter((entry) => {
            const query = search.toLowerCase();
            const matchesSearch = !search
                || entry.title?.toLowerCase().includes(query)
                || entry.about_client?.toLowerCase().includes(query);

            const matchesCategory = !category || entry.category === category;
            const matchesFeatured = !featuredOnly || entry.featured;

            return matchesSearch && matchesCategory && matchesFeatured;
        });
    }, [category, entries, featuredOnly, search]);

    const featuredCount = entries.filter((entry) => entry.featured).length;

    const flash = (message) => {
        setSuccessMsg(message);
        setTimeout(() => setSuccessMsg(""), 3000);
        setEditEntry(null);
        setDeleteEntry(null);
    };

    const handleDelete = async () => {
        if (!deleteEntry) return;

        try {
            setDeleting(true);
            await deleteCaseStudy(deleteEntry.id);
            flash("Case study deleted");
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to delete case study. Check console.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div>
            <SuccessToast message={successMsg} />

            <div className="mb-8 flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-white">Manage Case Studies</h1>
                    <p className="mt-0.5 text-xs text-gray-500">
                        {entries.length} case studies · {featuredCount} featured
                    </p>
                </div>

                <div className="flex gap-2">
                    <span className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300">
                        {entries.length} Total
                    </span>
                    <span className="rounded-lg border border-teal-500/25 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300">
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
                        placeholder="Search title or client summary..."
                        className="w-full rounded-xl border border-gray-800 bg-gray-900/50 py-2.5 pl-10 pr-4 text-sm text-gray-200 outline-none transition focus:border-emerald-500/60"
                    />
                </div>

                <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="appearance-none rounded-xl border border-gray-800 bg-gray-900/50 px-4 py-2.5 text-sm text-gray-400 outline-none transition focus:border-emerald-500/60"
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                    ))}
                </select>

                <button
                    onClick={() => setFeaturedOnly((current) => !current)}
                    className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${featuredOnly ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-gray-800 text-gray-500 hover:border-gray-700"}`}
                >
                    Featured only
                </button>
            </div>

            {(search || category || featuredOnly) && (
                <p className="mb-4 text-xs text-gray-600">
                    Showing {filteredEntries.length} of {entries.length} case studies
                    <button
                        onClick={() => {
                            setSearch("");
                            setCategory("");
                            setFeaturedOnly(false);
                        }}
                        className="ml-3 text-emerald-400 transition hover:text-emerald-300"
                    >
                        Clear filters
                    </button>
                </p>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20 text-sm text-gray-500">
                    Loading case studies...
                </div>
            ) : filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredEntries.map((entry) => (
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
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
                        <svg className="h-7 w-7 text-emerald-900/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="font-medium text-gray-500">No case studies found</p>
                    <p className="mt-1 text-xs text-gray-700">Try adjusting your filters.</p>
                </div>
            )}

            {editEntry && (
                <UpdateModal
                    entry={editEntry}
                    onClose={() => setEditEntry(null)}
                    onSaved={flash}
                />
            )}

            {deleteEntry && (
                <DeleteConfirmModal
                    entry={deleteEntry}
                    deleting={deleting}
                    onCancel={() => setDeleteEntry(null)}
                    onConfirm={handleDelete}
                />
            )}
        </div>
    );
}
