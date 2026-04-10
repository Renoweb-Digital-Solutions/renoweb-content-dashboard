"use client";

// components/cms/FormPrimitives.js
// Shared small UI pieces: Section wrapper, Field input/textarea, ListEditor

// ── Section ──────────────────────────────────────────────────────────────────
export function Section({ title, children }) {
    return (
        <div className="mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blue-400 mb-4 flex items-center gap-2">
                <span className="w-6 h-px bg-blue-600" />
                {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

// ── Field ─────────────────────────────────────────────────────────────────────
export function Field({ label, value, onChange, placeholder, textarea, rows = 3, mono }) {
    const base =
        "w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 outline-none transition";

    return (
        <div>
            {label && (
                <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
            )}
            {textarea ? (
                <textarea
                    rows={rows}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${base} resize-none ${mono ? "font-mono text-xs" : ""}`}
                />
            ) : (
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`${base} ${mono ? "font-mono text-xs" : ""}`}
                />
            )}
        </div>
    );
}

// ── ListEditor ────────────────────────────────────────────────────────────────
export function ListEditor({ items, onChange, placeholder }) {
    const add = () => onChange([...items, ""]);
    const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
    const update = (i, val) => { const n = [...items]; n[i] = val; onChange(n); };

    return (
        <div className="space-y-2">
            {items.map((item, i) => (
                <div key={i} className="flex gap-2 items-start">
                    <span className="mt-3 text-xs text-blue-400 font-mono font-bold w-5 flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <textarea
                        rows={2}
                        value={item}
                        onChange={(e) => update(i, e.target.value)}
                        placeholder={placeholder}
                        className="flex-1 bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none resize-none transition"
                    />
                    <button
                        onClick={() => remove(i)}
                        disabled={items.length === 1}
                        className="mt-2 p-1.5 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            ))}
            <button
                onClick={add}
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-semibold mt-2 transition"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add item
            </button>
        </div>
    );
}