"use client";

import { useRef } from "react";


// components/cms/research-hub/RHform.js
// ─────────────────────────────────────────────────────────────────────────────
// Left-column form for the Research Hub CMS. Pure/prop-driven — no local state.
// Amber/orange accent throughout. Adds Research Hub-specific fields:
//   contentType, pageCount, downloadable toggle, featured toggle.
// ─────────────────────────────────────────────────────────────────────────────

import { Field, Section } from "../FormPrimitives";
import RHAuthorSelector from "./RHauthorselector";
import RHBannerUploader from "./RHbanneruploader";
import { RH_CATEGORIES, RH_CONTENT_TYPES, slugify } from "./RHconstants";
import RHRichTextEditor from "./RHrichtexteditor";
import RHTagsInput from "./RHtagsinput";

export default function RHForm({ form, setForm, onReset, showHeader = true }) {
    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
    const setSeo = (key, val) => setForm((f) => ({ ...f, seo: { ...f.seo, [key]: val } }));

    const ogFileInputRef = useRef(null);
    const handleOgImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSeo("ogImageFile", file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setSeo("ogImageUrl", event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRemoveOgImage = () => {
        setSeo("ogImageFile", null);
        setSeo("ogImageUrl", "");
        if (ogFileInputRef.current) {
            ogFileInputRef.current.value = "";
        }
    };

    const handleTitleBlur = () => {
        if (!form.slug && form.title) set("slug", slugify(form.title));
    };

    return (
        <div>
            {/* ── Header ─────────────────────────────────────────────────────── */}
            {showHeader && (
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-xl font-bold text-white">New Research Hub Entry</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Publish a research report, whitepaper, or dataset. JSON preview generated automatically.
                        </p>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-xs text-gray-600 hover:text-gray-300 transition px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700"
                    >
                        Reset all
                    </button>
                </div>
            )}

            {/* ── BASICS ─────────────────────────────────────────────────────── */}
            <Section title="Basics">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className="w-full bg-black border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition appearance-none"
                        >
                            <option value="">Select category…</option>
                            {RH_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Content Type */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Content Type</label>
                        <select
                            value={form.contentType}
                            onChange={(e) => set("contentType", e.target.value)}
                            className="w-full bg-black border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition appearance-none"
                        >
                            <option value="">Select type…</option>
                            {RH_CONTENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div onBlur={handleTitleBlur} className="sm:col-span-2">
                        <Field
                            label="Title"
                            value={form.title}
                            onChange={(v) => set("title", v)}
                            placeholder="The State of B2B SaaS Marketing in 2025…"
                        />
                    </div>
                </div>

                <Field
                    label="Slug / ID"
                    value={form.slug}
                    onChange={(v) => set("slug", v)}
                    placeholder="auto-generated from title"
                    mono
                />

                <Field
                    label="Abstract"
                    textarea
                    rows={3}
                    value={form.abstract}
                    onChange={(v) => set("abstract", v)}
                    placeholder="A concise 2–3 sentence summary of the research, methodology, and key findings…"
                />
            </Section>

            {/* ── BANNER ─────────────────────────────────────────────────────── */}
            <Section title="Cover / Banner Image">
                <RHBannerUploader
                    preview={form.bannerPreview}
                    onChange={(file, preview) =>
                        setForm((f) => ({ ...f, bannerFile: file, bannerPreview: preview }))
                    }
                />
            </Section>

            {/* ── CONTENT ────────────────────────────────────────────────────── */}
            <Section title="Research Content">
                <RHRichTextEditor
                    value={form.content}
                    onChange={(v) => set("content", v)}
                    slug={form.slug}
                />
            </Section>

            {/* ── METADATA ───────────────────────────────────────────────────── */}
            <Section title="Publication Metadata">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Publish Date</label>
                        <input
                            type="date"
                            value={form.publishDate}
                            onChange={(e) => set("publishDate", e.target.value)}
                            className="w-full bg-gray-900/50 border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition"
                        />
                    </div>
                    <Field
                        label="Read Time"
                        value={form.readTime}
                        onChange={(v) => set("readTime", v)}
                        placeholder="18 min read"
                        hint="(auto-estimated if blank)"
                    />
                    <Field
                        label="Page Count"
                        value={form.pageCount}
                        onChange={(v) => set("pageCount", v)}
                        placeholder="42"
                        hint="(PDF / slides pages)"
                    />
                </div>

                <RHTagsInput tags={form.tags} onChange={(v) => set("tags", v)} />

                {/* Toggles */}
                <div className="flex flex-wrap gap-4 pt-1">
                    {/* Downloadable toggle */}
                    <button
                        onClick={() => set("downloadable", !form.downloadable)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.downloadable
                            ? "border-amber-500/50 bg-amber-500/10 text-amber-400"
                            : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"
                            }`}
                    >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${form.downloadable ? "border-amber-500 bg-amber-500" : "border-gray-700 bg-transparent"}`}>
                            {form.downloadable && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Downloadable PDF
                    </button>

                    {/* Featured toggle */}
                    <button
                        onClick={() => set("featured", !form.featured)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${form.featured
                            ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                            : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"
                            }`}
                    >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${form.featured ? "border-yellow-500 bg-yellow-500" : "border-gray-700 bg-transparent"}`}>
                            {form.featured && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </div>
                        ★ Feature on Homepage
                    </button>
                </div>
            </Section>

            {/* ── AUTHORS ────────────────────────────────────────────────────── */}
            <Section title="Researchers / Authors">
                <RHAuthorSelector
                    primaryAuthor={form.author}
                    coAuthor={form.coAuthor}
                    onPrimaryChange={(a) => set("author", a)}
                    onCoAuthorChange={(a) => set("coAuthor", a)}
                />
            </Section>

            {/* ── SEO SETTINGS ────────────────────────────────────────────────── */}
            <Section title="SEO Settings">
                <Field
                    label="Meta Title"
                    value={form.seo?.metaTitle || ""}
                    onChange={(v) => setSeo("metaTitle", v)}
                    placeholder="e.g. Renoweb Research Hub..."
                />
                
                <div>
                    <div className={`text-right text-xs mt-1 ${(form.seo?.metaDescription?.length || 0) >= 150 ? ((form.seo?.metaDescription?.length || 0) === 160 ? 'text-red-400' : 'text-orange-400') : 'text-gray-600'}`}
                         style={{ float: 'right', marginTop: 0 }}>
                        {(form.seo?.metaDescription?.length || 0)}/160
                    </div>
                    <Field
                        label="Meta Description"
                        textarea
                        rows={2}
                        value={form.seo?.metaDescription || ""}
                        onChange={(v) => {
                            if (v.length <= 160) setSeo("metaDescription", v);
                        }}
                        placeholder="Short description for search engines..."
                    />
                </div>

                <Field
                    label="Canonical URL"
                    value={form.seo?.canonicalUrl || ""}
                    onChange={(v) => setSeo("canonicalUrl", v)}
                    placeholder="https://renoweb.com/research-hub/..."
                    mono
                />

                <div className="pt-4 mt-2 border-t border-gray-800">
                    <Field
                        label="Open Graph Title"
                        value={form.seo?.ogTitle || ""}
                        onChange={(v) => setSeo("ogTitle", v)}
                        placeholder="Title for social sharing..."
                    />
                    
                    <Field
                        label="Open Graph Description"
                        textarea
                        rows={2}
                        value={form.seo?.ogDescription || ""}
                        onChange={(v) => setSeo("ogDescription", v)}
                        placeholder="Description for social sharing..."
                    />
                    
                    <div className="mt-4">
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Open Graph Image</label>
                        <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-900/20 transition-all hover:border-amber-500/50 hover:bg-gray-900/40 group relative overflow-hidden min-h-[160px]">
                            {form.seo?.ogImageUrl ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={form.seo.ogImageUrl}
                                        alt="OG Preview"
                                        className="w-full h-full object-contain absolute inset-0 z-0 p-2"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3">
                                        <label className="bg-amber-600/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-amber-600/30 transition backdrop-blur-md cursor-pointer">
                                            Replace
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleOgImageChange}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            onClick={handleRemoveOgImage}
                                            className="bg-red-500/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition backdrop-blur-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-3 text-gray-500 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-400 font-medium mb-1">Drop OG image here</p>
                                    <p className="text-xs text-gray-600">Recommended 1200×630 for social media</p>
                                    <input
                                        type="file"
                                        ref={ogFileInputRef}
                                        accept="image/*"
                                        onChange={handleOgImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}