"use client";

import DynamicAuthorSelector from "@/components/authors/AuthorSelector";

export default function BlogAuthorSelector(props) {
    return (
        <DynamicAuthorSelector
            {...props}
            primaryLabel="Primary Author"
            coLabel="Co-Author"
            accent="indigo"
        />
    );
}
