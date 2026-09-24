"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { SearchInput } from "@/components/common/search-input";
import { NotionSyncBrag } from "@/components/layout/notion-sync-brag";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import type { QuoteData } from "@/lib/quotes";

const EMBEDDED_LINK_PATTERN = String.raw`\[(?<linkText>[\s\S]+?)\]\((?<href>https?:\/\/[^\s)]+)\)`;
const AUTO_LINK_PATTERN = String.raw`(?<href>https?:\/\/[^\s]+)`;
const EMPHASIS_PATTERN = String.raw`(?<boldMarker>\*\*|__)(?<boldText>[\s\S]+?)\k<boldMarker>|(?<italicMarker>\*|_)(?<italicText>[\s\S]+?)\k<italicMarker>`;

const subscribeNoop = () => () => {
  // Client snapshot is constant; no external store to subscribe to.
};

const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

type MarkdownNode =
  | { readonly kind: "text"; readonly text: string }
  | { readonly kind: "element"; readonly element: ReactNode };

const namedGroup = (
  groups: { [key: string]: string } | undefined,
  name: string
): string => {
  if (groups === undefined) {
    return "";
  }
  const value = groups[name];
  if (value === undefined) {
    return "";
  }
  return value;
};

const toReactNodes = (nodes: readonly MarkdownNode[]): ReactNode[] => {
  const result: ReactNode[] = [];
  for (const node of nodes) {
    if (node.kind === "text") {
      result.push(node.text);
    } else {
      result.push(node.element);
    }
  }
  return result;
};

const parseEmphasisNodes = (
  text: string,
  recurse: (value: string) => MarkdownNode[]
): MarkdownNode[] => {
  const emphasisRegex = new RegExp(EMPHASIS_PATTERN, "gu");
  const nodes: MarkdownNode[] = [];
  let lastIndex = 0;
  let match = emphasisRegex.exec(text);

  while (match !== null) {
    if (match.index > lastIndex) {
      nodes.push({ kind: "text", text: text.slice(lastIndex, match.index) });
    }

    const { groups } = match;
    const boldMarker = namedGroup(groups, "boldMarker");
    const italicMarker = namedGroup(groups, "italicMarker");

    if (boldMarker !== "") {
      nodes.push({
        kind: "element",
        element: (
          <strong className="font-semibold" key={`b-${match.index}`}>
            {toReactNodes(recurse(namedGroup(groups, "boldText")))}
          </strong>
        ),
      });
    } else if (italicMarker !== "") {
      nodes.push({
        kind: "element",
        element: (
          <em className="italic" key={`i-${match.index}`}>
            {toReactNodes(recurse(namedGroup(groups, "italicText")))}
          </em>
        ),
      });
    }

    ({ lastIndex } = emphasisRegex);
    match = emphasisRegex.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push({ kind: "text", text: text.slice(lastIndex) });
  }

  return nodes;
};

const applyAutoLinks = (nodes: readonly MarkdownNode[]): MarkdownNode[] => {
  const withLinks: MarkdownNode[] = [];
  let linkKey = 0;

  for (const node of nodes) {
    if (node.kind !== "text") {
      withLinks.push(node);
      continue;
    }

    const autoLinkRegex = new RegExp(AUTO_LINK_PATTERN, "gu");
    const str = node.text;
    let strLast = 0;
    let urlMatch = autoLinkRegex.exec(str);

    while (urlMatch !== null) {
      if (urlMatch.index > strLast) {
        withLinks.push({
          kind: "text",
          text: str.slice(strLast, urlMatch.index),
        });
      }

      const href = namedGroup(urlMatch.groups, "href");
      if (href !== "") {
        const currentLinkKey = linkKey;
        linkKey += 1;
        withLinks.push({
          kind: "element",
          element: (
            <a
              key={`auto-a-${currentLinkKey}-${href}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-current decoration-1 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
            >
              {href}
            </a>
          ),
        });
      }

      ({ lastIndex: strLast } = autoLinkRegex);
      urlMatch = autoLinkRegex.exec(str);
    }

    if (strLast < str.length) {
      withLinks.push({ kind: "text", text: str.slice(strLast) });
    }
  }

  return withLinks;
};

const applyLineBreaks = (nodes: readonly MarkdownNode[]): MarkdownNode[] => {
  const withBreaks: MarkdownNode[] = [];
  let breakKey = 0;

  for (const node of nodes) {
    if (node.kind !== "text") {
      withBreaks.push(node);
      continue;
    }

    const parts = node.text.split("\n");
    for (const [partIndex, part] of parts.entries()) {
      withBreaks.push({ kind: "text", text: part });
      if (partIndex < parts.length - 1) {
        const currentBreakKey = breakKey;
        breakKey += 1;
        withBreaks.push({
          kind: "element",
          element: <br key={`br-${currentBreakKey}`} />,
        });
      }
    }
  }

  return withBreaks;
};

const parseEmphasisAndAutoLinks = (text: string): MarkdownNode[] =>
  applyLineBreaks(
    applyAutoLinks(parseEmphasisNodes(text, parseEmphasisAndAutoLinks))
  );

const renderBasicMarkdown = (text: string): ReactNode[] => {
  const embeddedLinkRegex = new RegExp(EMBEDDED_LINK_PATTERN, "gu");
  const nodes: MarkdownNode[] = [];
  let lastIndex = 0;
  let linkMatch = embeddedLinkRegex.exec(text);

  while (linkMatch !== null) {
    if (linkMatch.index > lastIndex) {
      nodes.push(
        ...parseEmphasisAndAutoLinks(text.slice(lastIndex, linkMatch.index))
      );
    }

    const { groups } = linkMatch;
    const linkText = namedGroup(groups, "linkText");
    const href = namedGroup(groups, "href");
    if (href !== "") {
      nodes.push({
        kind: "element",
        element: (
          <a
            key={`a-${linkMatch.index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-current decoration-1 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary"
          >
            {toReactNodes(parseEmphasisAndAutoLinks(linkText))}
          </a>
        ),
      });
    }

    ({ lastIndex } = embeddedLinkRegex);
    linkMatch = embeddedLinkRegex.exec(text);
  }

  if (lastIndex < text.length) {
    nodes.push(...parseEmphasisAndAutoLinks(text.slice(lastIndex)));
  }

  return toReactNodes(nodes);
};

interface QuotesPageProps {
  initialQuotes: QuoteData[];
}

const shuffle = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    // eslint-disable-next-line sonarjs/pseudo-random -- display-only quote order, not security
    const j = Math.floor(Math.random() * (i + 1));
    const itemAtI = array[i];
    const itemAtJ = array[j];
    if (itemAtI === undefined || itemAtJ === undefined) {
      continue;
    }
    array[i] = itemAtJ;
    array[j] = itemAtI;
  }
  return array;
};

export const QuotesPage = ({ initialQuotes }: QuotesPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isClient = useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot
  );

  const baseQuotes = useMemo(() => {
    if (!isClient) {
      return initialQuotes;
    }
    return shuffle([...initialQuotes]);
  }, [isClient, initialQuotes]);

  const filteredQuotes = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (term === "") {
      return baseQuotes;
    }
    return baseQuotes.filter((quote) => {
      const quoteMatch = quote.quote.toLowerCase().includes(term);
      const authorMatch = quote.author.toLowerCase().includes(term);
      return quoteMatch || authorMatch;
    });
  }, [searchQuery, baseQuotes]);

  return (
    <PageWrapper
      title="quotes"
      subtitle="A collection of quotes and sources that have inspired me."
    >
      <NotionSyncBrag />
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="search quotes..."
      />

      <div className="space-y-8">
        {isClient ? (
          <>
            {filteredQuotes.map((quote) => (
              <div
                key={`${quote.author}|${quote.quote}`}
                className="border-l-4 border-accent/30 py-2 pl-6"
              >
                <blockquote
                  className="mb-2 whitespace-pre-wrap font-serif text-3xl font-normal text-muted-foreground"
                  style={{ tabSize: 4 }}
                >
                  {renderBasicMarkdown(quote.quote)}
                </blockquote>
                <cite className="text-md font-sans font-light text-muted-foreground">
                  — {renderBasicMarkdown(quote.author)}
                </cite>
              </div>
            ))}
            {filteredQuotes.length === 0 && searchQuery !== "" && (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  No quotes found matching &ldquo;{searchQuery}&rdquo;
                </p>
              </div>
            )}
          </>
        ) : (
          Array.from({ length: 6 }).map((_, skeletonIndex) => (
            <div
              key={`s-${skeletonIndex}`}
              className="border-l-4 border-accent/30 py-2 pl-6"
            >
              <Skeleton className="mb-2 h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))
        )}
      </div>
    </PageWrapper>
  );
};
