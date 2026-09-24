import { ArrowLeft, CheckSquare, Square } from "lucide-react";
import { isValidElement } from "react";
import type {
  ComponentPropsWithoutRef,
  JSX,
  ReactElement,
  ReactNode,
} from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CopyMarkdownButton } from "@/components/common/copy-markdown-button";
import Image from "@/components/common/site-image";
import Link from "@/components/common/site-link";
import { BlogPostTitle } from "@/components/layout/blog-post-title";
import { CodeBlock } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";
import type { BlogWriting } from "@/lib/writings";

const LANGUAGE_CLASS_PATTERN = /language-(?<language>\w+)/u;
const TRAILING_NEWLINE_PATTERN = /\n$/u;

type MarkdownElementProps<Tag extends keyof JSX.IntrinsicElements> =
  ComponentPropsWithoutRef<Tag> & {
    children?: ReactNode;
    node?: unknown;
  };

type MarkdownHeadingProps = MarkdownElementProps<"h1"> & {
  level?: number;
};

type MarkdownListProps<Tag extends "ul" | "ol"> = MarkdownElementProps<Tag> & {
  depth?: number;
  ordered?: boolean;
};

type MarkdownLiProps = Omit<MarkdownElementProps<"li">, "children"> & {
  children?: ReactNode[];
  checked?: boolean | null;
  index?: number;
  ordered?: boolean;
};

type MarkdownPreProps = Omit<MarkdownElementProps<"pre">, "children"> & {
  children?: ReactNode[];
};

type MarkdownCodeProps = MarkdownElementProps<"code"> & {
  inline?: boolean;
};

type MarkdownRowProps = MarkdownElementProps<"tr"> & {
  isHeader?: boolean;
};

type MarkdownHeaderCellProps = MarkdownElementProps<"th"> & {
  isHeader?: boolean;
};

type MarkdownDataCellProps = MarkdownElementProps<"td"> & {
  isHeader?: boolean;
};

interface CodeChildProps {
  className?: string;
  children?: ReactNode;
}

interface CheckboxInputProps {
  type?: string;
}

const isTextNode = (value: ReactNode): value is string =>
  typeof value === "string";

const isCheckboxElement = (child: ReactNode): boolean =>
  isValidElement<CheckboxInputProps>(child) &&
  child.type === "input" &&
  child.props.type === "checkbox";

const isCodeElement = (
  value: ReactNode
): value is ReactElement<CodeChildProps> =>
  isValidElement<CodeChildProps>(value);

const readCodeText = (value: ReactNode | undefined): string => {
  if (isTextNode(value)) {
    return value;
  }
  return "";
};

const MarkdownH1 = ({
  className,
  children,
  node: _node,
  level: _level,
  ...props
}: MarkdownHeadingProps) => (
  <h1
    {...props}
    className={cn(
      "mb-6 mt-12 font-serif text-3xl font-light first:mt-0 md:text-4xl lg:text-5xl",
      className
    )}
  >
    {children}
  </h1>
);

const MarkdownH2 = ({
  className,
  children,
  node: _node,
  level: _level,
  ...props
}: MarkdownHeadingProps) => (
  <h2
    {...props}
    className={cn(
      "mb-4 mt-10 font-serif text-2xl font-light md:text-3xl lg:text-4xl",
      className
    )}
  >
    {children}
  </h2>
);

const MarkdownH3 = ({
  className,
  children,
  node: _node,
  level: _level,
  ...props
}: MarkdownHeadingProps) => (
  <h3
    {...props}
    className={cn(
      "mb-3 mt-8 font-serif text-xl font-light md:text-2xl lg:text-3xl",
      className
    )}
  >
    {children}
  </h3>
);

const MarkdownH4 = ({
  className,
  children,
  node: _node,
  level: _level,
  ...props
}: MarkdownHeadingProps) => (
  <h4
    {...props}
    className={cn("mb-2 mt-6 font-serif text-lg md:text-xl", className)}
  >
    {children}
  </h4>
);

const MarkdownH5 = ({
  className,
  children,
  node: _node,
  level: _level,
  ...props
}: MarkdownHeadingProps) => (
  <h5
    {...props}
    className={cn("mb-2 mt-6 font-serif text-base md:text-lg", className)}
  >
    {children}
  </h5>
);

const MarkdownH6 = ({
  className,
  children,
  node: _node,
  level: _level,
  ...props
}: MarkdownHeadingProps) => (
  <h6
    {...props}
    className={cn(
      "mb-2 mt-6 font-serif text-base text-muted-foreground",
      className
    )}
  >
    {children}
  </h6>
);

const MarkdownParagraph = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"p">) => (
  <p
    {...props}
    className={cn(
      "my-4 font-sans text-[1rem] leading-relaxed md:text-[1.05rem]",
      className
    )}
  >
    {children}
  </p>
);

const MarkdownStrong = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"strong">) => (
  <strong {...props} className={cn("font-sans font-semibold", className)}>
    {children}
  </strong>
);

const MarkdownEmphasis = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"em">) => (
  <em {...props} className={cn("font-sans italic", className)}>
    {children}
  </em>
);

const MarkdownDelete = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"del">) => (
  <del
    {...props}
    className={cn("font-sans line-through opacity-75", className)}
  >
    {children}
  </del>
);

const MarkdownAnchor = ({
  className,
  children,
  href,
  node: _node,
  ...props
}: MarkdownElementProps<"a">) => {
  const isExternal = href !== undefined && href.startsWith("http");
  return (
    <a
      {...props}
      href={href}
      className={cn(
        "font-medium text-primary transition-colors hover:text-primary/80 hover:underline",
        className
      )}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  );
};

const MarkdownUnorderedList = ({
  className,
  children,
  ordered: _ordered,
  depth: _depth,
  node: _node,
  ...props
}: MarkdownListProps<"ul">) => (
  <ul {...props} className={cn("my-4 ml-6 space-y-2 font-sans", className)}>
    {children}
  </ul>
);

const MarkdownOrderedList = ({
  className,
  children,
  ordered: _ordered,
  depth: _depth,
  node: _node,
  start,
  ...props
}: MarkdownListProps<"ol">) => (
  <ol
    {...props}
    start={start}
    className={cn("my-4 ml-6 space-y-2 font-sans", className)}
  >
    {children}
  </ol>
);

const MarkdownListItem = ({
  className,
  children,
  ordered: _ordered,
  index: _index,
  node: _node,
  checked,
  ...props
}: MarkdownLiProps) => {
  if (checked === true || checked === false) {
    const label = (children ?? []).filter((child) => !isCheckboxElement(child));
    return (
      <li
        {...props}
        className={cn(
          "ml-0 flex list-none items-center gap-2 font-sans leading-relaxed",
          className
        )}
      >
        {checked ? (
          <CheckSquare className="h-4 w-4 flex-shrink-0 text-primary" />
        ) : (
          <Square className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        )}
        <span className={checked ? "line-through opacity-75" : ""}>
          {label}
        </span>
      </li>
    );
  }

  return (
    <li {...props} className={cn("font-sans leading-relaxed", className)}>
      {children}
    </li>
  );
};

const MarkdownBlockquote = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"blockquote">) => (
  <blockquote
    {...props}
    className={cn(
      "custom-blockquote my-6 border-l-4 border-primary/30 py-2 pl-6 font-sans italic text-muted-foreground",
      className
    )}
  >
    {children}
  </blockquote>
);

const MarkdownCode = ({
  className,
  inline,
  children,
  node: _node,
  ...props
}: MarkdownCodeProps) => {
  if (inline === true) {
    return (
      <code
        {...props}
        className={cn(
          "rounded border bg-muted px-1.5 py-0.5 font-mono text-sm",
          className
        )}
      >
        {children}
      </code>
    );
  }

  return <code {...props}>{children}</code>;
};

const MarkdownPre = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownPreProps) => {
  const firstChild = children?.[0];
  if (isCodeElement(firstChild)) {
    const childClassName = firstChild.props.className ?? "";
    const match = LANGUAGE_CLASS_PATTERN.exec(childClassName);
    const language = match?.groups?.language ?? "";
    if (language !== "") {
      return (
        <CodeBlock
          language={language}
          code={readCodeText(firstChild.props.children).replace(
            TRAILING_NEWLINE_PATTERN,
            ""
          )}
        />
      );
    }
  }

  return (
    <pre
      {...props}
      className={cn(
        "my-6 overflow-x-auto rounded-lg border bg-muted p-4 font-mono text-sm",
        className
      )}
    >
      {children}
    </pre>
  );
};

const MarkdownImage = ({
  className,
  node: _node,
  alt,
  ...props
}: MarkdownElementProps<"img">) => {
  const altText = alt !== undefined && alt !== "" ? alt : "Blog image";
  return (
    <Image
      {...props}
      alt={altText}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      className={cn("my-8 rounded-lg border shadow-md", className)}
    />
  );
};

const MarkdownTable = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"table">) => (
  <div className="my-6 overflow-x-auto">
    <table
      {...props}
      className={cn(
        "w-full border-collapse rounded-lg border border-border",
        className
      )}
    >
      {children}
    </table>
  </div>
);

const MarkdownTableHead = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"thead">) => (
  <thead {...props} className={cn("bg-muted/50", className)}>
    {children}
  </thead>
);

const MarkdownTableBody = ({
  className,
  children,
  node: _node,
  ...props
}: MarkdownElementProps<"tbody">) => (
  <tbody {...props} className={cn("", className)}>
    {children}
  </tbody>
);

const MarkdownTableRow = ({
  className,
  children,
  node: _node,
  isHeader: _isHeader,
  ...props
}: MarkdownRowProps) => (
  <tr
    {...props}
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/30",
      className
    )}
  >
    {children}
  </tr>
);

const MarkdownTableHeaderCell = ({
  className,
  children,
  node: _node,
  isHeader: _isHeader,
  ...props
}: MarkdownHeaderCellProps) => (
  <th
    {...props}
    className={cn(
      "border-r border-border p-3 text-left font-sans font-semibold last:border-r-0",
      className
    )}
  >
    {children}
  </th>
);

const MarkdownTableDataCell = ({
  className,
  children,
  node: _node,
  isHeader: _isHeader,
  ...props
}: MarkdownDataCellProps) => (
  <td
    {...props}
    className={cn(
      "border-r border-border p-3 font-sans last:border-r-0",
      className
    )}
  >
    {children}
  </td>
);

const MarkdownHorizontalRule = ({
  className,
  node: _node,
  ...props
}: MarkdownElementProps<"hr">) => (
  <hr
    {...props}
    className={cn(
      "my-8 h-px border-0 bg-gradient-to-r from-transparent via-border to-transparent",
      className
    )}
  />
);

const markdownComponents: Components = {
  h1: MarkdownH1,
  h2: MarkdownH2,
  h3: MarkdownH3,
  h4: MarkdownH4,
  h5: MarkdownH5,
  h6: MarkdownH6,
  p: MarkdownParagraph,
  strong: MarkdownStrong,
  em: MarkdownEmphasis,
  del: MarkdownDelete,
  a: MarkdownAnchor,
  ul: MarkdownUnorderedList,
  ol: MarkdownOrderedList,
  li: MarkdownListItem,
  blockquote: MarkdownBlockquote,
  code: MarkdownCode,
  pre: MarkdownPre,
  img: MarkdownImage,
  table: MarkdownTable,
  thead: MarkdownTableHead,
  tbody: MarkdownTableBody,
  tr: MarkdownTableRow,
  th: MarkdownTableHeaderCell,
  td: MarkdownTableDataCell,
  hr: MarkdownHorizontalRule,
};

const BlogPostPage = ({ writing }: { writing: BlogWriting }) => {
  const { title, date, content } = writing;

  return (
    <div className="min-h-full">
      <div className="container mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/writings"
            className="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-sans text-sm">Back to Writing</span>
          </Link>
          <CopyMarkdownButton content={content} />
        </div>

        <article className="prose prose-neutral dark:prose-invert max-w-none">
          <BlogPostTitle>{title}</BlogPostTitle>
          <p className="mb-8 font-sans text-sm text-muted-foreground">
            {new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            | Authored by Jake Bodea
          </p>
          <div className="markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              // @ts-expect-error -- rehype-mathjax types against a different unified/vfile major than react-markdown
              rehypePlugins={[rehypeMathjax]}
              components={markdownComponents}
            >
              {content}
            </ReactMarkdown>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
