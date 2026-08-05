"use client";

// components/cms/projects/ProjectsSidebarPreview.js
// ─────────────────────────────────────────────────────────────────────────────
// Sticky right-column sidebar: live card preview, completeness checklist,
// Preview JSON button, and Publish button.
// ─────────────────────────────────────────────────────────────────────────────

const PROJECT_CHECKS = [
    ["Category", (f) => !!f.category],
    ["Title", (f) => !!f.title],
    ["Slug", (f) => !!f.slug],
    ["Gallery (min 2)", (f) => {
        let count = 0;
        for (let i = 0; i < 5; i++) {
            if (f.imagePreviews[i]) count++;
        }
        return count >= 2;
    }],
    ["Short description", (f) => !!f.excerpt],
    ["Content", (f) => f.content && f.content.replace(/<[^>]*>/g, "").trim().length > 10],
    ["Publish Date", (f) => !!f.publishDate],
];

function CheckItem({ label, done }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${done ? "bg-green-500/20 border border-green-500/50" : "bg-gray-900 border border-gray-800"
                }`}>
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
    const completedCount = PROJECT_CHECKS.filter(([, fn]) => fn(form)).length;
    const pct = Math.round((completedCount / PROJECT_CHECKS.length) * 100);

    // Get the first available image for the banner preview
    const coverImage = form.imagePreviews.find(img => img !== null);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Project Preview</span>
                </div>
                <span className="text-[10px] text-gray-600">{pct}% complete</span>
            </div>

            <div className="p-5">
                {/* Banner */}
                {coverImage && (
                    <div className="rounded-xl overflow-hidden mb-4 h-28">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Category badge */}
                {form.category ? (
                    <span className="inline-block px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-medium border border-blue-600/30 mb-3">
                        {form.category}
                    </span>
                ) : (
                    <span className="inline-block px-2.5 py-1 bg-gray-800 text-gray-600 rounded-full text-[10px] mb-3">
                        Category
                    </span>
                )}

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-3">
                    {form.title || <span className="text-gray-600 italic font-normal">Title will appear here…</span>}
                </h3>

                {/* Short description */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {form.excerpt || <span className="italic">Short description will appear here…</span>}
                </p>

                {/* Date */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                    <div>
                        <p className="text-[10px] font-semibold text-gray-300">Published</p>
                        <p className="text-[9px] text-gray-600">
                            {form.publishDate || "—"}
                        </p>
                    </div>
                </div>

                {/* Read more */}
                <div className="flex items-center gap-1 mt-3 text-blue-400 text-xs font-semibold">
                    View Project
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default function ProjectsSidebarPreview({ form, onPreviewJson, onSave, loading }) {
    const completedCount = PROJECT_CHECKS.filter(([, fn]) => fn(form)).length;
    const allDone = completedCount === PROJECT_CHECKS.length;

    return (
        <div className="sticky top-20 space-y-4">
            {/* Card preview */}
            <CardPreview form={form} />

            {/* Checklist */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${allDone ? "bg-green-400" : "bg-yellow-500"}`} />
                        <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Checklist</span>
                    </div>
                    <span className="text-[10px] text-gray-500">{completedCount}/{PROJECT_CHECKS.length}</span>
                </div>
                <div className="p-5 space-y-2.5">
                    {PROJECT_CHECKS.map(([label, fn]) => (
                        <CheckItem key={label} label={label} done={fn(form)} />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={onPreviewJson}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-blue-600/30 bg-blue-600/10 text-blue-400 text-sm font-semibold hover:bg-blue-600/20 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Preview JSON
                </button>

                <button
                    onClick={onSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-lg shadow-blue-600/25 disabled:opacity-60"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {loading ? "Publishing…" : "Publish Project"}
                </button>

                <p className="text-center text-[10px] text-gray-700 mt-1">
                    Firebase upload connected — awaiting credentials
                </p>
            </div>
        </div>
    );
}
