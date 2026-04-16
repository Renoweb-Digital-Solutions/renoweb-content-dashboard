"use client";

// components/cms/research-hub/RHtagsinput.js
// ─────────────────────────────────────────────────────────────────────────────
// Controlled tags input with amber/orange accent.
// Press Enter or comma to add; click × to remove.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

export default function RHTagsInput({ tags, onChange }) {
    const [input, setInput] = useState("");

    const addTag = () => {
        const t = input.trim().toLowerCase();
        if (t && !tags.includes(t)) onChange([...tags, t]);
        setInput("");
    };

    const removeTag = (t) => onChange(tags.filter((x) => x !== t));

    return (
        <div>
            <label className="block text-xs text-gray-400 mb-1.5 font-medium">
                Tags / Keywords <span className="text-gray-600">(optional)</span>
            </label>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full text-[11px] font-medium"
                        >
                            #{t}
                            <button
                                onClick={() => removeTag(t)}
                                className="text-amber-400/60 hover:text-red-400 transition"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag();
                        }
                    }}
                    placeholder="Type a keyword and press Enter…"
                    className="flex-1 bg-gray-900/50 border border-gray-800 focus:border-amber-500/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                />
                <button
                    onClick={addTag}
                    className="px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition"
                >
                    Add
                </button>
            </div>
        </div>
    );
}