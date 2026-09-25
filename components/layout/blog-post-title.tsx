"use client";

import { PageTitle } from "./page-title";

interface BlogPostTitleProps {
  children: string;
}

export const BlogPostTitle = ({ children }: BlogPostTitleProps) => (
  <PageTitle variant="blog">{children}</PageTitle>
);
