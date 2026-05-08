"use client";

import { useEffect, useState } from "react";
import { subscribeToAuthors } from "@/lib/authors";

export function useAuthors() {
    const [authors, setAuthors] = useState([]);

    useEffect(() => {
        const unsubscribe = subscribeToAuthors(setAuthors, console.error);
        return () => unsubscribe();
    }, []);

    return authors;
}
