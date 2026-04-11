"use client";

// components/cms/ResultsEditor.js
import { Field } from "./FormPrimitives";

const SEVERITY_OPTIONS = ["critical", "warning", "info"];

function StatCard({ stat, index, onChange, onRemove, canRemove }) {
    const update = (key, val) => onChange({ ...stat, [key]: val });

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 space-y-3">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                    Stat #{index + 1}
                </span>
                <button
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="p-1 rounded text-gray-700 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {/* Stat value */}
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-widest">Value</label>
                    <input
                        value={stat.stat}
                        onChange={(e) => update("stat", e.target.value)}
                        placeholder="3,000%+"
                        className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2 text-sm text-blue-400 font-bold placeholder-gray-700 outline-none transition font-mono"
                    />
                </div>
                {/* Severity */}
                <div>
                    <label className="block text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-widest">Severity</label>
                    <select
                        value={stat.severity || "info"}
                        onChange={(e) => update("severity", e.target.value)}
                        className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2 text-xs text-gray-300 outline-none transition appearance-none"
                    >
                        {SEVERITY_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Label */}
            <div>
                <label className="block text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-widest">Label</label>
                <input
                    value={stat.label}
                    onChange={(e) => update("label", e.target.value)}
                    placeholder="Traffic growth on comparable rebuilt sites"
                    className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 outline-none transition"
                />
            </div>

            {/* Note (optional) */}
            <div>
                <label className="block text-[10px] text-gray-500 mb-1 font-medium uppercase tracking-widest">
                    Note <span className="text-gray-700">(optional)</span>
                </label>
                <input
                    value={stat.note || ""}
                    onChange={(e) => update("note", e.target.value)}
                    placeholder="Should be >90%"
                    className="w-full bg-black border border-gray-800 focus:border-blue-600/60 rounded-lg px-3 py-2 text-xs text-gray-400 placeholder-gray-700 outline-none transition"
                />
            </div>
        </div>
    );
}

export default function ResultsEditor({ results, onChange }) {
    const set = (key, val) => onChange({ ...results, [key]: val });

    const addStat = () => set("website_issues", [
        ...(results.website_issues || []),
        { stat: "", label: "", note: "", severity: "info" }
    ]);

    const removeStat = (i) => set(
        "website_issues",
        results.website_issues.filter((_, idx) => idx !== i)
    );

    const updateStat = (i, val) => {
        const next = [...results.website_issues];
        next[i] = val;
        set("website_issues", next);
    };

    return (
        <div className="space-y-6">
            {/* Conclusion text */}
            <Field
                label="Results / Conclusion"
                textarea
                rows={4}
                value={results.conclusion_text || ""}
                onChange={(v) => set("conclusion_text", v)}
                placeholder="The Diagnostic Blueprint exposed a website that was not just underperforming…"
            />

            {/* Stat cards section */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <label className="block text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        Key Stats / Metrics
                    </label>
                    <span className="text-[10px] text-gray-700">{(results.website_issues || []).length} stats</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(results.website_issues || []).map((stat, i) => (
                        <StatCard
                            key={i}
                            stat={stat}
                            index={i}
                            onChange={(val) => updateStat(i, val)}
                            onRemove={() => removeStat(i)}
                            canRemove={(results.website_issues || []).length > 1}
                        />
                    ))}
                </div>

                <button
                    onClick={addStat}
                    className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold mt-3 transition"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Stat
                </button>
            </div>

            {/* Preview of how it'll look */}
            {(results.website_issues || []).some((s) => s.stat) && (
                <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-3 font-medium">Live Preview</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(results.website_issues || []).filter((s) => s.stat).map((stat, i) => (
                            <div key={i} className={`rounded-lg p-3 border ${stat.severity === "critical"
                                ? "border-red-500/20 bg-red-500/5"
                                : stat.severity === "warning"
                                    ? "border-yellow-500/20 bg-yellow-500/5"
                                    : "border-blue-600/20 bg-blue-600/5"
                                }`}>
                                <p className={`text-lg font-bold font-mono ${stat.severity === "critical" ? "text-red-400"
                                    : stat.severity === "warning" ? "text-yellow-400"
                                        : "text-blue-400"
                                    }`}>{stat.stat}</p>
                                <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">{stat.label}</p>
                                {stat.note && <p className="text-[10px] text-gray-600 mt-1">{stat.note}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}