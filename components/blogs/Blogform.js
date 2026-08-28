"use client";

import { useRef } from "react";


import { Field, Section } from "../FormPrimitives";
import BlogAuthorSelector from "./Blogauthorselector";
import BlogBannerUploader from "./Blogbanneruploader";
import { BLOG_CATEGORIES, slugify } from "./Blogconstants";
import BlogRichTextEditor from "./Blogrichtexteditor";
import BlogTagsInput from "./Blogtagsinput";

// components/cms/blog/BlogForm.js
// ─────────────────────────────────────────────────────────────────────────────
// Left-column form for the Blog CMS. Pure/prop-driven — holds no state.
// ─────────────────────────────────────────────────────────────────────────────



export default function BlogForm({ form, setForm, onReset, showHeader = true }) {
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
                        <h1 className="text-xl font-bold text-white">New Blog Post</h1>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Write and publish a blog post. JSON preview generated automatically.
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
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition appearance-none"
                        >
                            <option value="">Select category…</option>
                            {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <Field
                        label="Slug / ID"
                        value={form.slug}
                        onChange={(v) => set("slug", v)}
                        placeholder="auto-generated from title"
                        mono
                    />
                </div>

                <div onBlur={handleTitleBlur}>
                    <Field
                        label="Title"
                        value={form.title}
                        onChange={(v) => set("title", v)}
                        placeholder="10 Proven LinkedIn Strategies That Generated 50+ Leads…"
                    />
                </div>

                <Field
                    label="Short description"
                    textarea
                    rows={3}
                    value={form.excerpt}
                    onChange={(v) => set("excerpt", v)}
                    placeholder="A short 1–2 sentence summary shown in blog listing cards…"
                />
            </Section>

            {/* ── BANNER ─────────────────────────────────────────────────────── */}
            <Section title="Banner Image">
                <BlogBannerUploader
                    preview={form.bannerPreview}
                    onChange={(file, preview) =>
                        setForm((f) => ({ ...f, bannerFile: file, bannerPreview: preview }))
                    }
                />
            </Section>

            {/* ── CONTENT ────────────────────────────────────────────────────── */}
            <Section title="Blog Content">
                <BlogRichTextEditor
                    value={form.content}
                    onChange={(v) => set("content", v)}
                    slug={form.slug}
                />
            </Section>

            {/* ── METADATA ───────────────────────────────────────────────────── */}
            <Section title="Post Metadata">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Publish Date</label>
                        <input
                            type="date"
                            value={form.publishDate}
                            onChange={(e) => set("publishDate", e.target.value)}
                            style={{ colorScheme: "dark" }}
                            className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition"
                        />
                    </div>
                    <Field
                        label="Read Time"
                        value={form.readTime}
                        onChange={(v) => set("readTime", v)}
                        placeholder="5 min read"
                        hint="(auto-estimated if blank)"
                    />
                </div>
                <BlogTagsInput tags={form.tags} onChange={(v) => set("tags", v)} />

                <Field
                    label="Schema Structured Data (JSON-LD)"
                    textarea
                    rows={6}
                    value={form.schemaStructuredData}
                    onChange={(v) => set("schemaStructuredData", v)}
                    placeholder='{"@context": "https://schema.org", "@type": "BlogPosting", ...}'
                    hint="JSON-LD structured data for SEO (optional)"
                    mono
                />
            </Section>

            {/* ── AUTHORS ────────────────────────────────────────────────────── */}
            <Section title="Authors">
                <BlogAuthorSelector
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
                    placeholder="e.g. 10 Proven LinkedIn Strategies..."
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
                    placeholder="https://renoweb.com/blog/..."
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
                        <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-gray-900/20 transition-all hover:border-blue-500/50 hover:bg-gray-900/40 group relative overflow-hidden min-h-[160px]">
                            {form.seo?.ogImageUrl ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={form.seo.ogImageUrl}
                                        alt="OG Preview"
                                        className="w-full h-full object-contain absolute inset-0 z-0 p-2"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center gap-3">
                                        <label className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition backdrop-blur-md cursor-pointer">
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
                                    <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-3 text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition">
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