"use client";

import { use } from "react";
import Link from "next/link";
import cmsConfig from "@/config/cms.json";

// ── Data ──────────────────────────────────────────────────────────────────────
// Quick Actions and Sections will be derived dynamically below

// ── Accent helpers ────────────────────────────────────────────────────────────
const accentMap = {
  blue: {
    border: "border-blue-600/40",
    bg: "bg-blue-600/10",
    text: "text-blue-400",
    dot: "bg-blue-600",
    hover: "hover:border-blue-600/60 hover:bg-blue-600/[0.07]",
    badge: "bg-blue-600/20 text-blue-400 border-blue-600/30",
    glow: "shadow-blue-600/10",
  },
  indigo: {
    border: "border-indigo-600/30",
    bg: "bg-indigo-600/10",
    text: "text-indigo-400",
    dot: "bg-indigo-500",
    hover: "hover:border-indigo-500/50 hover:bg-indigo-600/[0.07]",
    badge: "bg-indigo-600/20 text-indigo-400 border-indigo-600/30",
    glow: "shadow-indigo-600/10",
  },
  cyan: {
    border: "border-cyan-600/30",
    bg: "bg-cyan-600/10",
    text: "text-cyan-400",
    dot: "bg-cyan-500",
    hover: "hover:border-cyan-500/50 hover:bg-cyan-600/[0.07]",
    badge: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
    glow: "shadow-cyan-600/10",
  },
  violet: {
    border: "border-violet-600/30",
    bg: "bg-violet-600/10",
    text: "text-violet-400",
    dot: "bg-violet-500",
    hover: "hover:border-violet-500/50 hover:bg-violet-600/[0.07]",
    badge: "bg-violet-600/20 text-violet-400 border-violet-600/30",
    glow: "shadow-violet-600/10",
  },
  orange: {
    border: "border-orange-600/30",
    bg: "bg-orange-600/10",
    text: "text-orange-400",
    dot: "bg-orange-500",
    hover: "hover:border-orange-500/50 hover:bg-orange-600/[0.07]",
    badge: "bg-orange-600/20 text-orange-400 border-orange-600/30",
    glow: "shadow-orange-600/10",
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────
function SectionCard({ section }) {
  const a = accentMap[section.accent];
  const isLive = section.status === "live";

  const CardWrapper = isLive ? Link : "div";
  const wrapperProps = isLive ? { href: section.href } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className={`group relative text-left w-full block rounded-2xl border bg-gray-900/40 p-7 transition-all duration-300 ${a.border} ${isLive ? `${a.hover} cursor-pointer shadow-xl ${a.glow}` : "opacity-60 cursor-default"}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-xl ${a.bg} border ${a.border} flex items-center justify-center ${a.text} transition-transform duration-300 group-hover:scale-105`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          {isLive ? (
            <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${a.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${a.dot} animate-pulse`} />
              Live
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border border-gray-700 bg-gray-800/60 text-gray-500">
              Soon
            </span>
          )}
        </div>
      </div>

      {/* Tag */}
      <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5 ${a.text}`}>{section.tag}</p>

      {/* Title */}
      <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{section.label}</h3>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-6">{section.description}</p>

      {/* CTA */}
      <div className={`flex items-center gap-2 pt-5 border-t border-gray-800 text-sm font-semibold ${isLive ? a.text : "text-gray-600"} transition-all duration-200 ${isLive ? "group-hover:gap-3" : ""}`}>
        {isLive ? "Open editor" : "Coming soon"}
        {isLive && (
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        )}
      </div>

      {/* Hover top-border glow */}
      {isLive && (
        <span className={`absolute inset-x-0 top-0 h-px ${a.dot} opacity-0 group-hover:opacity-60 transition-opacity duration-300 rounded-t-2xl`} />
      )}
    </CardWrapper>
  );
}

function QuickActionButton({ action }) {
  return (
    <Link
      href={action.href}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-800 bg-gray-900/50 text-xs font-semibold text-gray-400 hover:border-blue-600/40 hover:text-blue-400 hover:bg-blue-600/[0.07] transition-all duration-200"
    >
      <span className="text-blue-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </span>
      {action.label}
    </Link>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Dashboard({ params }) {
  const resolvedParams = use(params);
  const moduleId = resolvedParams.module;
  const moduleConfig = cmsConfig.modules.find((m) => m.id === moduleId);

  if (!moduleConfig) {
    return <div className="p-8 text-white">Module not found</div>;
  }

  const sections = moduleConfig.submodules.map((submoduleId) => {
    const config = cmsConfig.submodules[submoduleId];
    return {
      ...config,
      href: `/cms/${moduleId}/${submoduleId}`,
      status: "live",
    };
  });

  const quickActions = sections.map((s) => ({
    label: `New ${s.label}`,
    href: s.href,
  }));

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-14">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-blue-600" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">Content Management</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
              {moduleConfig.name}{" "}
              <span className="text-blue-400">Content</span>
              <br />
              Operations Hub
            </h1>
            <p className="text-base text-gray-500 max-w-xl leading-relaxed">
              {moduleConfig.description}. Build, preview, and publish with one workflow.
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2 lg:justify-end">
            {quickActions.map((a) => (
              <QuickActionButton key={a.label} action={a} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-blue-600/40 via-gray-800 to-transparent mb-12" />

        {/* ── Section Cards ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {sections.map((s) => (
            <SectionCard key={s.id} section={s} />
          ))}
        </div>

        {/* ── Bottom Info Strip ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              ),
              title: "Firebase + Supabase",
              desc: "Media stored in Supabase Storage. Structured data in Firebase RTDB.",
            },
            {
              icon: (
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              title: "Live JSON Preview",
              desc: "Every form field generates a real-time JSON payload you can inspect and copy.",
            },
            {
              icon: (
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Slug Uniqueness Check",
              desc: "Duplicate slugs are detected before publishing — safe overwrites with confirmation.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-5 rounded-xl border border-gray-800 bg-gray-900/30"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <p className="text-xs font-bold text-white mb-1">{item.title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-gray-700">
            Renoweb CMS — Internal content tooling
          </span>
          <span className="text-xs text-gray-700 font-mono">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
}
