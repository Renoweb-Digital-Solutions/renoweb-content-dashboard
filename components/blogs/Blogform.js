"use client";


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



export default function BlogForm({ form, setForm, onReset }) {
    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    const handleTitleBlur = () => {
        if (!form.slug && form.title) set("slug", slugify(form.title));
    };

    return (
        <div>
            {/* ── Header ─────────────────────────────────────────────────────── */}
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
        </div>
    );
}