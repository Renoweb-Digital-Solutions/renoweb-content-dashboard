"use client";

import AuthorManage from "@/components/authors/AuthorManage";

export default function AuthorsPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="mx-auto max-w-7xl px-6 py-10">
                <div className="mb-10 rounded-3xl border border-gray-800 bg-gray-900/70 p-8">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-blue-400">Author management</p>
                            <h1 className="mt-3 text-4xl font-semibold text-white">Add, update, and delete authors</h1>
                            <p className="mt-3 max-w-3xl text-sm text-gray-400">
                                Manage author profiles with a Name, designation, short bio, and profile photo. The author picture is stored in Supabase and the author record is stored in Firebase.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-gray-800 bg-gray-950/70 p-4 text-sm text-gray-300">
                            <p className="font-semibold text-gray-200">New authors are available immediately in author selectors.</p>
                        </div>
                    </div>
                </div>

                <AuthorManage />
            </div>
        </div>
    );
}
