"use client";

import DynamicAuthorSelector from "@/components/authors/AuthorSelector";

export default function RHAuthorSelector(props) {
    return (
        <DynamicAuthorSelector
            {...props}
            primaryLabel="Primary Researcher / Author"
            coLabel="Co-Researcher"
            accent="amber"
        />
    );
}
