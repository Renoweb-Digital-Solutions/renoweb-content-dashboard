"use client";

import { useState } from "react";

const NavDropdown = ({ label, active, onClick, items }) => {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            {/* Parent tab */}
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

            {/* Dropdown */}
            <div
                className={`absolute left-0 mt-2 w-52 bg-black border border-gray-800 rounded-xl shadow-xl transition-all duration-200 ${open ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                    }`}
            >
                <div className="py-2">
                    {items.map((item, i) => (
                        <button
                            key={i}
                            onClick={item.onClick}
                            className="w-full text-left px-4 py-2 text-xs text-gray-400 hover:text-white hover:bg-gray-900 transition"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

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

                {/* Nav with dropdowns */}
                <nav className="flex items-center gap-2">

                    <NavDropdown
                        label="Case Studies"
                        active={activeTab === "case-studies"}
                        onClick={() => setActiveTab("case-studies")}
                        items={[
                            { label: "Create New", onClick: () => setActiveTab("case-studies") },
                            { label: "Manage Case Studies", onClick: () => console.log("manage case studies") },
                        ]}
                    />

                    <NavDropdown
                        label="Blogs"
                        active={activeTab === "blogs"}
                        onClick={() => setActiveTab("blogs")}
                        items={[
                            { label: "Create Blog", onClick: () => setActiveTab("blogs") },
                            { label: "Manage Blogs", onClick: () => console.log("manage blogs") },
                        ]}
                    />

                    <NavDropdown
                        label="Research Hub"
                        active={activeTab === "research"}
                        onClick={() => setActiveTab("research")}
                        items={[
                            { label: "Create Article", onClick: () => setActiveTab("research") },
                            { label: "Manage Research Articles", onClick: () => console.log("manage research") },
                        ]}
                    />

                </nav>

                {/* Save status */}
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isSaved ? "bg-green-400" : "bg-gray-700"
                        }`} />
                    <span className="text-xs text-gray-500">
                        {isSaved ? "Saved" : "Draft"}
                    </span>
                </div>
            </div>
        </header>
    );
}