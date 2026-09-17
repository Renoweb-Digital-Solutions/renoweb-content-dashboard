"use client";

import { useState, use } from "react";
import PressForm from "@/components/press/PressForm";
import PressSidebarPreview from "@/components/press/PressSidebarPreview";
import PressManage from "@/components/press/PressManage";
import { useNetwork } from "@/lib/networkContext";
import { savePress, validatePressForm } from "@/lib/press";

const initForm = () => ({
    id: "",
    title: "",
    description: "",
    date: "",
    link: "",
    imageFile: null,
    imagePreview: null,
    imageUrl: "",
    logoFile: null,
    logoPreview: null,
    logoUrl: "",
    isFeatured: false,
    seo: {
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        ogTitle: "",
        ogDescription: "",
        ogImageFile: null,
        ogImageUrl: "",
    },
});

export function PressPageContent({ moduleId }) {
    const [activeTab, setActiveTab] = useState("new");
    const [form, setForm] = useState(initForm());
    const { loading, setLoading, setSaved } = useNetwork();

    const handleSave = async () => {
        const error = validatePressForm(form);
        if (error) {
            alert(error);
            return;
        }

        setLoading(true);
        try {
            const result = await savePress(moduleId, form, form.id);
            if (result?.error) {
                alert(result.error);
                return;
            }
            setSaved(true);
            setForm(initForm());
            setActiveTab("manage");
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to save press entry.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (entry) => {
        setForm({
            id: entry.id,
            title: entry.title,
            description: entry.description,
            date: entry.date,
            link: entry.link || "",
            imageFile: null,
            imagePreview: entry.imageUrl || null,
            imageUrl: entry.imageUrl || "",
            logoFile: null,
            logoPreview: entry.logoUrl || null,
            logoUrl: entry.logoUrl || "",
            isFeatured: entry.isFeatured || false,
            seo: entry.seo || {
                metaTitle: "",
                metaDescription: "",
                canonicalUrl: "",
                ogTitle: "",
                ogDescription: "",
                ogImageFile: null,
                ogImageUrl: "",
            },
        });
        setActiveTab("new");
    };

    const handleReset = () => {
        if (window.confirm("Reset all fields? This cannot be undone.")) {
            setForm(initForm());
        }
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-10">
            <div className="mb-8 flex w-fit items-center gap-1 rounded-xl border border-gray-800 bg-gray-900/50 p-1">
                <button
                    onClick={() => {
                        setForm(initForm());
                        setActiveTab("new");
                    }}
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
                    Manage Press
                </button>
            </div>

            {activeTab === "new" && (
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
                    {/* Left — form */}
                    <PressForm
                        form={form}
                        setForm={setForm}
                        onReset={handleReset}
                    />

                    {/* Right — sidebar */}
                    <PressSidebarPreview
                        form={form}
                        onSave={handleSave}
                        loading={loading}
                    />
                </div>
            )}

            {activeTab === "manage" && <PressManage moduleId={moduleId} onEdit={handleEdit} />}
        </div>
    );
}

export default function PressPage({ params }) {
    const resolvedParams = use(params);
    return <PressPageContent moduleId={resolvedParams.module} />;
}
