"use client";

// components/cms/blog/BlogBannerUploader.js
// ─────────────────────────────────────────────────────────────────────────────
// Drag-and-drop / click-to-upload banner image component.
// Produces a local base64 preview; the actual file is uploaded to Supabase
// Storage (contentimages/blog-banners/{slug}.ext) inside BlogPage.handleSave,
// matching the same pattern used by the Case Study uploader.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef } from "react";

export default function BlogBannerUploader({ preview, onChange }) {
    const inputRef = useRef();

    const handleFile = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => onChange(file, e.target.result);
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">Banner Image</label>

            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                className="relative cursor-pointer rounded-xl border-2 border-dashed border-gray-800 hover:border-blue-600/50 transition overflow-hidden group"
                style={{ minHeight: "160px" }}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="banner preview" className="w-full h-48 object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-xs text-white font-semibold bg-blue-600 px-4 py-2 rounded-lg">
                                Replace Image
                            </span>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 rounded-md px-2 py-1">
                            <span className="text-[10px] text-gray-300">Banner uploaded ✓</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-3">
                            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-400 font-medium">Drop image or click to upload</p>
                        <p className="text-xs text-gray-600 mt-1">PNG, JPG, WEBP — recommended 1200×630</p>
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

            <p className="text-[10px] text-gray-700 mt-1.5">
                Stored in Firebase Storage under <code className="text-gray-600">blog-banners/</code>
            </p>
        </div>
    );
}