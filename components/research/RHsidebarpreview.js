"use client";

// components/cms/research-hub/RHsidebarpreview.js
// ─────────────────────────────────────────────────────────────────────────────
// Sticky right-column sidebar: live card preview, completeness checklist,
// Preview JSON button, and Publish button.
// Amber/orange accent — mirrors BlogSidebarPreview.
// ─────────────────────────────────────────────────────────────────────────────

const RH_CHECKS = [
    ["Category", (f) => !!f.category],
    ["Content Type", (f) => !!f.contentType],
    ["Title", (f) => !!f.title],
    ["Slug", (f) => !!f.slug],
    ["Banner Image", (f) => !!f.bannerPreview],
    ["Abstract", (f) => !!f.abstract],
    ["Content", (f) => f.content && f.content.replace(/<[^>]*>/g, "").trim().length > 50],
    ["Publish Date", (f) => !!f.publishDate],
    ["Primary Author", (f) => !!f.author],
];

const CONTENT_TYPE_LABELS = {
    report: "Research Report",
    whitepaper: "Whitepaper",
    infographic: "Infographic",
    dataset: "Dataset",
    "case-analysis": "Case Analysis",
};

function CheckItem({ label, done }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${done ? "bg-green-500/20 border border-green-500/50" : "bg-gray-900 border border-gray-800"}`}>
                {done && (
                    <svg className="w-2.5 h-2.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </div>
            <span className={`text-xs ${done ? "text-gray-300" : "text-gray-600"}`}>{label}</span>
        </div>
    );
}

function CardPreview({ form }) {
    const completedCount = RH_CHECKS.filter(([, fn]) => fn(form)).length;
    const pct = Math.round((completedCount / RH_CHECKS.length) * 100);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Entry Preview</span>
                </div>
                <span className="text-[10px] text-gray-600">{pct}% complete</span>
            </div>

            <div className="p-5">
                {/* Banner */}
                {form.bannerPreview && (
                    <div className="rounded-xl overflow-hidden mb-4 h-28">
                        <img src={form.bannerPreview} alt="banner" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Badges row */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {form.category ? (
                        <span className="inline-block px-2.5 py-1 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-medium border border-amber-500/30">
                            {form.category}
                        </span>
                    ) : (
                        <span className="inline-block px-2.5 py-1 bg-gray-800 text-gray-600 rounded-full text-[10px]">
                            Category
                        </span>
                    )}
                    {form.contentType && (
                        <span className="inline-block px-2.5 py-1 bg-orange-500/10 text-orange-400 rounded-full text-[10px] font-medium border border-orange-500/20">
                            {CONTENT_TYPE_LABELS[form.contentType] || form.contentType}
                        </span>
                    )}
                    {form.featured && (
                        <span className="inline-block px-2.5 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-[10px] font-medium border border-yellow-500/20">
                            ★ Featured
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-3">
                    {form.title || <span className="text-gray-600 italic font-normal">Title will appear here…</span>}
                </h3>

                {/* Abstract */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {form.abstract || <span className="italic">Abstract will appear here…</span>}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-800">
                    {form.pageCount && (
                        <span className="text-[10px] text-gray-600 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {form.pageCount} pages
                        </span>
                    )}
                    {form.downloadable && (
                        <span className="text-[10px] text-amber-500 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Downloadable
                        </span>
                    )}
                </div>

                {/* Author row */}
                {form.author && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-900/40 border-2 border-gray-800 flex items-center justify-center text-[9px] font-bold text-amber-400">
                            {form.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-gray-300">{form.author.name}</p>
                            <p className="text-[9px] text-gray-600">
                                {form.publishDate || "—"} · {form.readTime || "? min read"}
                            </p>
                        </div>
                        {form.coAuthor && (
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-900/40 border-2 border-gray-800 flex items-center justify-center text-[9px] font-bold text-amber-400 -ml-2">
                                {form.coAuthor.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                            </div>
                        )}
                    </div>
                )}

                {/* Tags */}
                {form.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                        {form.tags.map((t) => (
                            <span key={t} className="px-2 py-0.5 bg-gray-800 text-gray-500 rounded text-[9px]">#{t}</span>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-1 mt-3 text-amber-400 text-xs font-semibold">
                    Read Research
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function RHSidebarPreview({ form, onPreviewJson, onSave, loading }) {
    const completedCount = RH_CHECKS.filter(([, fn]) => fn(form)).length;
    const allDone = completedCount === RH_CHECKS.length;

    return (
        <div className="sticky top-20 space-y-4">
            <CardPreview form={form} />

            {/* Checklist */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${allDone ? "bg-green-400" : "bg-amber-500"}`} />
                        <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Checklist</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{completedCount}/{RH_CHECKS.length}</span>
                </div>
                <div className="p-5 space-y-2.5">
                    {RH_CHECKS.map(([label, fn]) => (
                        <CheckItem key={label} label={label} done={fn(form)} />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={onPreviewJson}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Preview JSON
                </button>

                <button
                    onClick={onSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition shadow-lg shadow-amber-600/20 disabled:opacity-60"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {loading ? "Publishing…" : "Publish Research"}
                </button>

                <p className="text-center text-[10px] text-gray-700 mt-1">
                    Firebase upload connected — awaiting credentials
                </p>
            </div>
        </div>
    );
}