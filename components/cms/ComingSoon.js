"use client";

// components/cms/ComingSoon.js

export default function ComingSoon({ name }) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-40">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-600/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{name}</h2>
            <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                This section is coming soon. The{" "}
                <span className="text-blue-400">Case Studies</span> uploader is fully ready — check it out.
            </p>

            {/* Dots decoration */}
            <div className="flex gap-2 mt-8">
                <span className="w-2 h-2 rounded-full bg-gray-800" />
                <span className="w-2 h-2 rounded-full bg-blue-600/40" />
                <span className="w-2 h-2 rounded-full bg-gray-800" />
            </div>
        </div>
    );
}