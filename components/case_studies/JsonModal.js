"use client";

// components/cms/JsonModal.js
import { useState } from "react";

export default function JsonModal({ data, onClose }) {
    const [copied, setCopied] = useState(false);

    // Strip all File objects and base64 previews — only store URLs in the DB
    const exportData = {
        ...data,
        // Banner
        bannerFile: undefined,
        bannerPreview: data.bannerPreview ? "[BASE64_PREVIEW — not stored in JSON]" : undefined,

        // UI/UX issues — strip image files/previews
        uiux_issues: (data.uiux_issues || [])
            .filter((i) => i.title || i.description)
            .map(({ beforeImageFile, beforeImagePreview, ...rest }) => ({
                ...rest,
                beforeImage: rest.id ? `/case_studies/${data.id}_${rest.id}.png` : undefined,
            })),

        // Before/After — strip image files/previews
        beforeAfterShowcase: data.beforeAfterShowcase
            ? {
                before: {
                    image: data.beforeAfterShowcase.before?.imagePreview
                        ? `/case_studies/${data.id}_home_before.png`
                        : undefined,
                    caption: data.beforeAfterShowcase.before?.caption || undefined,
                },
                after: {
                    image: data.beforeAfterShowcase.after?.imagePreview
                        ? `/case_studies/${data.id}_home_after.png`
                        : undefined,
                    caption: data.beforeAfterShowcase.after?.caption || undefined,
                },
            }
            : undefined,

        // Results
        results_conclusion: data.results_conclusion || undefined,
        website_issues: (data.website_issues || []).length > 0 ? data.website_issues : undefined,
    };

    // Remove undefined keys for clean output
    const cleanData = JSON.parse(JSON.stringify(exportData, (_, v) => v === undefined ? undefined : v));
    const json = JSON.stringify(cleanData, null, 2);

    const handleCopy = () => {
        navigator.clipboard.writeText(json);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                        </div>
                        <h3 className="font-bold text-white text-sm">JSON Output</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition p-1">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Code */}
                <pre className="p-6 overflow-auto flex-1 text-xs text-green-400 font-mono leading-relaxed bg-gray-950 rounded-none">
                    {json}
                </pre>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between gap-3">
                    <p className="text-[10px] text-gray-600">
                        Paste this object into your case-studies data file
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className={`px-4 py-2 text-sm rounded-lg font-semibold transition ${copied
                                ? "bg-green-600/20 border border-green-600/40 text-green-400"
                                : "bg-blue-600/20 border border-blue-600/40 text-blue-400 hover:bg-blue-600/30"
                                }`}
                        >
                            {copied ? "Copied ✓" : "Copy JSON"}
                        </button>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm bg-gray-900 text-gray-300 rounded-lg hover:bg-gray-800 transition border border-gray-800"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}