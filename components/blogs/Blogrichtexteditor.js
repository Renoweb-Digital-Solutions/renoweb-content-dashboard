"use client";

// components/cms/blog/BlogRichTextEditor.js
// ─────────────────────────────────────────────────────────────────────────────
// Self-contained rich-text editor (contenteditable + execCommand).
// Inline images upload directly to Supabase Storage → contentimages/blog-images/
// Props:
//   value    {string}   — HTML string (controlled)
//   onChange {function} — called with updated HTML on every input
//   slug     {string}   — used as folder name for image uploads; falls back to
//                         "draft-{timestamp}" if empty
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function BlogRichTextEditor({ value, onChange, slug }) {
    const editorRef = useRef(null);
    const imageInputRef = useRef(null);
    const savedRange = useRef(null);

    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [linkUrl, setLinkUrl] = useState("");
    const [linkText, setLinkText] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [wordCount, setWordCount] = useState(0);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Seed initial HTML or clear it if parent resets value
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || "";
            // Keep word count in sync
            setWordCount((value || "").trim().split(/\s+/).filter(Boolean).length);
        }
    }, [value]);

    useEffect(() => {
        window.__deleteEditorImage = async (imageId) => {
            const el = editorRef.current?.querySelector(`[data-img-id="${imageId}"]`);
            if (!el) return;

            // Just remove from DOM. Deletion from Supabase will be handled
            // during the save process by diffing the HTML.
            el.remove();
            handleInput(); // update state
        };

        return () => {
            delete window.__deleteEditorImage;
        };
    }, []);

    // ── Helpers ────────────────────────────────────────────────────────────────

    const handleInput = () => {
        const html = editorRef.current?.innerHTML || "";
        onChange(html);
        const words = (editorRef.current?.innerText || "").trim().split(/\s+/).filter(Boolean).length;
        setWordCount(words);
    };

    const saveRange = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) savedRange.current = sel.getRangeAt(0).cloneRange();
    };

    const restoreRange = () => {
        const sel = window.getSelection();

        if (savedRange.current) {
            try {
                sel.removeAllRanges();
                sel.addRange(savedRange.current);
            } catch {
                editorRef.current?.focus();
            }
        } else {
            editorRef.current?.focus();
        }
    };

    const exec = (cmd, val = null) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, val);
        handleInput();
    };

    const isActive = (cmd) => {
        try { return document.queryCommandState(cmd); } catch { return false; }
    };

    // ── Image upload → Supabase ────────────────────────────────────────────────

    const handleImageFile = async (file) => {
        if (!file) return;

        // Generate local blob URL instead of uploading instantly
        const blobUrl = URL.createObjectURL(file);
        const imageId = `img-${Date.now()}`;

        editorRef.current?.focus();

        if (savedRange.current) {
            try {
                restoreRange();
            } catch {
                console.log("Range restore failed, inserting at end");
            }
        }
        
        const insertHTML = (html) => {
            const sel = window.getSelection();
            if (sel && sel.rangeCount > 0) {
                document.execCommand("insertHTML", false, html);
            } else {
                editorRef.current.innerHTML += html; // fallback
            }
        };

        insertHTML(`
  <span 
    contenteditable="false" 
    data-img-id="${imageId}" 
    data-pending-upload="true"
    style="position:relative;display:inline-block;margin:12px 0;"
  >
    <img 
      src="${blobUrl}" 
      style="max-width:100%;border-radius:12px;display:block;"
    />
    
    <button 
      onclick="window.__deleteEditorImage('${imageId}')"
      style="
        position:absolute;
        top:6px;
        left:6px;
        width:22px;
        height:22px;
        border:none;
        border-radius:50%;
        background:rgba(0,0,0,0.7);
        color:white;
        font-size:14px;
        cursor:pointer;
      "
    >✕</button>
  </span>
`);

        handleInput();
    };

    // ── Link insert ────────────────────────────────────────────────────────────

    const insertLink = () => {
        restoreRange();
        if (linkText) {
            document.execCommand("insertHTML", false,
                `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;text-decoration:underline;">${linkText}</a>`
            );
        } else {
            document.execCommand("createLink", false, linkUrl);
            const sel = window.getSelection();
            if (sel?.anchorNode?.parentElement?.tagName === "A") {
                sel.anchorNode.parentElement.style.color = "#60a5fa";
                sel.anchorNode.parentElement.style.textDecoration = "underline";
            }
        }
        setShowLinkModal(false);
        setLinkUrl(""); setLinkText("");
        handleInput();
    };

    // ── Video embed ────────────────────────────────────────────────────────────

    const getEmbedUrl = (url) => {
        try {
            const u = new URL(url);
            if (u.hostname.includes("youtube.com")) {
                const id = u.searchParams.get("v");
                return id ? `https://www.youtube.com/embed/${id}` : url;
            }
            if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed${u.pathname}`;
            if (u.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video${u.pathname}`;
            return url;
        } catch { return url; }
    };

    const insertVideo = () => {
        restoreRange();
        const embed = getEmbedUrl(videoUrl);
        document.execCommand("insertHTML", false,
            `<div style="position:relative;padding-bottom:56.25%;height:0;margin:16px 0;border-radius:12px;overflow:hidden;background:#0a0a0a;border:1px solid #1f2937;">
        <iframe src="${embed}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allowfullscreen loading="lazy"></iframe>
      </div>`
        );
        editorRef.current?.focus();
        setShowVideoModal(false);
        setVideoUrl("");
        handleInput();
    };

    // ── Toolbar button helper ──────────────────────────────────────────────────

    const toolBtn = (active, onClick, title, children) => (
        <button
            onMouseDown={(e) => { e.preventDefault(); onClick(); }}
            title={title}
            className={`p-1.5 rounded-md transition text-xs font-bold ${active
                ? "bg-blue-600/30 text-blue-400 border border-blue-600/40"
                : "text-gray-500 hover:text-gray-200 hover:bg-gray-800"
                }`}
        >
            {children}
        </button>
    );

    const divider = <div className="w-px h-5 bg-gray-800 mx-1" />;

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="rounded-xl border border-gray-800 overflow-hidden bg-gray-900/30">

            {/* ── Toolbar ──────────────────────────────────────────────────────── */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-800 bg-black/40">

                {/* Format */}
                {toolBtn(isActive("bold"), () => exec("bold"), "Bold",
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>)}
                {toolBtn(isActive("italic"), () => exec("italic"), "Italic",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>)}
                {toolBtn(isActive("underline"), () => exec("underline"), "Underline",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>)}
                {toolBtn(isActive("strikeThrough"), () => exec("strikeThrough"), "Strikethrough",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><path d="M16 6C16 6 14.5 4 12 4C9 4 7 6 7 8C7 10 9 11 12 12" /><path d="M8 18C8 18 9.5 20 12 20C15 20 17 18 17 16C17 14 15 13 12 12" /></svg>)}

                {divider}

                {/* Headings */}
                {toolBtn(false, () => exec("formatBlock", "H2"), "Heading 2", <span className="text-[11px] font-black">H2</span>)}
                {toolBtn(false, () => exec("formatBlock", "H3"), "Heading 3", <span className="text-[11px] font-black">H3</span>)}
                {toolBtn(false, () => exec("formatBlock", "H4"), "Heading 4", <span className="text-[11px] font-black">H4</span>)}
                {toolBtn(false, () => exec("formatBlock", "P"), "Paragraph", <span className="text-[11px]">¶</span>)}

                {divider}

                {/* Lists & Quote */}
                {toolBtn(isActive("insertUnorderedList"), () => exec("insertUnorderedList"), "Bullet list",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" /><circle cx="4" cy="6" r="1.5" /><circle cx="4" cy="12" r="1.5" /><circle cx="4" cy="18" r="1.5" /></svg>)}
                {toolBtn(isActive("insertOrderedList"), () => exec("insertOrderedList"), "Numbered list",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6" /><line x1="10" y1="12" x2="21" y2="12" /><line x1="10" y1="18" x2="21" y2="18" /><path d="M4 6h1v4" /><path d="M4 10h2" /><path d="M6 18H4c0-1 2-2 2-3s-1-2-2-2" /></svg>)}
                {toolBtn(false, () => exec("formatBlock", "BLOCKQUOTE"), "Blockquote",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" /></svg>)}

                {divider}

                {/* Alignment */}
                {toolBtn(false, () => exec("justifyLeft"), "Align left",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>)}
                {toolBtn(false, () => exec("justifyCenter"), "Align center",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>)}

                {divider}

                {/* Code block */}
                {toolBtn(false, () => exec("formatBlock", "PRE"), "Code block",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>)}

                {divider}

                {/* Link */}
                <button
                    onMouseDown={(e) => { e.preventDefault(); saveRange(); setShowLinkModal(true); }}
                    title="Insert Link"
                    className="p-1.5 rounded-md transition text-gray-500 hover:text-blue-400 hover:bg-gray-800"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                    </svg>
                </button>
                {toolBtn(false, () => exec("unlink"), "Remove link",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                        <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>)}

                {/* Image */}
                <button
                    onMouseDown={(e) => {
                        e.preventDefault();

                        // 🔥 Force focus FIRST
                        editorRef.current?.focus();

                        // 🔥 Save fresh range AFTER focus
                        saveRange();

                        // 🔥 Reset input (important for same file re-upload)
                        if (imageInputRef.current) {
                            imageInputRef.current.value = "";
                            imageInputRef.current.click();
                        }
                    }}
                    title="Insert Image"
                    disabled={uploadingImage}
                    className={`p-1.5 rounded-md transition ${uploadingImage
                        ? "text-blue-400 bg-blue-600/10 border border-blue-600/20 cursor-wait"
                        : "text-gray-500 hover:text-blue-400 hover:bg-gray-800"
                        }`}
                >
                    {uploadingImage ? (
                        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    ) : (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    )}
                </button>

                {/* Video */}
                <button
                    onMouseDown={(e) => { e.preventDefault(); saveRange(); setShowVideoModal(true); }}
                    title="Embed Video"
                    className="p-1.5 rounded-md transition text-gray-500 hover:text-blue-400 hover:bg-gray-800"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polygon points="23 7 16 12 23 17 23 7" />
                        <rect x="1" y="5" width="15" height="14" rx="2" />
                    </svg>
                </button>

                {divider}

                {/* Undo / Redo */}
                {toolBtn(false, () => exec("undo"), "Undo",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" /></svg>)}
                {toolBtn(false, () => exec("redo"), "Redo",
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" /></svg>)}
            </div>

            {/* ── Editable area ─────────────────────────────────────────────────── */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="min-h-[420px] p-6 text-sm text-gray-200 outline-none leading-relaxed blog-editor"
                style={{ caretColor: "#60a5fa" }}
                data-placeholder="Start writing your blog post here…"
            />

            {/* ── Footer ────────────────────────────────────────────────────────── */}
            <div className="px-4 py-2 border-t border-gray-800 bg-black/20 flex items-center justify-between">
                <span className="text-[10px] text-gray-700">Rich text · HTML output · Images → Supabase</span>
                <div className="flex items-center gap-3">
                    {uploadingImage && (
                        <span className="text-[10px] text-blue-400 flex items-center gap-1.5">
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Uploading image…
                        </span>
                    )}
                    <span className="text-[10px] text-gray-600">
                        {wordCount} words · ~{Math.max(1, Math.ceil(wordCount / 200))} min read
                    </span>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageFile(e.target.files[0])}
            />

            {/* ── Link Modal ────────────────────────────────────────────────────── */}
            {showLinkModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-white">Insert Link</span>
                            </div>
                            <button onClick={() => setShowLinkModal(false)} className="text-gray-600 hover:text-white transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 space-y-3">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">URL</label>
                                <input
                                    autoFocus
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && insertLink()}
                                    placeholder="https://example.com"
                                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">
                                    Link Text <span className="text-gray-600">(optional — uses selection if empty)</span>
                                </label>
                                <input
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && insertLink()}
                                    placeholder="Click here"
                                    className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 px-5 pb-5">
                            <button onClick={insertLink} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition">
                                Insert Link
                            </button>
                            <button onClick={() => setShowLinkModal(false)} className="px-4 py-2.5 bg-gray-900 text-gray-400 text-sm rounded-lg border border-gray-800 hover:bg-gray-800 transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Video Modal ───────────────────────────────────────────────────── */}
            {showVideoModal && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-black border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-blue-600/20 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <polygon points="23 7 16 12 23 17 23 7" />
                                        <rect x="1" y="5" width="15" height="14" rx="2" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-white">Embed Video</span>
                            </div>
                            <button onClick={() => setShowVideoModal(false)} className="text-gray-600 hover:text-white transition">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5">
                            <label className="block text-xs text-gray-400 mb-1.5">Video URL</label>
                            <input
                                autoFocus
                                value={videoUrl}
                                onChange={(e) => setVideoUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && insertVideo()}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full bg-gray-900/50 border border-gray-800 focus:border-blue-600/60 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none transition"
                            />
                            <p className="text-[10px] text-gray-600 mt-1.5">Supports YouTube, Vimeo, or any embeddable URL</p>
                        </div>
                        <div className="flex gap-2 px-5 pb-5">
                            <button onClick={insertVideo} className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition">
                                Embed Video
                            </button>
                            <button onClick={() => setShowVideoModal(false)} className="px-4 py-2.5 bg-gray-900 text-gray-400 text-sm rounded-lg border border-gray-800 hover:bg-gray-800 transition">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Editor styles ─────────────────────────────────────────────────── */}
            <style>{`
        .blog-editor:empty:before { content: attr(data-placeholder); color: #4b5563; pointer-events: none; }
        .blog-editor h2 { font-size: 1.375rem; font-weight: 800; color: #f9fafb; margin: 1.5rem 0 0.75rem; line-height: 1.25; }
        .blog-editor h3 { font-size: 1.125rem; font-weight: 700; color: #f3f4f6; margin: 1.25rem 0 0.5rem; }
        .blog-editor h4 { font-size: 0.95rem;  font-weight: 700; color: #e5e7eb; margin: 1rem 0 0.4rem; }
        .blog-editor p  { margin: 0.6rem 0; color: #d1d5db; }
        .blog-editor ul { list-style: disc;    padding-left: 1.5rem; margin: 0.75rem 0; color: #d1d5db; }
        .blog-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.75rem 0; color: #d1d5db; }
        .blog-editor li { margin: 0.3rem 0; }
        .blog-editor blockquote {
          border-left: 3px solid #2563eb; padding: 0.5rem 1rem; margin: 1rem 0;
          background: rgba(37,99,235,0.06); border-radius: 0 8px 8px 0;
          color: #93c5fd; font-style: italic;
        }
        .blog-editor pre {
          background: #0a0a0a; border: 1px solid #1f2937; border-radius: 10px;
          padding: 1rem 1.25rem; margin: 1rem 0;
          font-family: 'Fira Code', 'Cascadia Code', monospace;
          font-size: 0.78rem; color: #34d399; overflow-x: auto; white-space: pre;
        }
        .blog-editor a       { color: #60a5fa; text-decoration: underline; }
        .blog-editor a:hover { color: #93c5fd; }
        .blog-editor img     { max-width: 100%; border-radius: 12px; margin: 12px 0; }
        .blog-editor strong  { color: #f9fafb; }
        .blog-editor em      { color: #e5e7eb; }
        .blog-editor u       { text-underline-offset: 3px; }
      `}</style>
        </div>
    );
}
