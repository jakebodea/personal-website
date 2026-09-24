"use client";

import { useState } from "react";

import { PostList } from "@/components/common/post-list";
import { SearchInput } from "@/components/common/search-input";
import { PageWrapper } from "@/components/layout/page-wrapper";
import type { Writing, WritingType } from "@/lib/writings";

interface WritingsPageProps {
  initialWritings: Writing[];
}

const FILTER_OPTIONS: { label: string; value: "all" | WritingType }[] = [
  { label: "all", value: "all" },
  { label: "blogs", value: "blog" },
  { label: "papers", value: "paper" },
];

const WritingsPageClient = ({ initialWritings }: WritingsPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | WritingType>("all");

  const trimmedQuery = searchQuery.trim();
  const filteredWritings = initialWritings.filter((writing) => {
    if (typeFilter !== "all" && writing.type !== typeFilter) {
      return false;
    }
    if (trimmedQuery === "") {
      return true;
    }
    const term = trimmedQuery.toLowerCase();
    const titleMatch = writing.title.toLowerCase().includes(term);
    const bodyMatch =
      writing.type === "blog"
        ? writing.content.toLowerCase().includes(term)
        : writing.description.toLowerCase().includes(term);
    return titleMatch || bodyMatch;
  });

  return (
    <PageWrapper title="writing">
      <div className="mb-4 mt-2 flex gap-2">
        {FILTER_OPTIONS.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setTypeFilter(value);
            }}
            className={`rounded-full px-3 py-1 font-sans text-sm transition-colors ${
              typeFilter === value
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="search writings..."
      />
      <PostList writings={filteredWritings} searchQuery={searchQuery} />
    </PageWrapper>
  );
};

export default WritingsPageClient;
