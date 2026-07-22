"use client";

import { useRef } from "react";
import { Field, Section } from "../FormPrimitives";

// ─────────────────────────────────────────────────────────────────────────────
// Left-column form for the Press CMS. Pure/prop-driven — holds no state.
// Matches BlogForm layout: full-width sections, no card wrapper.
// ─────────────────────────────────────────────────────────────────────────────

export default function PressForm({ form, setForm, onReset }) {
    const fileInputRef = useRef(null);

    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            set("imageFile", file);
            const reader = new FileReader();
            reader.onload = (event) => {
                set("imagePreview", event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        set("imageFile", null);
        set("imagePreview", null);
        set("imageUrl", "");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const logoInputRef = useRef(null);

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            set("logoFile", file);
            const reader = new FileReader();
            reader.onload = (event) => {
                set("logoPreview", event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveLogo = () => {
        set("logoFile", null);
        set("logoPreview", null);
        set("logoUrl", "");
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    };

    return (
        <div>
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-white">
                        {form.id ? "Edit Press Entry" : "New Press Entry"}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Add a new press feature or media link to the directory.
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="text-xs text-gray-600 hover:text-gray-300 transition px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700"
                >
                    Reset all
                </button>
            </div>

            {/* ── DETAILS ────────────────────────────────────────────────────── */}
            <Section title="Details">
                <Field
                    label="Title"
                    value={form.title}
                    onChange={(v) => set("title", v)}
                    placeholder="e.g. Forbes features Renoweb's digital transformation…"
                />

                <Field
                    label="Link (URL)"
                    value={form.link}
                    onChange={(v) => set("link", v)}
                    placeholder="https://forbes.com/article/..."
                    mono
                />

                <div>
                    <div className={`text-right text-xs mt-1 ${form.description.length >= 180 ? (form.description.length === 200 ? 'text-red-400' : 'text-orange-400') : 'text-gray-600'}`}
                         style={{ float: 'right', marginTop: 0 }}>
                        {form.description.length}/200
                    </div>
                    <Field
                        label="Short Description"
                        textarea
                        rows={3}
                        value={form.description}
                        onChange={(v) => {
                            if (v.length <= 200) set("description", v);
                        }}
                        placeholder="A brief summary of the press coverage…"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => set("date", e.target.value)}
                            style={{ colorScheme: "dark" }}
                            className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition"
                        />
                    </div>
                </div>
            </Section>

            {/* ── MEDIA IMAGE ────────────────────────────────────────────────── */}
            <Section title="Media Image">
                <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-900/20 transition-all hover:border-blue-500/50 hover:bg-gray-900/40 group relative overflow-hidden min-h-[200px]">
                    {form.imagePreview ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={form.imagePreview}
                                alt="Preview"
                                className="w-full h-full object-contain absolute inset-0 z-0 p-2"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3">
                                <label className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition backdrop-blur-md cursor-pointer">
                                    Replace
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    onClick={handleRemoveImage}
                                    className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition backdrop-blur-md"
                                >
                                    Remove
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-3 text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 font-medium mb-1">Drop image or click to upload</p>
                            <p className="text-xs text-gray-600">PNG, JPG, WEBP — recommended 1200×630</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                        </>
                    )}
                </div>
                <p className="text-[10px] text-gray-600 mt-2">
                    Stored in Preview Storage under press-images/
                </p>
            </Section>

            {/* ── PUBLISHER LOGO ────────────────────────────────────────────────── */}
            <Section title="Publisher Logo">
                <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-900/20 transition-all hover:border-blue-500/50 hover:bg-gray-900/40 group relative overflow-hidden min-h-[160px]">
                    {form.logoPreview ? (
                        <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={form.logoPreview}
                                alt="Logo Preview"
                                className="w-24 h-24 object-contain absolute inset-0 m-auto z-0 p-2 bg-white/5 rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3">
                                <label className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition backdrop-blur-md cursor-pointer">
                                    Replace
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    onClick={handleRemoveLogo}
                                    className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition backdrop-blur-md"
                                >
                                    Remove
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-3 text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <p className="text-sm text-gray-400 font-medium mb-1">Drop logo or click to upload</p>
                            <p className="text-xs text-gray-600">PNG, SVG, WEBP — Recommended 200×200</p>
                            <input
                                type="file"
                                ref={logoInputRef}
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                        </>
                    )}
                </div>
                <p className="text-[10px] text-gray-600 mt-2">
                    Optional publisher logo (e.g., Forbes, Economic Times)
                </p>
            </Section>
        </div>
    );
}
