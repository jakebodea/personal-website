import matter from "gray-matter";

import { papers } from "@/content/papers-data";

export type WritingType = "blog" | "paper";

export interface BlogWriting {
  type: "blog";
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

export interface PaperWriting {
  type: "paper";
  title: string;
  date: string;
  description: string;
  pdfUrl: string;
}

export type Writing = BlogWriting | PaperWriting;

const MARKDOWN_EXTENSION = ".md";
const ISO_DATE_LENGTH = 10;

const blogFiles = import.meta.glob<string>("/content/writings/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

interface BlogFrontMatter {
  title?: string;
  date?: string;
  description?: string;
}

const readFrontMatterString = (
  value: string | undefined,
  fallback: string
): string => (value !== undefined && value !== "" ? value : fallback);

const todayIsoDate = (): string =>
  new Date().toISOString().slice(0, ISO_DATE_LENGTH);

export const getBlogSlugs = (): string[] => {
  const slugs: string[] = [];
  for (const file of Object.keys(blogFiles)) {
    const lastSlash = file.lastIndexOf("/");
    const fileName = lastSlash === -1 ? file : file.slice(lastSlash + 1);
    if (!fileName.endsWith(MARKDOWN_EXTENSION)) {
      continue;
    }
    slugs.push(fileName.slice(0, -MARKDOWN_EXTENSION.length));
  }
  return slugs;
};

const parseBlogFile = (raw: string): Omit<BlogWriting, "slug" | "type"> => {
  try {
    const parsed = matter(raw);
    // SAFETY: gray-matter types `data` as `{ [key: string]: any }`; blog posts only use optional string title, date, and description.
    const data = parsed.data as BlogFrontMatter;

    return {
      title: readFrontMatterString(data.title, "Untitled Post"),
      date: readFrontMatterString(data.date, todayIsoDate()),
      description: readFrontMatterString(
        data.description,
        "No description provided"
      ),
      content: parsed.content.trim(),
    };
  } catch (error) {
    console.error("Error parsing blog file:", error);
    return {
      title: "Error Loading Post",
      date: todayIsoDate(),
      description: "Error loading post",
      content: "There was an error loading this writing.",
    };
  }
};

export const getBlogWriting = (slug: string): BlogWriting | null => {
  const raw = blogFiles[`/content/writings/${slug}.md`];
  if (raw === undefined) {
    return null;
  }
  const { title, date, description, content } = parseBlogFile(raw);
  return { type: "blog", slug, title, date, description, content };
};

export const getAllWritings = (): Writing[] => {
  const blogs: BlogWriting[] = [];
  for (const slug of getBlogSlugs()) {
    const writing = getBlogWriting(slug);
    if (writing !== null) {
      blogs.push(writing);
    }
  }

  const paperWritings: PaperWriting[] = papers.map((paper) => ({
    type: "paper",
    ...paper,
  }));

  return [...blogs, ...paperWritings].toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};
