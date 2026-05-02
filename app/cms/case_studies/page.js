"use client";

import { useState } from "react";

import CaseStudyForm from "@/components/case_studies/CaseStudyForm";
import CaseStudyManage from "@/components/case_studies/CaseStudyManage";
import JsonModal from "@/components/case_studies/JsonModal";
import SidebarPreview from "@/components/case_studies/SidebarPreview";
import { initCaseStudyForm } from "@/components/constants";
import { saveCaseStudy } from "@/lib/caseStudies";
import { useNetwork } from "@/lib/networkContext";

export function CaseStudiesPageContent({ initialTab = "new" }) {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [form, setForm] = useState(initCaseStudyForm());
    const [showJson, setShowJson] = useState(false);

    const { loading, setLoading, setSaved } = useNetwork();

    const flashSaved = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const result = await saveCaseStudy(form, {
                confirmOverwrite: async () => window.confirm("A case study with this slug already exists. Overwrite?"),
            });

            if (result?.cancelled) {
                return;
            }

            setForm(initCaseStudyForm());
            flashSaved();
        } catch (error) {
            console.error(error);
            alert(error.message || "Failed to publish case study. Check console.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm("Reset all fields? This cannot be undone.")) {
            setForm(initCaseStudyForm());
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-8 flex w-fit items-center gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-1">
                    <button
                        onClick={() => setActiveTab("new")}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === "new"
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
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
                            ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                            : "text-gray-500 hover:text-gray-300"
                            }`}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        Manage Case Studies
                    </button>
                </div>

                {activeTab === "new" && (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
                        <CaseStudyForm
                            form={form}
                            setForm={setForm}
                            onReset={handleReset}
                        />

                        <SidebarPreview
                            form={form}
                            onPreviewJson={() => setShowJson(true)}
                            onSave={handleSave}
                            loading={loading}
                        />
                    </div>
                )}

                {activeTab === "manage" && <CaseStudyManage />}
            </div>

            {showJson && (
                <JsonModal
                    data={form}
                    onClose={() => setShowJson(false)}
                />
            )}
        </div>
    );
}

export default function CaseStudies() {
    return <CaseStudiesPageContent />;
}
