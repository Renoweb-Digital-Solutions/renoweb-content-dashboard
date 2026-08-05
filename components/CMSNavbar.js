"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNetwork } from "@/lib/networkContext";
import { useAuth } from "@/lib/AuthContext";

const NAV_ITEMS = [
    {
        label: "Dashboard",
        href: "/cms/dashboard",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm-10 9a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zm10-2a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5z" />
            </svg>
        ),
    },
    {
        label: "Case Studies",
        href: "/cms/case_studies",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        label: "Blog",
        href: "/cms/blogs",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
    },
    {
        label: "Research Hub",
        href: "/cms/research_hub",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        label: "Authors",
        href: "/cms/authors",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 4a4 4 0 100 8 4 4 0 000-8zm0 10c-4.418 0-8 1.79-8 4v2h16v-2c0-2.21-3.582-4-8-4z" />
            </svg>
        ),
    },
    {
        label: "Projects",
        href: "/cms/projects",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
        ),
    },
    {
        label: "Press & Media",
        href: "/cms/press",
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
            </svg>
        ),
    },
];

// ── Section Switcher (Desktop) ───────────────────────
function SectionSwitcher({ items, pathname }) {
    const [open, setOpen] = useState(false);
    
    const activeItem = items.find(item => item.href !== "/cms/dashboard" && (pathname === item.href || pathname.startsWith(item.href + "/"))) || items.find(i => i.href === "/cms/dashboard");
    
    if (!activeItem) return null;

    return (
        <div className="relative hidden lg:block">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] transition-all border border-white/[0.05]"
            >
                <span className="text-blue-400">{activeItem.icon}</span>
                {activeItem.label}
                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            
            {open && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 top-full mt-2 w-56 z-50 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl overflow-hidden py-2">
                        {items.map((item) => {
                            const isActive = item.href === activeItem.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                                        isActive
                                            ? "text-blue-400 bg-blue-500/[0.08]"
                                            : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                    }`}
                                >
                                    <span className={isActive ? "text-blue-400" : "text-gray-500"}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// ── Status pill ──────────────────────────────────────
function StatusPill({ loading, saved, pathname }) {
    if (pathname === "/cms/dashboard") {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-800 bg-gray-900/60">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-gray-400 font-medium">Online</span>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                <span className="text-[11px] text-yellow-400 font-medium">Saving…</span>
            </div>
        );
    }

    if (saved) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] text-green-400 font-medium">Saved</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-800 bg-gray-900/60">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
            <span className="text-[11px] text-gray-500 font-medium">Draft</span>
        </div>
    );
}

// ── User menu ────────────────────────────────────────
function UserMenu({ user, logout }) {
    const [open, setOpen] = useState(false);

    if (!user) return null;

    const initial = user.email?.charAt(0).toUpperCase() || "U";

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl border border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/60 transition-all duration-200"
            >
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[12px] font-medium text-gray-300 leading-tight max-w-[160px] truncate">
                        {user.email}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold leading-tight">
                        {user.role}
                    </span>
                </div>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-blue-600/20">
                    {initial}
                </div>
                <svg className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-56 z-50 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-800">
                            <p className="text-sm font-medium text-white truncate">{user.email}</p>
                            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mt-0.5">{user.role}</p>
                        </div>

                        <div className="py-1.5">
                            {user.role === "admin" && (
                                <Link
                                    href="/cms/users"
                                    onClick={() => setOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/[0.04] transition-colors"
                                >
                                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Manage Users
                                </Link>
                            )}

                            <button
                                onClick={() => { setOpen(false); logout(); }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Sign out
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// ── Mobile nav ───────────────────────────────────────
function MobileMenu({ items, pathname, isActive }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
                {open ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full border-b border-gray-800 bg-gray-950/95 backdrop-blur-xl z-50 px-4 py-3 space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive(item.href)
                                    ? "text-white bg-white/[0.06]"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.04]"
                            }`}
                        >
                            <span className={isActive(item.href) ? "text-blue-400" : "text-gray-600"}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main Navbar ──────────────────────────────────────
export default function CMSNavbar() {
    const { loading, saved } = useNetwork();
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const isActive = (href) =>
        pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">

                {/* Left — Logo + Mobile toggle */}
                <div className="flex items-center gap-2">
                    {pathname !== "/cms/dashboard" && <MobileMenu items={NAV_ITEMS} pathname={pathname} isActive={isActive} />}

                    <Link
                        href="/cms/dashboard"
                        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity mr-1"
                    >
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight hidden sm:inline">
                            Renoweb <span className="text-blue-400">CMS</span>
                        </span>
                    </Link>

                    {/* Desktop divider */}
                    {pathname !== "/cms/dashboard" && <div className="hidden lg:block w-px h-6 bg-gray-800 mx-2" />}

                    {/* Desktop nav (Switcher) */}
                    {pathname !== "/cms/dashboard" && <SectionSwitcher items={NAV_ITEMS} pathname={pathname} />}
                </div>

                {/* Right — Status + User */}
                <div className="flex items-center gap-3">
                    <StatusPill loading={loading} saved={saved} pathname={pathname} />
                    <div className="w-px h-6 bg-gray-800 hidden sm:block" />
                    <UserMenu user={user} logout={logout} />
                </div>

            </div>
        </header>
    );
}
