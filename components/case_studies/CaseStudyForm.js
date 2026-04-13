"use client";

// components/cms/CaseStudyForm.js
import { CATEGORIES, slugify } from "../constants";
import AuthorSelector from "./AuthorSelector";
import BannerUploader from "./BannerUploader";
import BeforeAfterEditor from "./Beforeaftereditor";

import { Field, ListEditor, Section } from "../FormPrimitives";
import ResultsEditor from "./Resultseditor";
import UiUxIssuesEditor from "./Uiuxissueseditor";


export default function CaseStudyForm({ form, setForm, onReset }) {
    // generic top-level setter
    const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

    // auto-generate slug + link from title on blur
    const handleTitleBlur = () => {
        if (!form.id && form.title) set("id", slugify(form.title));
        if (!form.link && form.title) set("link", `/case-studies/${slugify(form.title)}`);
    };

    return (
        <div>
            {/* Page heading */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-xl font-bold text-white">New Case Study</h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Fill in the details below. A JSON preview is generated automatically.
                    </p>
                </div>
                <button
                    onClick={onReset}
                    className="text-xs text-gray-600 hover:text-gray-300 transition px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700"
                >
                    Reset all
                </button>
            </div>

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
        </div>
    );
}