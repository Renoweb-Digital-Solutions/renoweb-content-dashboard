"use client";

// Entry point for the Blog CMS tab. Owns all state; every child is prop-driven.

import { useState } from "react";

import BlogForm from "@/components/blogs/Blogform";
import BlogManage from "@/components/blogs/Blogmanage";
import BlogSidebarPreview from "@/components/blogs/Blogsidebarpreview";
import BlogJsonModal from "@/components/blogs/Blogjsonmodal";
import { initBlogForm } from "@/components/blogs/Blogconstants";

import { useNetwork } from "@/lib/networkContext";
import { saveBlog } from "@/lib/blogs";


export function BlogPageContent({ initialTab = "new" }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [form, setForm] = useState(initBlogForm());
    const [showJson, setShowJson] = useState(false);

    const { loading, setLoading, setSaved } = useNetwork();

    // ── Save / Publish ──────────────────────────────────────────────────────────
    const handleSave = async () => {
        try {
            setLoading(true);

            const result = await saveBlog(form, {
                confirmOverwrite: async () =>
                    window.confirm("A blog post with this slug already exists. Overwrite?"),
            });

            if (result?.cancelled) {
                return;
            }

            setSaved(true);
            setForm(initBlogForm());
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to publish blog post. Check console.");
        } finally {
            setLoading(false);
        }
    };

    // ── Reset ───────────────────────────────────────────────────────────────────
    const handleReset = () => {
        if (window.confirm("Reset all fields? This cannot be undone.")) {
            setForm(initBlogForm());
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────────
    return (
        <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="mb-8 flex w-fit items-center gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-1">
                <button
                    onClick={() => setActiveTab("new")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === "new"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Entry
                </button>
                <button
                    onClick={() => setActiveTab("manage")}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === "manage"
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Manage Blogs
                </button>
            </div>

            {activeTab === "new" && (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">

            {/* Left — form */}
            <BlogForm
                form={form}
                setForm={setForm}
                onReset={handleReset}
            />

            {/* Right — sidebar */}
            <BlogSidebarPreview
                form={form}
                onPreviewJson={() => setShowJson(true)}
                onSave={handleSave}
                loading={loading}
            />

                </div>
            )}

            {activeTab === "manage" && <BlogManage />}

            {/* JSON modal */}
            {showJson && (
                <BlogJsonModal
                    data={form}
                    onClose={() => setShowJson(false)}
                />
            )}
        </div>
    );
}

export default function BlogPage() {
    return <BlogPageContent />;
}
