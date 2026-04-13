"use client";

// components/cms/blog/BlogTagsInput.js
// ─────────────────────────────────────────────────────────────────────────────
// Controlled tags input. Press Enter or comma to add a tag; click × to remove.
// Props:
//   tags     {string[]}  — current tags array
//   onChange {function}  — called with the updated array
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";

export default function BlogTagsInput({ tags, onChange }) {
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
                Tags <span className="text-gray-600">(optional)</span>
            </label>

            {/* Tag pills */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((t) => (
                        <span
                            key={t}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-600/10 border border-blue-600/30 text-blue-400 rounded-full text-[11px] font-medium"
                        >
                            #{t}
                            <button
                                onClick={() => removeTag(t)}
                                className="text-blue-400/60 hover:text-red-400 transition"
                            >
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input */}
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
                    placeholder="Type a tag and press Enter…"
                    className="flex-1 bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                />
                <button
                    onClick={addTag}
                    className="px-3 py-2.5 rounded-lg bg-blue-600/10 border border-blue-600/30 text-blue-400 text-xs font-semibold hover:bg-blue-600/20 transition"
                >
                    Add
                </button>
            </div>
        </div>
    );
}