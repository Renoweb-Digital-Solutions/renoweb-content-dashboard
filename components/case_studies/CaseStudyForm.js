"use client";

import { useRef } from "react";

// components/cms/CaseStudyForm.js
import { CATEGORIES, slugify } from "../constants";
import AuthorSelector from "./AuthorSelector";
import BannerUploader from "./BannerUploader";
import BeforeAfterEditor from "./Beforeaftereditor";

import { Field, ListEditor, Section } from "../FormPrimitives";
import ResultsEditor from "./Resultseditor";
import UiUxIssuesEditor from "./Uiuxissueseditor";


export default function CaseStudyForm({
    form,
    setForm,
    onReset,
    title = "New Case Study",
    description = "Fill in the details below. A JSON preview is generated automatically.",
    showHeader = true,
}) {
    // generic top-level setter
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

    // auto-generate slug + link from title on blur
    const handleTitleBlur = () => {
        if (!form.id && form.title) set("id", slugify(form.title));
        if (!form.link && form.title) set("link", `/case-studies/${slugify(form.title)}`);
    };

    return (
        <div>
            {/* Page heading */}
            {showHeader && (
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white">{title}</h1>
                        <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                    </div>
                    <button
                        onClick={onReset}
                        className="rounded-lg border border-gray-800 px-3 py-1.5 text-xs text-gray-600 transition hover:border-gray-700 hover:text-gray-300"
                    >
                        Reset all
                    </button>
                </div>
            )}

            {/* ── BASICS ─────────────────────────────────────────────────── */}
            <Section title="Basics">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Category */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1.5 font-medium">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => set("category", e.target.value)}
                            className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-3 text-sm text-gray-200 outline-none transition appearance-none"
                        >
                            <option value="">Select category…</option>
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    {/* Slug */}
                    <Field
                        label="Slug / ID"
                        value={form.id}
                        onChange={(v) => set("id", v)}
                        placeholder="auto-generated from title"
                        mono
                    />
                </div>

                {/* Title — blur triggers slug generation */}
                <div onBlur={handleTitleBlur}>
                    <Field
                        label="Title"
                        value={form.title}
                        onChange={(v) => set("title", v)}
                        placeholder="How We Achieved 5+ Qualified Demo Bookings…"
                    />
                </div>
                <button
                    onClick={() => set("featured", !form.featured)}
                    className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${form.featured ? "border-blue-500/50 bg-blue-500/10 text-blue-300" : "border-gray-800 bg-gray-900/50 text-gray-500 hover:border-gray-700"}`}
                >
                    <div className={`flex h-4 w-4 items-center justify-center rounded border ${form.featured ? "border-blue-400 bg-blue-400" : "border-gray-700"}`}>
                        {form.featured && (
                            <svg className="h-2.5 w-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                    Featured case study
                </button>
            </Section>

            {/* ── BANNER ─────────────────────────────────────────────────── */}
            <Section title="Banner Image">
                <BannerUploader
                    preview={form.bannerPreview}
                    onChange={(file, preview) =>
                        setForm((f) => ({ ...f, bannerFile: file, bannerPreview: preview }))
                    }
                />
            </Section>

            {/* ── ABOUT CLIENT ───────────────────────────────────────────── */}
            <Section title="About the Client">
                <Field
                    textarea
                    rows={4}
                    value={form.about_client}
                    onChange={(v) => set("about_client", v)}
                    placeholder="A short description of the client's background and situation before engagement…"
                />
            </Section>

            {/* ── CHALLENGES ─────────────────────────────────────────────── */}
            <Section title="Challenges">
                <ListEditor
                    items={form.challenges}
                    onChange={(v) => set("challenges", v)}
                    placeholder="Describe a specific challenge the client faced…"
                />
            </Section>

            {/* ── UI/UX ISSUES ── OPTIONAL ────────────────────────────────── */}
            <Section title="UI/UX & Content Issues — Documented">
                <p className="text-[11px] text-gray-600 -mt-1 mb-1">
                    Optional — document specific UI/UX problems with screenshots. Great for Dev OS case studies.
                </p>
                <UiUxIssuesEditor
                    issues={form.uiux_issues || [{ id: "", title: "", description: "", beforeCaption: "", beforeImageFile: null, beforeImagePreview: null }]}
                    onChange={(v) => set("uiux_issues", v)}
                />
            </Section>

            {/* ── SOLUTIONS ──────────────────────────────────────────────── */}
            <Section title="Solutions">
                <Field
                    label="Approach"
                    textarea
                    rows={3}
                    value={form.solutions.approach}
                    onChange={(v) => set("solutions", { ...form.solutions, approach: v })}
                    placeholder="High-level approach — what was the overall strategy?"
                />
                <div>
                    <label className="block text-xs text-gray-400 mb-2 font-medium">Process Steps</label>
                    <ListEditor
                        items={form.solutions.process}
                        onChange={(v) => set("solutions", { ...form.solutions, process: v })}
                        placeholder="Describe a specific step in the process…"
                    />
                </div>
            </Section>

            {/* ── RESULTS ────────────────────────────────────────────────── */}
            <Section title="Results & Takeaway">
                <Field
                    label="Conclusion / Results"
                    textarea
                    rows={4}
                    value={form.conclusion}
                    onChange={(v) => set("conclusion", v)}
                    placeholder="What were the measurable outcomes? What changed for the client?"
                />
                <Field
                    label="Key Takeaway"
                    textarea
                    rows={3}
                    value={form.takeaway}
                    onChange={(v) => set("takeaway", v)}
                    placeholder="The one-line lesson from this case study…"
                />
            </Section>

            {/* ── RESULTS STATS ── OPTIONAL ───────────────────────────────── */}
            <Section title="Results — Stats & Metrics">
                <p className="text-[11px] text-gray-600 -mt-1 mb-1">
                    Optional — add quantified stats shown as metric cards in the results section.
                </p>
                <ResultsEditor
                    results={{
                        conclusion_text: form.results_conclusion || "",
                        website_issues: form.website_issues || [],
                    }}
                    onChange={(v) => setForm((f) => ({
                        ...f,
                        results_conclusion: v.conclusion_text,
                        website_issues: v.website_issues,
                    }))}
                />
            </Section>

            {/* ── BEFORE / AFTER SHOWCASE ── OPTIONAL ─────────────────────── */}
            <Section title="Before & After Showcase">
                <p className="text-[11px] text-gray-600 -mt-1 mb-1">
                    Optional — full-page before/after screenshots for the visual transformation section.
                </p>
                <BeforeAfterEditor
                    showcase={form.beforeAfterShowcase || { before: {}, after: {} }}
                    onChange={(v) => set("beforeAfterShowcase", v)}
                />
            </Section>

            {/* ── LINK ───────────────────────────────────────────────────── */}
            <Section title="URL / Link">
                <Field
                    label="Case Study URL path"
                    value={form.link}
                    onChange={(v) => set("link", v)}
                    placeholder="/case-studies/your-slug"
                    mono
                />
            </Section>

            {/* ── AUTHORS ────────────────────────────────────────────────── */}
            <Section title="Authors">
                <AuthorSelector
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
                    placeholder="e.g. Renoweb Case Study: Lead Gen..."
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
                    placeholder="https://renoweb.com/case-studies/..."
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
