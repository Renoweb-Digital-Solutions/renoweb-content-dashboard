"use client";

// components/cms/research-hub/ResearchHubPage.js
// ─────────────────────────────────────────────────────────────────────────────
// Root page component for the Research Hub CMS tab.
// Two sub-tabs: "New Entry" (upload form + sidebar) and "Manage" (list view).
// Amber/orange accent throughout.
//
// Firebase Storage upload logic is commented in handleSave — activate when
// credentials are ready (same pattern as BlogPage).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

import RHForm from "@/components/research/RHform";
import RHJsonModal from "@/components/research/RHjsonmodal";
import RHManage from "@/components/research/RHmanage";
import RHSidebarPreview from "@/components/research/RHsidebarpreview";
import { initRHForm, slugify } from "@/components/research/RHconstants";


export default function ResearchHubPage() {
    const [activeTab, setActiveTab] = useState("new"); // "new" | "manage"
    const [form, setForm] = useState(initRHForm());
    const [loading, setLoading] = useState(false);
    const [showJson, setShowJson] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");

    // ── Reset ─────────────────────────────────────────────────────────────────
    const handleReset = () => {
        if (window.confirm("Reset all fields? This cannot be undone.")) {
            setForm(initRHForm());
        }
    };

    // ── Save / Publish ────────────────────────────────────────────────────────
    const handleSave = async () => {
        const id = form.slug || slugify(form.title) || `rh-${Date.now()}`;
        setLoading(true);
        try {
            // ── Firebase Storage banner upload (activate when credentials ready) ──
            // let bannerUrl = null;
            // if (form.bannerFile) {
            //     const storage = getStorage();
            //     const ext = form.bannerFile.name.split(".").pop();
            //     const storageRef = ref(storage, `contentimages/research-hub-banners/${id}.${ext}`);
            //     await uploadBytes(storageRef, form.bannerFile);
            //     bannerUrl = await getDownloadURL(storageRef);
            // }

            // ── Firestore write (activate when credentials ready) ──────────────
            // await setDoc(doc(db, "researchHub", id), {
            //     ...form,
            //     id,
            //     bannerUrl,
            //     bannerFile: null,
            //     bannerPreview: null,
            //     updatedAt: serverTimestamp(),
            // });

            console.log("Research Hub entry ready to publish:", { ...form, id });
            setSuccessMsg("Research entry ready — connect Firebase to publish live.");
            setTimeout(() => setSuccessMsg(""), 4000);
        } catch (err) {
            console.error("Publish failed:", err);
            setSuccessMsg("Error — check console for details.");
            setTimeout(() => setSuccessMsg(""), 4000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative isolate overflow-hidden">
            <div className="pointer-events-none absolute inset-0 -z-10 w-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_38%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.1),transparent_34%)]" />
                <div className="absolute left-[-8%] top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.34),rgba(251,146,60,0.14)_46%,transparent_72%)] blur-3xl [animation:researchBlobFloat_11s_ease-in-out_infinite]" />
                <div className="absolute right-[-4%] top-36 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(249,115,22,0.26),rgba(245,158,11,0.12)_44%,transparent_72%)] blur-3xl [animation:researchBlobFloat_14s_ease-in-out_infinite] [animation-delay:-4s]" />
                <div className="absolute left-[18%] bottom-16 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(253,224,71,0.16),rgba(249,115,22,0.12)_45%,transparent_72%)] blur-3xl [animation:researchBlobFloat_13s_ease-in-out_infinite] [animation-delay:-7s]" />
                <div className="absolute right-[22%] bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.18),rgba(245,158,11,0.08)_46%,transparent_72%)] blur-3xl [animation:researchBlobFloat_12s_ease-in-out_infinite] [animation-delay:-2s]" />
            </div>
            <div className="max-w-7xl mx-auto px-6 py-10 relative">
            {/* ── Flash banner ─────────────────────────────────────────────────── */}
            {successMsg && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 bg-gray-900 border border-amber-500/40 rounded-xl shadow-2xl">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm text-white font-medium">{successMsg}</span>
                </div>
            )}

            {/* ── Sub-tab switcher ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-1 mb-8 bg-gray-900/50 border border-gray-800 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab("new")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "new"
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Entry
                </button>
                <button
                    onClick={() => setActiveTab("manage")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === "manage"
                        ? "bg-amber-600 text-white shadow-lg shadow-amber-600/20"
                        : "text-gray-500 hover:text-gray-300"
                        }`}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    Manage Research Hub
                </button>
            </div>

            {/* ── New Entry Tab ────────────────────────────────────────────────── */}
            {activeTab === "new" && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
                    {/* Left — form */}
                    <div>
                        <RHForm form={form} setForm={setForm} onReset={handleReset} />
                    </div>

                    {/* Right — sidebar */}
                    <div>
                        <RHSidebarPreview
                            form={form}
                            onPreviewJson={() => setShowJson(true)}
                            onSave={handleSave}
                            loading={loading}
                        />
                    </div>
                </div>
            )}

            {/* ── Manage Tab ───────────────────────────────────────────────────── */}
            {activeTab === "manage" && <RHManage />}

            {/* ── JSON Modal ───────────────────────────────────────────────────── */}
            {showJson && (
                <RHJsonModal data={form} onClose={() => setShowJson(false)} />
            )}
            </div>
        </div>
    );
}
