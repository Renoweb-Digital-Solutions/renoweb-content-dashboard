"use client";

// components/cms/CMSNavbar.js

const NavTab = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${active ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
    >
        {label}
        {active && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
        )}
    </button>
);

export default function CMSNavbar({ activeTab, setActiveTab, isSaved }) {
    return (
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">
                        Renoweb <span className="text-blue-400">CMS</span>
                    </span>
                </div>

                {/* Nav tabs */}
                <nav className="flex items-center gap-1">
                    <NavTab label="Case Studies" active={activeTab === "case-studies"} onClick={() => setActiveTab("case-studies")} />
                    <NavTab label="Blogs" active={activeTab === "blogs"} onClick={() => setActiveTab("blogs")} />
                    <NavTab label="Research Hub" active={activeTab === "research"} onClick={() => setActiveTab("research")} />
                </nav>

                {/* Save status */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isSaved ? "bg-green-400" : "bg-gray-700"}`} />
                    <span className="text-xs text-gray-500">{isSaved ? "Saved" : "Draft"}</span>
                </div>
            </div>
        </header>
    );
}