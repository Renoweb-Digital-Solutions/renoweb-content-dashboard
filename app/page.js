"use client";

// app/cms/page.js  (or pages/cms.js)
// ──────────────────────────────────────────────────────────────────────────────
// This is the ONLY file that holds state. All child components are pure / prop-
// driven so they are individually testable and replaceable.
// ──────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

// ── Internal components ────────────────────────────────────────────────────────
import CMSNavbar from "@/components/cms/CMSNavbar";
import CaseStudyForm from "@/components/cms/CaseStudyForm";
import SidebarPreview from "@/components/cms/SidebarPreview";
import ComingSoon from "@/components/cms/ComingSoon";
import JsonModal from "@/components/cms/JsonModal";

// ── Shared constants / helpers ─────────────────────────────────────────────────
import { initCaseStudyForm } from "@/components/constants";


// ── Firebase setup ──────────────────────────────────────────────────────────
import { ref as dbRef, set, get } from "firebase/database";

import { supabase } from "@/lib/supabase";
import { rtdb } from "@/lib/firebase";

// ──────────────────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState("case-studies");
  const [form, setForm] = useState(initCaseStudyForm());
  const [showJson, setShowJson] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Save / publish ──────────────────────────────────────────────────────────
  const handleSave = async () => {
    try {
      setLoading(true);

      // ── VALIDATION ───────────────────────────────
      const requiredChecks = [
        form.category,
        form.title,
        form.bannerPreview,
        form.about_client,
        form.challenges.some(Boolean),
        form.solutions.approach,
        form.solutions.process.some(Boolean),
        form.conclusion,
        form.takeaway,
        form.author,
      ];

      if (requiredChecks.some((v) => !v)) {
        alert("Please complete all required fields before publishing.");
        return;
      }

      if (!form.id) {
        alert("Title required to generate slug.");
        return;
      }

      // ── SLUG UNIQUENESS CHECK ────────────────────
      const snapshot = await get(dbRef(rtdb, `/case-studies/${form.id}`));

      if (snapshot.exists()) {
        const overwrite = window.confirm(
          "A case study with this slug already exists. Overwrite?"
        );
        if (!overwrite) return;
      }

      // ── BANNER UPLOAD ────────────────────────────
      let bannerUrl = form.bannerUrl || "";

      if (form.bannerFile) {
        const fileExt = form.bannerFile.name.split(".").pop();
        const fileName = `case-studies/${form.id}.${fileExt}`;

        const { error } = await supabase.storage
          .from("contentimages")
          .upload(fileName, form.bannerFile, {
            upsert: true,
          });

        if (error) throw error;

        const { data } = supabase.storage
          .from("contentimages")
          .getPublicUrl(fileName);

        bannerUrl = data.publicUrl;
      }

      // ── PAYLOAD ─────────────────────────────────
      const payload = {
        id: form.id,
        category: form.category,
        title: form.title,
        about_client: form.about_client,
        challenges: form.challenges.filter(Boolean),
        solutions: {
          approach: form.solutions.approach,
          process: form.solutions.process.filter(Boolean),
        },
        conclusion: form.conclusion,
        takeaway: form.takeaway,
        link: form.link,
        author: form.author,
        coAuthor: form.coAuthor || null,
        bannerUrl,
        createdAt: new Date().toISOString(),
      };

      // ── SAVE TO firebase ───────────────────────
      await set(dbRef(rtdb, `case-studies/${form.id}`), payload);

      // ── SUCCESS ────────────────────────────────
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);

    } catch (err) {
      console.error(err);
      alert("Failed to publish case study. Check console.");
    } finally {
      setLoading(false);
    }
  };

  // ── Reset ───────────────────────────────────────────────────────────────────
  const handleReset = () => {
    if (window.confirm("Reset all fields? This cannot be undone.")) {
      setForm(initCaseStudyForm());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <CMSNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSaved={saved}
      />

      {/* ── Page body ──────────────────────────────────────────────────────── */}
      {activeTab === "case-studies" ? (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">

          {/* Left — form */}
          <CaseStudyForm
            form={form}
            setForm={setForm}
            onReset={handleReset}
          />

          {/* Right — live sidebar */}
          <SidebarPreview
            form={form}
            onPreviewJson={() => setShowJson(true)}
            onSave={handleSave}
            loading={loading}
          />
        </div>
      ) : activeTab === "blogs" ? (
        <ComingSoon name="Blogs" />
      ) : (
        <ComingSoon name="Research Hub" />
      )}

      {/* ── JSON modal ─────────────────────────────────────────────────────── */}
      {showJson && (
        <JsonModal
          data={form}
          onClose={() => setShowJson(false)}
        />
      )}
    </div>
  );
}