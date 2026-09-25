import { env } from "cloudflare:workers";

import type { QuoteData } from "./quotes";

interface NotionRichText {
  plain_text: string;
  type: string;
  href?: string | null;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  text?: {
    content: string;
    link?: { url: string | null };
  };
  equation?: {
    expression: string;
  };
}

interface NotionProperty {
  type: string;
  title?: NotionRichText[];
  rich_text?: NotionRichText[];
  url?: string | null;
  date?: {
    start?: string | null;
    end?: string | null;
  };
  select?: {
    id: string;
    name: string;
  } | null;
  multi_select?: {
    id: string;
    name: string;
  }[];
  formula?: {
    type: string;
    string?: string | null;
  };
}

interface NotionProperties {
  quote?: NotionProperty;
  author_link?: NotionProperty;
  Status?: NotionProperty;
  Name?: NotionProperty;
  Title?: NotionProperty;
  title?: NotionProperty;
  Slug?: NotionProperty;
  Summary?: NotionProperty;
  "Publish Date"?: NotionProperty;
  publish_date?: NotionProperty;
  Date?: NotionProperty;
  "Canonical URL"?: NotionProperty;
  Tags?: NotionProperty;
  [key: string]: NotionProperty | undefined;
}

interface NotionPage {
  id: string;
  properties: NotionProperties;
  last_edited_time?: string;
}

interface NotionBlockPayload {
  rich_text?: NotionRichText[];
  caption?: NotionRichText[];
  language?: string;
  url?: string;
  expression?: string;
  type?: string;
  external?: { url?: string };
  file?: { url?: string };
  icon?: { emoji?: string };
}

interface NotionBlock {
  id: string;
  type: string;
  has_children: boolean;
  children?: NotionBlock[];
  payload: NotionBlockPayload;
}

interface NotionListResponse<T> {
  results: T[];
  has_more: boolean;
  next_cursor: string | undefined;
}

interface NotionQueryBody {
  start_cursor?: string;
}

type MarkdownRenderer = (block: NotionBlock, depth: number) => string;

interface JsonObject {
  readonly [key: string]: JsonValue | undefined;
}

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

export interface NotionBlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishDate: string;
  status: string;
  tags: string[];
  canonicalUrl?: string;
  lastEditedTime?: string;
  content: string;
}

const NOTION_VERSION = "2022-06-28";
const STRING_TAG = "[object String]";

const isJsonString = (value: JsonValue | undefined): value is string =>
  Object.prototype.toString.call(value) === STRING_TAG;

const isJsonObject = (value: unknown): value is JsonObject => {
  if (value === null || value === undefined) {
    return false;
  }
  if (Array.isArray(value)) {
    return false;
  }
  return value instanceof Object;
};

const asJsonObject = (value: JsonValue | undefined): JsonObject | undefined => {
  if (value === null || value === undefined || Array.isArray(value)) {
    return undefined;
  }
  if (value instanceof Object) {
    return value;
  }
  return undefined;
};

const asString = (value: JsonValue | undefined): string => {
  if (!isJsonString(value)) {
    return "";
  }
  return value;
};

const parseNotionRichText = (value: JsonValue): NotionRichText | undefined => {
  const objectValue = asJsonObject(value);
  if (objectValue === undefined) {
    return undefined;
  }
  if (
    !isJsonString(objectValue.plain_text) ||
    !isJsonString(objectValue.type)
  ) {
    return undefined;
  }

  const richText: NotionRichText = {
    plain_text: objectValue.plain_text,
    type: objectValue.type,
  };

  if (objectValue.href === null) {
    richText.href = null;
  } else if (isJsonString(objectValue.href)) {
    richText.href = objectValue.href;
  }

  const annotations = asJsonObject(objectValue.annotations);
  if (annotations !== undefined) {
    richText.annotations = {
      bold: annotations.bold === true,
      italic: annotations.italic === true,
      strikethrough: annotations.strikethrough === true,
      underline: annotations.underline === true,
      code: annotations.code === true,
      color: asString(annotations.color),
    };
  }

  const text = asJsonObject(objectValue.text);
  if (text !== undefined) {
    const link = asJsonObject(text.link);
    richText.text = {
      content: asString(text.content),
      link:
        link === undefined
          ? undefined
          : { url: isJsonString(link.url) ? link.url : null },
    };
  }

  const equation = asJsonObject(objectValue.equation);
  if (equation !== undefined) {
    richText.equation = { expression: asString(equation.expression) };
  }

  return richText;
};

const parseRichTextArray = (
  value: JsonValue | undefined
): NotionRichText[] | undefined => {
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items: NotionRichText[] = [];
  for (const item of value) {
    const richText = parseNotionRichText(item);
    if (richText === undefined) {
      return undefined;
    }
    items.push(richText);
  }
  return items;
};

const parseSelectOption = (
  value: JsonValue | undefined
): { id: string; name: string } | undefined => {
  const optionObject = asJsonObject(value);
  if (optionObject === undefined) {
    return undefined;
  }
  return {
    id: asString(optionObject.id),
    name: asString(optionObject.name),
  };
};

const assignOptionalRichText = (
  property: NotionProperty,
  key: "title" | "rich_text",
  value: JsonValue | undefined
) => {
  const parsed = parseRichTextArray(value);
  if (parsed !== undefined) {
    property[key] = parsed;
  }
};

const assignOptionalUrl = (
  property: NotionProperty,
  value: JsonValue | undefined
) => {
  if (value === null) {
    property.url = null;
    return;
  }
  if (isJsonString(value)) {
    property.url = value;
  }
};

const assignOptionalDate = (
  property: NotionProperty,
  value: JsonValue | undefined
) => {
  const date = asJsonObject(value);
  if (date === undefined) {
    return;
  }
  property.date = {
    start: isJsonString(date.start) ? date.start : null,
    end: isJsonString(date.end) ? date.end : null,
  };
};

const assignOptionalSelect = (
  property: NotionProperty,
  value: JsonValue | undefined
) => {
  if (value === null) {
    property.select = null;
    return;
  }
  const select = parseSelectOption(value);
  if (select !== undefined) {
    property.select = select;
  }
};

const assignOptionalMultiSelect = (
  property: NotionProperty,
  value: JsonValue | undefined
) => {
  if (!Array.isArray(value)) {
    return;
  }
  const multiSelect: NonNullable<NotionProperty["multi_select"]> = [];
  for (const option of value) {
    const parsedOption = parseSelectOption(option);
    if (parsedOption !== undefined) {
      multiSelect.push(parsedOption);
    }
  }
  property.multi_select = multiSelect;
};

const assignOptionalFormula = (
  property: NotionProperty,
  value: JsonValue | undefined
) => {
  const formula = asJsonObject(value);
  if (formula === undefined) {
    return;
  }
  property.formula = {
    type: asString(formula.type),
    string: isJsonString(formula.string) ? formula.string : null,
  };
};

const parseNotionProperty = (value: JsonValue): NotionProperty | undefined => {
  const objectValue = asJsonObject(value);
  if (objectValue === undefined) {
    return undefined;
  }
  const type = asString(objectValue.type);
  if (type === "") {
    return undefined;
  }

  const property: NotionProperty = { type };
  assignOptionalRichText(property, "title", objectValue.title);
  assignOptionalRichText(property, "rich_text", objectValue.rich_text);
  assignOptionalUrl(property, objectValue.url);
  assignOptionalDate(property, objectValue.date);
  assignOptionalSelect(property, objectValue.select);
  assignOptionalMultiSelect(property, objectValue.multi_select);
  assignOptionalFormula(property, objectValue.formula);
  return property;
};

const parseNotionProperties = (
  value: JsonValue | undefined
): NotionProperties | undefined => {
  const objectValue = asJsonObject(value);
  if (objectValue === undefined) {
    return undefined;
  }
  const properties: NotionProperties = {};
  for (const [key, propertyValue] of Object.entries(objectValue)) {
    if (propertyValue === undefined) {
      continue;
    }
    const property = parseNotionProperty(propertyValue);
    if (property === undefined) {
      return undefined;
    }
    properties[key] = property;
  }
  return properties;
};

const parseNotionPage = (value: JsonValue): NotionPage | undefined => {
  const objectValue = asJsonObject(value);
  if (objectValue === undefined) {
    return undefined;
  }
  const id = asString(objectValue.id);
  if (id === "") {
    return undefined;
  }
  const properties = parseNotionProperties(objectValue.properties);
  if (properties === undefined) {
    return undefined;
  }
  const page: NotionPage = { id, properties };
  const lastEditedTime = asString(objectValue.last_edited_time);
  if (lastEditedTime !== "") {
    page.last_edited_time = lastEditedTime;
  }
  return page;
};

const readRichText = (
  value: JsonValue | undefined
): NotionRichText[] | undefined => parseRichTextArray(value);

const parseUrlMap = (
  value: JsonValue | undefined
): { url?: string } | undefined => {
  const objectValue = asJsonObject(value);
  if (objectValue === undefined) {
    return undefined;
  }
  const url = asString(objectValue.url);
  if (url === "") {
    return undefined;
  }
  return { url };
};

const parseBlockPayload = (value: JsonObject): NotionBlockPayload => {
  const payload: NotionBlockPayload = {};
  const richText = readRichText(value.rich_text);
  if (richText !== undefined) {
    payload.rich_text = richText;
  }
  const caption = readRichText(value.caption);
  if (caption !== undefined) {
    payload.caption = caption;
  }
  const language = asString(value.language);
  if (language !== "") {
    payload.language = language;
  }
  const url = asString(value.url);
  if (url !== "") {
    payload.url = url;
  }
  const expression = asString(value.expression);
  if (expression !== "") {
    payload.expression = expression;
  }
  const type = asString(value.type);
  if (type !== "") {
    payload.type = type;
  }
  const external = parseUrlMap(value.external);
  if (external !== undefined) {
    payload.external = external;
  }
  const file = parseUrlMap(value.file);
  if (file !== undefined) {
    payload.file = file;
  }
  const icon = asJsonObject(value.icon);
  if (icon !== undefined) {
    const emoji = asString(icon.emoji);
    if (emoji !== "") {
      payload.icon = { emoji };
    }
  }
  return payload;
};

const parseBlock = (value: JsonObject): NotionBlock | undefined => {
  const id = asString(value.id);
  const type = asString(value.type);
  if (id === "" || type === "") {
    return undefined;
  }
  const rawPayload = asJsonObject(value[type]);
  return {
    id,
    type,
    has_children: value.has_children === true,
    payload: rawPayload === undefined ? {} : parseBlockPayload(rawPayload),
  };
};

const parsePageList = (value: JsonObject): NotionListResponse<NotionPage> => {
  const { results } = value;
  if (!Array.isArray(results)) {
    throw new TypeError("Notion API list response is missing results");
  }
  const pages: NotionPage[] = [];
  for (const item of results) {
    const page = parseNotionPage(item);
    if (page !== undefined) {
      pages.push(page);
    }
  }
  return {
    results: pages,
    has_more: value.has_more === true,
    next_cursor:
      asString(value.next_cursor) === ""
        ? undefined
        : asString(value.next_cursor),
  };
};

const parseBlockList = (value: JsonObject): NotionListResponse<NotionBlock> => {
  const { results } = value;
  if (!Array.isArray(results)) {
    throw new TypeError("Notion API list response is missing results");
  }
  const blocks: NotionBlock[] = [];
  for (const item of results) {
    const objectItem = asJsonObject(item);
    if (objectItem === undefined) {
      continue;
    }
    const block = parseBlock(objectItem);
    if (block !== undefined) {
      blocks.push(block);
    }
  }
  return {
    results: blocks,
    has_more: value.has_more === true,
    next_cursor:
      asString(value.next_cursor) === ""
        ? undefined
        : asString(value.next_cursor),
  };
};

const createNotionHeaders = (): HeadersInit => ({
  Authorization: `Bearer ${env.NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": NOTION_VERSION,
});

const extractPlainText = (richTextArray?: NotionRichText[]): string => {
  if (richTextArray === undefined || richTextArray.length === 0) {
    return "";
  }

  return richTextArray
    .map((textBlock) => textBlock.plain_text)
    .join("")
    .replaceAll("\\n", "\n")
    .replaceAll("\\t", "\t")
    .trim();
};

const extractPageTitle = (page: NotionPage): string => {
  for (const property of Object.values(page.properties)) {
    if (property === undefined) {
      continue;
    }
    if (property.type === "title" && property.title !== undefined) {
      return extractPlainText(property.title);
    }
  }
  return "Unknown";
};

const applyAnnotations = (
  content: string,
  annotations: NonNullable<NotionRichText["annotations"]>
): string => {
  let formatted = content;
  if (annotations.code === true) {
    formatted = `\`${formatted}\``;
  }
  if (annotations.bold === true) {
    formatted = `**${formatted}**`;
  }
  if (annotations.italic === true) {
    formatted = `_${formatted}_`;
  }
  if (annotations.strikethrough === true) {
    formatted = `~~${formatted}~~`;
  }
  if (annotations.underline === true) {
    formatted = `<u>${formatted}</u>`;
  }
  return formatted;
};

const richTextToMarkdown = (richTextArray?: NotionRichText[]): string => {
  if (richTextArray === undefined || richTextArray.length === 0) {
    return "";
  }

  return richTextArray
    .map((segment) => {
      const textContent = segment.text?.content ?? segment.plain_text ?? "";
      const expression = segment.equation?.expression;
      if (
        segment.type === "equation" &&
        expression !== undefined &&
        expression !== ""
      ) {
        return `$${expression}$`;
      }

      const content = applyAnnotations(textContent, segment.annotations ?? {});
      const href = segment.href ?? segment.text?.link?.url ?? undefined;
      if (href !== undefined && href !== null && href !== "") {
        return `[${content}](${href})`;
      }
      return content;
    })
    .join("")
    .trim();
};

const queryNotionDatabasePage = async (
  databaseId: string,
  startCursor: string | undefined,
  pages: NotionPage[]
): Promise<NotionPage[]> => {
  const body: NotionQueryBody = {};
  if (startCursor !== undefined && startCursor !== "") {
    body.start_cursor = startCursor;
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${databaseId}/query`,
    {
      method: "POST",
      headers: createNotionHeaders(),
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Notion API error response:", response.status, errorData);
    throw new Error(`Notion API error: ${response.status} - ${errorData}`);
  }

  const data: unknown = await response.json();
  if (!isJsonObject(data)) {
    throw new TypeError("Notion API returned a non-object response");
  }
  const parsed = parsePageList(data);
  pages.push(...parsed.results);

  if (
    parsed.has_more &&
    parsed.next_cursor !== undefined &&
    parsed.next_cursor !== ""
  ) {
    return await queryNotionDatabasePage(databaseId, parsed.next_cursor, pages);
  }

  return pages;
};

const queryNotionDatabase = async (databaseId: string): Promise<NotionPage[]> =>
  await queryNotionDatabasePage(databaseId, undefined, []);

const fetchBlockChildrenPage = async (
  blockId: string,
  startCursor: string | undefined,
  blocks: NotionBlock[]
): Promise<NotionBlock[]> => {
  const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`);
  url.searchParams.set("page_size", "100");
  if (startCursor !== undefined && startCursor !== "") {
    url.searchParams.set("start_cursor", startCursor);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: createNotionHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Error fetching block children:", response.status, errorData);
    throw new Error(`Failed to fetch block children: ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!isJsonObject(data)) {
    throw new TypeError("Notion API returned a non-object response");
  }
  const parsed = parseBlockList(data);
  blocks.push(...parsed.results);

  if (
    parsed.has_more &&
    parsed.next_cursor !== undefined &&
    parsed.next_cursor !== ""
  ) {
    return await fetchBlockChildrenPage(blockId, parsed.next_cursor, blocks);
  }

  return blocks;
};

const fetchBlockChildren = async (blockId: string): Promise<NotionBlock[]> =>
  await fetchBlockChildrenPage(blockId, undefined, []);

const buildBlockTree = async (blocks: NotionBlock[]): Promise<NotionBlock[]> =>
  await Promise.all(
    blocks.map(async (block) => {
      if (!block.has_children) {
        return block;
      }
      if (block.type === "child_database") {
        return block;
      }
      const children = await fetchBlockChildren(block.id);
      block.children = await buildBlockTree(children);
      return block;
    })
  );

const indent = (level: number): string => (level > 0 ? "  ".repeat(level) : "");

const joinChildMarkdown = (
  children: NotionBlock[] | undefined,
  depth: number,
  toMarkdown: MarkdownRenderer
): string[] => {
  if (children === undefined) {
    return [];
  }
  const lines: string[] = [];
  for (const child of children) {
    const content = toMarkdown(child, depth);
    if (content !== "") {
      lines.push(content);
    }
  }
  return lines;
};

const withChildContent = (line: string, childContent: string): string => {
  if (childContent === "") {
    return line;
  }
  return `${line}\n${childContent}`;
};

const paragraphToMarkdown = (
  payload: NotionBlockPayload,
  prepend: string
): string => {
  const text = richTextToMarkdown(payload.rich_text);
  if (text === "") {
    return "";
  }
  return `${prepend}${text}`;
};

const headingToMarkdown = (
  payload: NotionBlockPayload,
  hashes: string
): string => {
  const text = richTextToMarkdown(payload.rich_text);
  if (text === "") {
    return "";
  }
  return `${hashes} ${text}`;
};

const listItemToMarkdown = (
  payload: NotionBlockPayload,
  children: NotionBlock[] | undefined,
  depth: number,
  marker: string,
  toMarkdown: MarkdownRenderer,
  allowEmptyText: boolean
): string => {
  const text = richTextToMarkdown(payload.rich_text);
  if (text === "" && !allowEmptyText) {
    return "";
  }
  const prepend = indent(depth);
  const childContent = joinChildMarkdown(children, depth + 1, toMarkdown).join(
    "\n"
  );
  return withChildContent(`${prepend}${marker}${text}`, childContent);
};

const quoteToMarkdown = (
  payload: NotionBlockPayload,
  children: NotionBlock[] | undefined,
  depth: number,
  toMarkdown: MarkdownRenderer
): string => {
  const text = richTextToMarkdown(payload.rich_text);
  if (text === "") {
    return "";
  }
  const lines = text.split("\n").map((line) => `> ${line}`);
  const quotedChildren = joinChildMarkdown(children, depth, toMarkdown);
  if (quotedChildren.length === 0) {
    return lines.join("\n");
  }
  const quotedChildLines: string[] = [];
  for (const line of quotedChildren) {
    quotedChildLines.push(line.startsWith(">") ? line : `> ${line}`);
  }
  return [...lines, ...quotedChildLines].join("\n");
};

const calloutToMarkdown = (
  payload: NotionBlockPayload,
  children: NotionBlock[] | undefined,
  depth: number,
  toMarkdown: MarkdownRenderer
): string => {
  const emojiValue = payload.icon?.emoji;
  const emoji =
    emojiValue === undefined || emojiValue === "" ? "" : `${emojiValue} `;
  const text = richTextToMarkdown(payload.rich_text);
  if (text === "") {
    return "";
  }
  const lines = `> ${emoji}${text}`;
  const childContent = joinChildMarkdown(children, depth + 1, toMarkdown);
  if (childContent.length === 0) {
    return lines;
  }
  const quotedChildren: string[] = [];
  for (const line of childContent) {
    quotedChildren.push(`> ${line.trimStart()}`);
  }
  return [lines, ...quotedChildren].join("\n");
};

const codeToMarkdown = (payload: NotionBlockPayload): string => {
  const language = payload.language ?? "";
  const text = richTextToMarkdown(payload.rich_text);
  return `\`\`\`${language}\n${text}\n\`\`\``;
};

const imageToMarkdown = (payload: NotionBlockPayload): string => {
  const caption = richTextToMarkdown(payload.caption);
  const url =
    payload.type === "external"
      ? (payload.external?.url ?? "")
      : (payload.file?.url ?? "");
  if (url === "") {
    return "";
  }
  return `![${caption}](${url})`;
};

const bookmarkToMarkdown = (payload: NotionBlockPayload): string => {
  const url = payload.url ?? "";
  const caption = richTextToMarkdown(payload.caption);
  if (url === "") {
    return "";
  }
  if (caption === "") {
    return url;
  }
  return `[${caption}](${url})`;
};

const equationToMarkdown = (payload: NotionBlockPayload): string => {
  const expression = payload.expression ?? "";
  if (expression === "") {
    return "";
  }
  return `$$${expression}$$`;
};

const fallbackBlockToMarkdown = (
  payload: NotionBlockPayload,
  children: NotionBlock[] | undefined,
  depth: number,
  type: string,
  toMarkdown: MarkdownRenderer
): string => {
  const text = richTextToMarkdown(payload.rich_text);
  const fallback =
    text === "" ? `<!-- Unsupported block type: ${type} -->` : text;
  if (children === undefined || children.length === 0) {
    return fallback;
  }
  const childContent = joinChildMarkdown(children, depth + 1, toMarkdown).join(
    "\n"
  );
  return `${fallback}\n${childContent}`;
};

const blockToMarkdown = (block: NotionBlock, depth = 0): string => {
  const prepend = indent(depth);
  const { payload, children, type } = block;

  switch (type) {
    case "paragraph": {
      return paragraphToMarkdown(payload, prepend);
    }
    case "heading_1": {
      return headingToMarkdown(payload, "#");
    }
    case "heading_2": {
      return headingToMarkdown(payload, "##");
    }
    case "heading_3": {
      return headingToMarkdown(payload, "###");
    }
    case "bulleted_list_item": {
      return listItemToMarkdown(
        payload,
        children,
        depth,
        "- ",
        blockToMarkdown,
        false
      );
    }
    case "numbered_list_item": {
      return listItemToMarkdown(
        payload,
        children,
        depth,
        "1. ",
        blockToMarkdown,
        false
      );
    }
    case "toggle": {
      return listItemToMarkdown(
        payload,
        children,
        depth,
        "- ",
        blockToMarkdown,
        true
      );
    }
    case "quote": {
      return quoteToMarkdown(payload, children, depth, blockToMarkdown);
    }
    case "callout": {
      return calloutToMarkdown(payload, children, depth, blockToMarkdown);
    }
    case "code": {
      return codeToMarkdown(payload);
    }
    case "divider": {
      return "---";
    }
    case "image": {
      return imageToMarkdown(payload);
    }
    case "bookmark": {
      return bookmarkToMarkdown(payload);
    }
    case "equation": {
      return equationToMarkdown(payload);
    }
    default: {
      return fallbackBlockToMarkdown(
        payload,
        children,
        depth,
        type,
        blockToMarkdown
      );
    }
  }
};

const isListPrefix = (value: string): boolean =>
  value.startsWith("- ") || value.startsWith("1.");

const isMarkupPrefix = (value: string): boolean =>
  value.startsWith("> ") ||
  value.startsWith("#") ||
  value.startsWith("```") ||
  value.startsWith("<!");

const isCompactMarkdown = (value: string): boolean =>
  isListPrefix(value) || isMarkupPrefix(value);

const blocksToMarkdown = (blocks: NotionBlock[]): string => {
  const lines: string[] = [];

  for (const [index, block] of blocks.entries()) {
    const content = blockToMarkdown(block);
    if (content === "") {
      continue;
    }

    const previousLine = lines.at(-1);
    const previousIsCodeFence =
      previousLine !== undefined && previousLine.startsWith("```");
    if (
      lines.length > 0 &&
      !isCompactMarkdown(content) &&
      !previousIsCodeFence
    ) {
      lines.push("");
    }

    lines.push(content);

    const nextBlock = blocks[index + 1];
    if (nextBlock !== undefined && !content.endsWith("\n")) {
      lines.push("");
    }
  }

  return lines
    .join("\n")
    .replaceAll(/\n{3,}/gu, "\n\n")
    .trim();
};

const slugify = (input: string): string => {
  const slug = input
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/gu, "-")
    .replaceAll(/^-+|-+$/gu, "")
    .trim();
  if (slug === "") {
    return "post";
  }
  return slug;
};

const extractFormulaString = (property: NotionProperty): string => {
  if (property.type !== "formula") {
    return "";
  }
  if (property.formula?.type !== "string") {
    return "";
  }
  const formulaString = property.formula.string;
  if (formulaString === undefined || formulaString === null) {
    return "";
  }
  return formulaString;
};

const extractUrlProperty = (property: NotionProperty): string => {
  if (property.type !== "url") {
    return "";
  }
  const { url } = property;
  if (url === undefined || url === null) {
    return "";
  }
  return url;
};

const extractStringProperty = (
  page: NotionPage,
  propertyName: keyof NotionProperties
): string => {
  const property = page.properties[propertyName];
  if (property === undefined) {
    return "";
  }

  if (property.type === "rich_text") {
    return extractPlainText(property.rich_text);
  }

  if (property.type === "title") {
    return extractPlainText(property.title);
  }

  const formulaString = extractFormulaString(property);
  if (formulaString !== "") {
    return formulaString;
  }

  return extractUrlProperty(property);
};

const toQuoteData = (page: NotionPage): QuoteData | undefined => {
  const quoteProperty = page.properties.quote;
  let quoteText = "";

  if (quoteProperty?.type === "title" && quoteProperty.title !== undefined) {
    quoteText = extractPlainText(quoteProperty.title);
  } else if (
    quoteProperty?.type === "rich_text" &&
    quoteProperty.rich_text !== undefined
  ) {
    quoteText = extractPlainText(quoteProperty.rich_text);
  }

  const authorName = extractPageTitle(page);
  const authorLinkProperty = page.properties.author_link;
  let authorLink = "";

  if (
    authorLinkProperty?.type === "url" &&
    authorLinkProperty.url !== undefined &&
    authorLinkProperty.url !== null &&
    authorLinkProperty.url !== ""
  ) {
    authorLink = authorLinkProperty.url;
  } else if (
    authorLinkProperty?.type === "rich_text" &&
    authorLinkProperty.rich_text !== undefined
  ) {
    authorLink = extractPlainText(authorLinkProperty.rich_text);
  }

  const authorText =
    authorLink === "" ? authorName : `[${authorName}](${authorLink})`;

  if (quoteText === "" || authorText === "") {
    return undefined;
  }

  return {
    quote: quoteText,
    author: authorText,
  };
};

const rethrowNotionError = (
  cause: unknown,
  notFoundMessage: string,
  fallbackMessage: string
): never => {
  if (cause instanceof Error) {
    if (cause.message.includes("404")) {
      throw new Error(notFoundMessage, { cause });
    }
    if (cause.message.includes("401")) {
      throw new Error(
        "Unauthorized access to Notion. Please check your NOTION_TOKEN.",
        { cause }
      );
    }
    if (cause.message.includes("429")) {
      throw new Error(
        "Notion API rate limit exceeded. Please try again later.",
        { cause }
      );
    }
  }

  throw new Error(fallbackMessage, { cause });
};

const isPublishedPage = (page: NotionPage): boolean => {
  const statusProperty = page.properties.Status;
  const statusName = statusProperty?.select?.name;
  if (
    statusProperty?.type === "select" &&
    statusName !== undefined &&
    statusName !== ""
  ) {
    return statusName.toLowerCase() === "published";
  }
  return true;
};

const extractBlogTags = (page: NotionPage): string[] => {
  const tagsProperty = page.properties.Tags;
  const tags: string[] = [];
  if (
    tagsProperty?.type !== "multi_select" ||
    tagsProperty.multi_select === undefined
  ) {
    return tags;
  }
  for (const tag of tagsProperty.multi_select) {
    if (tag.name !== "") {
      tags.push(tag.name);
    }
  }
  return tags;
};

const extractPublishDate = (page: NotionPage): string => {
  const publishDateProperty =
    page.properties["Publish Date"] ??
    page.properties.publish_date ??
    page.properties.Date;
  const [todayIsoDate = ""] = new Date().toISOString().split("T");
  const startDate = publishDateProperty?.date?.start;
  if (
    publishDateProperty?.type === "date" &&
    startDate !== undefined &&
    startDate !== null &&
    startDate !== ""
  ) {
    return startDate;
  }
  return todayIsoDate;
};

const extractBlogTitle = (page: NotionPage): string => {
  const titleProperty =
    page.properties.Name ?? page.properties.Title ?? page.properties.title;
  if (titleProperty?.title !== undefined) {
    return extractPlainText(titleProperty.title);
  }
  return extractPageTitle(page);
};

const extractBlogStatus = (page: NotionPage): string => {
  const statusProperty = page.properties.Status;
  const statusName = statusProperty?.select?.name;
  if (
    statusProperty?.type === "select" &&
    statusName !== undefined &&
    statusName !== ""
  ) {
    return statusName;
  }
  return "Unknown";
};

const toBlogPost = async (page: NotionPage): Promise<NotionBlogPost> => {
  const title = extractBlogTitle(page);
  const slugFromProperty = extractStringProperty(page, "Slug");
  const slug = slugFromProperty === "" ? slugify(title) : slugFromProperty;
  const canonicalUrl = extractStringProperty(page, "Canonical URL");
  const rootBlocks = await fetchBlockChildren(page.id);
  const tree = await buildBlockTree(rootBlocks);

  return {
    id: page.id,
    title,
    slug,
    summary: extractStringProperty(page, "Summary"),
    publishDate: extractPublishDate(page),
    status: extractBlogStatus(page),
    tags: extractBlogTags(page),
    canonicalUrl: canonicalUrl === "" ? undefined : canonicalUrl,
    lastEditedTime: page.last_edited_time,
    content: blocksToMarkdown(tree),
  };
};

export const getQuotesFromNotion = async (): Promise<QuoteData[]> => {
  if (env.QUOTES_DATABASE_ID === "" || env.NOTION_TOKEN === "") {
    console.error(
      "Missing required environment variables: QUOTES_DATABASE_ID and NOTION_TOKEN"
    );
    throw new Error(
      "Missing required environment variables: QUOTES_DATABASE_ID and NOTION_TOKEN"
    );
  }

  try {
    const pages = await queryNotionDatabase(env.QUOTES_DATABASE_ID);
    const quotes: QuoteData[] = [];
    for (const page of pages) {
      const quote = toQuoteData(page);
      if (quote !== undefined) {
        quotes.push(quote);
      }
    }
    return quotes;
  } catch (error) {
    console.error("Error fetching quotes from Notion:", error);
    return rethrowNotionError(
      error,
      "Quotes database not found. Please check your QUOTES_DATABASE_ID.",
      "Failed to fetch quotes from Notion database"
    );
  }
};

export const getBlogPostsFromNotion = async (): Promise<NotionBlogPost[]> => {
  const blogsDatabaseId = env.BLOGS_DATABASE_ID;
  if (
    blogsDatabaseId === undefined ||
    blogsDatabaseId === "" ||
    env.NOTION_TOKEN === ""
  ) {
    console.error(
      "Missing required environment variables: BLOGS_DATABASE_ID and NOTION_TOKEN"
    );
    throw new Error(
      "Missing required environment variables: BLOGS_DATABASE_ID and NOTION_TOKEN"
    );
  }

  try {
    const pages = await queryNotionDatabase(blogsDatabaseId);
    const publishedPages = pages.filter((page) => isPublishedPage(page));
    return await Promise.all(
      publishedPages.map(async (page) => await toBlogPost(page))
    );
  } catch (error) {
    console.error("Error fetching blogs from Notion:", error);
    return rethrowNotionError(
      error,
      "Blogs database not found. Please check your BLOGS_DATABASE_ID.",
      "Failed to fetch blog posts from Notion database"
    );
  }
};
