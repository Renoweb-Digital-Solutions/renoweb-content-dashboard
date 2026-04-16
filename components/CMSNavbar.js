"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNetwork } from "@/lib/networkContext";

const NAV_ITEMS = [
    { label: "Case Studies", href: "/cms/case_studies" },
    { label: "Blog", href: "/cms/blogs" },
    { label: "Research Hub", href: "/cms/research_hub" },
];

// ── Dropdown ─────────────────────────────────────────
function NavLink({ item, active }) {
    return (
        <Link
            href={item.href}
            className={`relative px-5 py-2 text-sm font-semibold tracking-wide transition-all duration-200 ${active
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
                }`}
        >
            {item.label}
            {active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 rounded-full" />
            )}
        </Link>
    );
}

// ── Main Navbar ──────────────────────────────────────
export default function CMSNavbar() {

    const { loading, saved } = useNetwork();
    const pathname = usePathname();

    const isActive = (href) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">
                        Renoweb <span className="text-blue-400">CMS</span>
                    </span>
                </Link>

                {/* Nav */}
                <nav className="flex items-center gap-2">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            active={isActive(item.href)}
                        />
                    ))}
                </nav>

                {/* Status */}
                {pathname === "/" ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs text-gray-400 font-medium">All systems operational</span>
                    </div>
                ) :
                    (<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-800 bg-gray-900/50">

                        {loading ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                                <span className="text-xs text-yellow-400 font-medium">Saving...</span>
                            </>
                        ) : saved ? (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-green-400 font-medium">Saved</span>
                            </>
                        ) : (
                            <>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                                <span className="text-xs text-gray-500 font-medium">Draft</span>
                            </>
                        )}

                    </div>)}

            </div>
        </header>
    );
}
