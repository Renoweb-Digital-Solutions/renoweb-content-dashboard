"use client";

import { useRef, createRef } from "react";
import { Field, Section } from "../FormPrimitives";
import { PROJECT_CATEGORIES, slugify } from "./ProjectsConstants";
import BlogRichTextEditor from "../blogs/Blogrichtexteditor"; // Reusing the blog RTE

export default function ProjectsForm({ form, setForm, onReset }) {
    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
    const setSeo = (key, val) => setForm((f) => ({ ...f, seo: { ...f.seo, [key]: val } }));

    const ogFileInputRef = useRef(null);
    
    // Create an array of 5 refs for the 5 image inputs
    const imageInputRefs = useRef([...Array(5)].map(() => createRef()));

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

    const handleImageChange = (index, e) => {
        const file = e.target.files[0];
        if (file) {
            const newImageFiles = [...form.imageFiles];
            newImageFiles[index] = file;
            set("imageFiles", newImageFiles);

            const reader = new FileReader();
            reader.onload = (event) => {
                const newImagePreviews = [...form.imagePreviews];
                newImagePreviews[index] = event.target.result;
                set("imagePreviews", newImagePreviews);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = (index) => {
        const newImageFiles = [...form.imageFiles];
        newImageFiles[index] = null;
        set("imageFiles", newImageFiles);

        const newImagePreviews = [...form.imagePreviews];
        newImagePreviews[index] = null;
        set("imagePreviews", newImagePreviews);

        const newImages = [...form.images];
        newImages[index] = null;
        set("images", newImages);

        if (imageInputRefs.current[index]?.current) {
            imageInputRefs.current[index].current.value = "";
        }
    };

    return (
        <div>
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-white">
                        {form.id ? "Edit Project" : "New Project"}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Add a new project to the company portfolio.
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
                            {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
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
                        placeholder="Project title..."
                    />
                </div>

                <Field
                    label="Excerpt"
                    textarea
                    rows={3}
                    value={form.excerpt}
                    onChange={(v) => set("excerpt", v)}
                    placeholder="A short summary of the project..."
                />
            </Section>

            {/* ── GALLERY ────────────────────────────────────────────────────── */}
            <Section title="Project Gallery (min 2 required)">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="border-2 border-dashed border-gray-700/50 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-900/20 transition-all hover:border-blue-500/50 hover:bg-gray-900/40 group relative overflow-hidden min-h-[160px]">
                            {form.imagePreviews[index] ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={form.imagePreviews[index]}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-full object-contain absolute inset-0 z-0 p-2"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center gap-2">
                                        <label className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-600/30 transition backdrop-blur-md cursor-pointer">
                                            Replace
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(index, e)}
                                                className="hidden"
                                            />
                                        </label>
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition backdrop-blur-md"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center mb-2 text-gray-500 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-xs text-gray-400 font-medium mb-1">Image {index + 1}</p>
                                    <input
                                        type="file"
                                        ref={imageInputRefs.current[index]}
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(index, e)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            {/* ── DESCRIPTION ────────────────────────────────────────────────── */}
            <Section title="Project Description">
                <BlogRichTextEditor
                    value={form.content}
                    onChange={(v) => set("content", v)}
                    slug={form.slug || "new-project"}
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
                    <div className="flex items-center pl-1 sm:pl-4 mt-6 sm:mt-0">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={form.featured}
                                    onChange={(e) => set("featured", e.target.checked)}
                                />
                                <div className={`block w-11 h-6 rounded-full transition-colors duration-300 ${form.featured ? 'bg-blue-600' : 'bg-gray-800 group-hover:bg-gray-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${form.featured ? 'translate-x-5' : ''}`}></div>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-semibold transition-colors ${form.featured ? 'text-blue-400' : 'text-gray-300 group-hover:text-gray-200'}`}>Featured</span>
                            </div>
                        </label>
                    </div>
                </div>

                <Field
                    label="Schema Structured Data (JSON-LD)"
                    textarea
                    rows={6}
                    value={form.schemaStructuredData}
                    onChange={(v) => set("schemaStructuredData", v)}
                    placeholder='{"@context": "https://schema.org", "@type": "Project", ...}'
                    hint="JSON-LD structured data for SEO (optional)"
                    mono
                />
            </Section>

            {/* ── SEO SETTINGS ────────────────────────────────────────────────── */}
            <Section title="SEO Settings">
                <Field
                    label="Meta Title"
                    value={form.seo?.metaTitle || ""}
                    onChange={(v) => setSeo("metaTitle", v)}
                    placeholder="e.g. Project Title | Renoweb"
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
                    placeholder="https://renoweb.com/projects/..."
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
