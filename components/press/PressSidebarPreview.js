"use client";

// components/press/PressSidebarPreview.js
// ─────────────────────────────────────────────────────────────────────────────
// Sticky right-column sidebar: live card preview, completeness checklist,
// and Save button. Matches BlogSidebarPreview structure.
// ─────────────────────────────────────────────────────────────────────────────

const PRESS_CHECKS = [
    ["Title", (f) => !!f.title],
    ["Link", (f) => !!f.link],
    ["Date", (f) => !!f.date],
    ["Description", (f) => !!f.description],
    ["Image", (f) => !!f.imagePreview],
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
    const completedCount = PRESS_CHECKS.filter(([, fn]) => fn(form)).length;
    const pct = Math.round((completedCount / PRESS_CHECKS.length) * 100);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="text-xs font-semibold text-gray-400 tracking-wide uppercase">Press Preview</span>
                </div>
                <span className="text-[10px] text-gray-600">{pct}% complete</span>
            </div>

            <div className="p-5">
                {/* Image & Logo */}
                {form.imagePreview && (
                    <div className="rounded-xl overflow-hidden mb-4 h-28 relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
                        
                        {form.logoPreview && (
                            <div className="absolute top-2 right-2 w-10 h-10 bg-white rounded-lg p-1 shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={form.logoPreview} alt="logo" className="w-full h-full object-contain" />
                            </div>
                        )}

                        {form.isFeatured && (
                            <div className="absolute top-2 left-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                FEATURED
                            </div>
                        )}
                    </div>
                )}

                {/* Date badge */}
                {form.date ? (
                    <span className="inline-block px-2.5 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[10px] font-medium border border-blue-600/30 mb-3">
                        {new Date(form.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                ) : (
                    <span className="inline-block px-2.5 py-1 bg-gray-800 text-gray-600 rounded-full text-[10px] mb-3">
                        Date
                    </span>
                )}

                {/* Title */}
                <h3 className="text-sm font-bold text-white leading-snug mb-2 line-clamp-3">
                    {form.title || <span className="text-gray-600 italic font-normal">Title will appear here…</span>}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {form.description || <span className="italic">Short description will appear here…</span>}
                </p>

                {/* Link */}
                {form.link && (
                    <div className="flex items-center gap-1 mt-3 text-blue-400 text-xs font-semibold">
                        View Article
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PressSidebarPreview({ form, onSave, loading }) {
    const completedCount = PRESS_CHECKS.filter(([, fn]) => fn(form)).length;
    const allDone = completedCount === PRESS_CHECKS.length;

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
                    <span className="text-[10px] text-gray-500">{completedCount}/{PRESS_CHECKS.length}</span>
                </div>
                <div className="p-5 space-y-2.5">
                    {PRESS_CHECKS.map(([label, fn]) => (
                        <CheckItem key={label} label={label} done={fn(form)} />
                    ))}
                </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
                <button
                    onClick={onSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition shadow-lg shadow-blue-600/25 disabled:opacity-60"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {loading ? "Saving…" : form.id ? "Update Press Entry" : "Publish Press Entry"}
                </button>

                <p className="text-center text-[10px] text-gray-700 mt-1">
                    Firebase upload connected — awaiting credentials
                </p>
            </div>
        </div>
    );
}
