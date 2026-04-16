"use client";


// components/cms/research-hub/RHauthorselector.js
// ─────────────────────────────────────────────────────────────────────────────
// Primary author + optional co-author selector.
// Amber/orange accent — mirrors BlogAuthorSelector pattern.
// ─────────────────────────────────────────────────────────────────────────────

import { AUTHORS } from "./RHconstants";


function AuthorInitials({ name }) {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

function AuthorCard({ author, selected, onSelect }) {
    const isSelected = selected?.id === author.id;
    return (
        <button
            onClick={() => onSelect(author)}
            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 w-full ${isSelected
                ? "border-amber-500/50 bg-amber-500/10"
                : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                }`}
        >
            <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${isSelected
                ? "bg-gradient-to-br from-amber-500/30 to-orange-900/40 border-amber-700/50 text-amber-400"
                : "bg-gradient-to-br from-amber-600/20 to-orange-900/30 border-gray-800 text-amber-500"
                }`}>
                {author.image ? (
                    <img src={author.image} alt={author.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                    <AuthorInitials name={author.name} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{author.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{author.role.split(",")[0]}</p>
            </div>
            {isSelected && (
                <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd" />
                </svg>
            )}
        </button>
    );
}

export default function RHAuthorSelector({
    primaryAuthor,
    coAuthor,
    onPrimaryChange,
    onCoAuthorChange,
}) {
    return (
        <div className="space-y-5">
            {/* Primary */}
            <div>
                <label className="block text-xs text-gray-400 mb-2 font-medium">Primary Researcher / Author</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {AUTHORS.map((a) => (
                        <AuthorCard key={a.id} author={a} selected={primaryAuthor} onSelect={onPrimaryChange} />
                    ))}
                </div>
            </div>

            {/* Co-Author */}
            <div>
                <label className="block text-xs text-gray-400 mb-2 font-medium">
                    Co-Researcher <span className="text-gray-600">(optional)</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <button
                        onClick={() => onCoAuthorChange(null)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${!coAuthor
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                            }`}
                    >
                        <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs flex-shrink-0">
                            —
                        </div>
                        <span className="text-xs text-gray-400">None</span>
                    </button>

                    {AUTHORS.map((a) => (
                        <AuthorCard key={a.id} author={a} selected={coAuthor} onSelect={onCoAuthorChange} />
                    ))}
                </div>
            </div>
        </div>
    );
}