"use client";

// components/cms/BeforeAfterEditor.js
import { useRef } from "react";

function ShowcaseImageSlot({ label, accentColor, preview, onChange }) {
    const inputRef = useRef();

    const handleFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(file, e.target.result);
        reader.readAsDataURL(file);
    };

    const isBefore = label === "Before";

    return (
        <div className="space-y-2">
            {/* Label badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold ${isBefore
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-green-500/30 bg-green-500/10 text-green-400"
                }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isBefore ? "bg-red-400" : "bg-green-400"}`} />
                {label}
            </div>

            {/* Drop zone */}
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition overflow-hidden group ${isBefore
                    ? "border-red-500/20 hover:border-red-500/40"
                    : "border-green-500/20 hover:border-green-500/40"
                    }`}
                style={{ minHeight: "200px" }}
            >
                {preview ? (
                    <>
                        <img src={preview} alt={`${label} showcase`} className="w-full h-56 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className={`text-xs font-semibold px-4 py-2 rounded-lg ${isBefore
                                ? "bg-red-600/80 text-white"
                                : "bg-green-600/80 text-white"
                                }`}>
                                Replace {label} Image
                            </span>
                        </div>
                        <div className={`absolute top-2 left-2 rounded-md px-2 py-1 ${isBefore ? "bg-red-900/80" : "bg-green-900/80"}`}>
                            <span className="text-[10px] text-white font-semibold">{label} ✓</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-52 text-center px-4 gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${isBefore
                            ? "bg-red-500/10 border-red-500/20"
                            : "bg-green-500/10 border-green-500/20"
                            }`}>
                            <svg className={`w-6 h-6 ${isBefore ? "text-red-400/60" : "text-green-400/60"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${isBefore ? "text-red-400/60" : "text-green-400/60"}`}>
                                {isBefore ? "Upload Before Screenshot" : "Upload After Screenshot"}
                            </p>
                            <p className="text-[11px] text-gray-700 mt-1">PNG, JPG, WEBP — Full page screenshot recommended</p>
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

            {/* Caption input */}
            <input
                type="text"
                placeholder={isBefore ? "C-Quel website before — cluttered, off-brand…" : "C-Quel website after Renoweb's Dev OS rebuild"}
                className={`w-full bg-black border rounded-lg px-3 py-2 text-xs placeholder-gray-700 outline-none transition ${isBefore
                    ? "border-red-500/20 focus:border-red-500/40 text-red-300/80"
                    : "border-green-500/20 focus:border-green-500/40 text-green-300/80"
                    }`}
                onChange={(e) => onChange(null, null, e.target.value)}
            />
        </div>
    );
}

export default function BeforeAfterEditor({ showcase, onChange }) {
    const handleBeforeChange = (file, preview, caption) => {
        if (caption !== undefined) {
            onChange({ ...showcase, before: { ...showcase.before, caption } });
        } else {
            onChange({ ...showcase, before: { ...showcase.before, imageFile: file, imagePreview: preview } });
        }
    };

    const handleAfterChange = (file, preview, caption) => {
        if (caption !== undefined) {
            onChange({ ...showcase, after: { ...showcase.after, caption } });
        } else {
            onChange({ ...showcase, after: { ...showcase.after, imageFile: file, imagePreview: preview } });
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-start gap-3 p-4 bg-blue-600/5 border border-blue-600/20 rounded-xl">
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div>
                    <p className="text-xs font-semibold text-blue-400">Before & After Showcase</p>
                    <p className="text-[11px] text-gray-600 mt-0.5">Full-page portrait screenshots showing the transformation. Shown prominently at the bottom of the case study.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ShowcaseImageSlot
                    label="Before"
                    preview={showcase?.before?.imagePreview}
                    onChange={handleBeforeChange}
                />
                <ShowcaseImageSlot
                    label="After"
                    preview={showcase?.after?.imagePreview}
                    onChange={handleAfterChange}
                />
            </div>

            {/* Live comparison preview */}
            {(showcase?.before?.imagePreview || showcase?.after?.imagePreview) && (
                <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 font-medium">Preview</p>
                    <div className="grid grid-cols-2 gap-3">
                        {showcase?.before?.imagePreview ? (
                            <div className="space-y-1.5">
                                <img src={showcase.before.imagePreview} alt="before" className="w-full rounded-lg object-cover border border-red-500/20" style={{ maxHeight: "180px" }} />
                                <p className="text-[10px] text-red-400/60 text-center">Before</p>
                            </div>
                        ) : (
                            <div className="h-36 rounded-lg border border-dashed border-gray-800 flex items-center justify-center">
                                <span className="text-[10px] text-gray-700">Before not uploaded</span>
                            </div>
                        )}
                        {showcase?.after?.imagePreview ? (
                            <div className="space-y-1.5">
                                <img src={showcase.after.imagePreview} alt="after" className="w-full rounded-lg object-cover border border-green-500/20" style={{ maxHeight: "180px" }} />
                                <p className="text-[10px] text-green-400/60 text-center">After</p>
                            </div>
                        ) : (
                            <div className="h-36 rounded-lg border border-dashed border-gray-800 flex items-center justify-center">
                                <span className="text-[10px] text-gray-700">After not uploaded</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}