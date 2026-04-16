"use client";

import { useMemo, useState } from "react";

import { CATEGORIES, DUMMY_CASE_STUDIES } from "@/components/constants";


export default function CaseStudyManage() {
    const [entries, setEntries] = useState(DUMMY_CASE_STUDIES);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [featuredOnly, setFeaturedOnly] = useState(false);

    const filteredEntries = useMemo(() => {
        return entries.filter((entry) => {
            const query = search.toLowerCase();
            const matchesSearch = !search
                || entry.title.toLowerCase().includes(query)
                || entry.about_client.toLowerCase().includes(query);

            const matchesCategory = !category || entry.category === category;
            const matchesFeatured = !featuredOnly || entry.featured;

            return matchesSearch && matchesCategory && matchesFeatured;
        });
    }, [category, entries, featuredOnly, search]);

    const featuredCount = entries.filter((entry) => entry.featured).length;

    return (
        <div>
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

            {filteredEntries.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredEntries.map((entry) => (
                        <article key={entry.id} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50">
                            <div className="h-36 bg-gradient-to-br from-emerald-950/30 via-gray-900 to-teal-950/20" />
                            <div className="space-y-3 p-4">
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="rounded-full border border-emerald-500/30 bg-black/60 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                                        {entry.category}
                                    </span>
                                    {entry.featured && (
                                        <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-bold text-emerald-950">
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <h3 className="line-clamp-2 text-sm font-bold text-white">{entry.title}</h3>
                                <p className="line-clamp-3 text-[11px] leading-relaxed text-gray-500">{entry.about_client}</p>
                                <div className="flex items-center justify-between border-t border-gray-800 pt-3 text-[10px] text-gray-600">
                                    <span>{entry.id}</span>
                                    <span>{entry.website_issues.length} issues</span>
                                </div>
                            </div>
                        </article>
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
        </div>
    );
}
