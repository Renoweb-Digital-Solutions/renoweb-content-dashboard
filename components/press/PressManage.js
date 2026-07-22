"use client";

import { useEffect, useState } from "react";
import { deletePress, subscribeToPressEntries } from "@/lib/press";

export default function PressManage({ onEdit }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToPressEntries(
            (data) => {
                setEntries(data);
                setLoading(false);
            },
            (err) => {
                console.error("Failed to fetch press entries", err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this press entry? This cannot be undone.")) return;
        
        setIsDeleting(id);
        try {
            await deletePress(id);
        } catch (err) {
            alert("Failed to delete entry: " + err.message);
        } finally {
            setIsDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 border border-gray-800 rounded-2xl bg-gray-900/20">
                <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Loading Entries...</span>
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-gray-800 rounded-2xl bg-gray-900/20 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center mb-3 text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
                    </svg>
                </div>
                <p className="text-sm font-medium text-gray-300">No press entries found</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Upload your first press release or media feature from the &quot;New Entry&quot; tab.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {entries.map((entry) => (
                <div key={entry.id} className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors flex flex-col">
                    <div className="h-40 bg-gray-800/50 relative overflow-hidden flex-shrink-0">
                        {entry.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={entry.imageUrl} alt={entry.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-80" />
                        
                        {entry.logoUrl && (
                            <div className="absolute top-3 right-3 w-8 h-8 bg-white rounded-md p-1 shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={entry.logoUrl} alt="logo" className="w-full h-full object-contain" />
                            </div>
                        )}

                        <div className="absolute bottom-3 left-3">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-black/50 backdrop-blur text-[10px] font-bold text-gray-300 border border-white/10 uppercase tracking-wider">
                                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-sm font-bold text-gray-100 leading-tight mb-2 line-clamp-2">
                            {entry.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1">
                            {entry.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                            <a 
                                href={entry.link}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition"
                            >
                                View Link
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </a>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(entry)}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition"
                                    title="Edit"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(entry.id)}
                                    disabled={isDeleting === entry.id}
                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition disabled:opacity-50"
                                    title="Delete"
                                >
                                    {isDeleting === entry.id ? (
                                        <svg className="animate-spin h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
