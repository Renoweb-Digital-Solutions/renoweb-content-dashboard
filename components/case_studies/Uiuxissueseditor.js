"use client";

// components/cms/UiUxIssuesEditor.js
import { useRef } from "react";

function IssueImageUploader({ preview, onChange, issueIndex }) {
    const inputRef = useRef();

    const handleFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(file, e.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div className="mt-3">
            <label className="block text-[10px] text-gray-500 mb-1.5 font-medium uppercase tracking-widest">
                Before Screenshot <span className="text-gray-700">(optional)</span>
            </label>
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                className="relative cursor-pointer rounded-xl border border-dashed border-gray-800 hover:border-blue-600/40 transition overflow-hidden group"
                style={{ minHeight: "80px" }}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="issue screenshot" className="w-full max-h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-[11px] text-white font-semibold bg-blue-600 px-3 py-1.5 rounded-lg">
                                Replace Screenshot
                            </span>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 rounded-md px-2 py-1">
                            <span className="text-[10px] text-gray-400">⚠ Before — What We Found</span>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-3 px-4 py-3 h-20">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-orange-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Attach a screenshot of the issue</p>
                            <p className="text-[10px] text-gray-700 mt-0.5">PNG, JPG, WEBP</p>
                        </div>
                    </div>
                )}
            </div>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
            />
            {preview && (
                <div className="mt-2">
                    <input
                        type="text"
                        placeholder="Caption for this screenshot (optional)…"
                        className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2 text-xs text-gray-300 placeholder-gray-600 outline-none transition font-mono"
                        onChange={(e) => onChange(null, null, e.target.value)}
                    />
                </div>
            )}
        </div>
    );
}

function IssueCard({ issue, index, onChange, onRemove, canRemove }) {
    const updateField = (key, val) => onChange({ ...issue, [key]: val });

    const handleImageChange = (file, previewUrl, caption) => {
        if (caption !== undefined) {
            updateField("beforeCaption", caption);
        } else {
            onChange({
                ...issue,
                beforeImageFile: file,
                beforeImagePreview: previewUrl,
            });
        }
    };

    return (
        <div className="border border-gray-800 rounded-2xl overflow-hidden bg-gray-900/30">
            {/* Issue header */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-800 bg-gray-900/50">
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] font-bold text-white font-mono">
                        {String(index + 1).padStart(2, "0")}
                    </span>
                </div>
                <span className="text-xs font-semibold text-gray-400 flex-1">Issue #{index + 1}</span>
                <button
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            {/* Fields */}
            <div className="p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* ID / slug */}
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1.5 font-medium uppercase tracking-widest">Issue ID</label>
                        <input
                            value={issue.id}
                            onChange={(e) => updateField("id", e.target.value)}
                            placeholder="hero-section"
                            className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2.5 text-xs text-gray-200 placeholder-gray-600 outline-none transition font-mono"
                        />
                    </div>
                    {/* Title */}
                    <div>
                        <label className="block text-[10px] text-gray-500 mb-1.5 font-medium uppercase tracking-widest">Title</label>
                        <input
                            value={issue.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            placeholder="Homepage Hero — Drone & Naruto Animations"
                            className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2.5 text-xs text-gray-200 placeholder-gray-600 outline-none transition"
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1.5 font-medium uppercase tracking-widest">Description</label>
                    <textarea
                        rows={3}
                        value={issue.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        placeholder="Describe what was wrong with this element…"
                        className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2.5 text-xs text-gray-200 placeholder-gray-600 outline-none resize-none transition"
                    />
                </div>

                {/* Image uploader */}
                <IssueImageUploader
                    preview={issue.beforeImagePreview}
                    onChange={handleImageChange}
                    issueIndex={index}
                />
            </div>
        </div>
    );
}

export default function UiUxIssuesEditor({ issues, onChange }) {
    const addIssue = () => onChange([
        ...issues,
        { id: "", title: "", description: "", beforeCaption: "", beforeImageFile: null, beforeImagePreview: null }
    ]);

    const removeIssue = (i) => onChange(issues.filter((_, idx) => idx !== i));

    const updateIssue = (i, val) => {
        const next = [...issues];
        next[i] = val;
        onChange(next);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <svg className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                    <p className="text-xs font-semibold text-orange-400">UI/UX & Content Issues — Documented</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">Each issue is documented with screenshots from the original website, exactly as you found it.</p>
                </div>
            </div>

            {issues.map((issue, i) => (
                <IssueCard
                    key={i}
                    issue={issue}
                    index={i}
                    onChange={(val) => updateIssue(i, val)}
                    onRemove={() => removeIssue(i)}
                    canRemove={issues.length > 1}
                />
            ))}

            <button
                onClick={addIssue}
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold mt-2 transition"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Issue
            </button>
        </div>
    );
}