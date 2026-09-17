"use client";

import { useEffect, useState } from "react";
import { subscribeToAuthors } from "@/lib/authors";

export function useAuthors(moduleId) {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        if (!moduleId) return;
        const unsubscribe = subscribeToAuthors(moduleId, setAuthors, console.error);
        return () => unsubscribe();
    }, [moduleId]);

    return authors;
}
