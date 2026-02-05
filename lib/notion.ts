import { QuoteData } from './quotes'

// TypeScript interfaces for Notion API
interface NotionRichText {
  plain_text: string
  type: string
  href?: string | null
  annotations?: {
    bold?: boolean
    italic?: boolean
    strikethrough?: boolean
    underline?: boolean
    code?: boolean
    color?: string
  }
  text?: {
    content: string
    link?: { url: string | null }
  }
  equation?: {
    expression: string
  }
}

interface NotionProperty {
  type: string
  title?: NotionRichText[]
  rich_text?: NotionRichText[]
  url?: string | null
  date?: {
    start?: string | null
    end?: string | null
  }
  select?: {
    id: string
    name: string
  } | null
  multi_select?: Array<{
    id: string
    name: string
  }>
  formula?: {
    type: string
    string?: string | null
  }
}

interface NotionPage {
  id: string
  properties: Record<string, NotionProperty>
  last_edited_time?: string
}

interface NotionBlock {
  id: string
  type: string
  has_children: boolean
  [key: string]: any
  children?: NotionBlock[]
}

export interface NotionBlogPost {
  id: string
  title: string
  slug: string
  summary: string
  publishDate: string
  status: string
  tags: string[]
  canonicalUrl?: string
  lastEditedTime?: string
  content: string
}

const NOTION_VERSION = '2022-06-28'

// Helper function to extract plain text from Notion rich text
function extractPlainText(richTextArray?: NotionRichText[]): string {
  if (!richTextArray || richTextArray.length === 0) {
    return ''
  }

  return richTextArray
    .map(textBlock => textBlock.plain_text)
    .join('')
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .trim()
}

// Helper function to extract page title
function extractPageTitle(page: NotionPage): string {
  const titleProperty = Object.values(page.properties).find((prop: NotionProperty) => prop.type === 'title')
  
  if (titleProperty && titleProperty.title && titleProperty.title.length > 0) {
    return extractPlainText(titleProperty.title)
  }
  
  return 'Unknown'
}

function richTextToMarkdown(richTextArray?: NotionRichText[]): string {
  if (!richTextArray || richTextArray.length === 0) {
    return ''
  }

  return richTextArray
    .map(segment => {
      const textContent = segment.text?.content ?? segment.plain_text ?? ''
      if (segment.type === 'equation' && segment.equation?.expression) {
        return `$${segment.equation.expression}$`
      }

      let content = textContent
      const annotations = segment.annotations ?? {}
      const href = segment.href ?? segment.text?.link?.url ?? undefined

      if (annotations.code) {
        content = `\`${content}\``
      }
      if (annotations.bold) {
        content = `**${content}**`
      }
      if (annotations.italic) {
        content = `_${content}_`
      }
      if (annotations.strikethrough) {
        content = `~~${content}~~`
      }
      if (annotations.underline) {
        content = `<u>${content}</u>`
      }

      if (href) {
        return `[${content}](${href})`
      }

      return content
    })
    .join('')
    .trim()
}

async function queryNotionDatabase(databaseId: string): Promise<NotionPage[]> {
  const headers = {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  }

  let hasMore = true
  let startCursor: string | undefined
  const pages: NotionPage[] = []

  while (hasMore) {
    const body: Record<string, unknown> = {}
    if (startCursor) {
      body.start_cursor = startCursor
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Notion API error response:', response.status, errorData)
      throw new Error(`Notion API error: ${response.status} - ${errorData}`)
    }

    const data = (await response.json()) as {
      results: NotionPage[]
      has_more: boolean
      next_cursor?: string
    }

    pages.push(...data.results)
    hasMore = data.has_more
    startCursor = data.next_cursor ?? undefined
  }

  return pages
}

async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
  const headers = {
    'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': NOTION_VERSION,
  }

  let hasMore = true
  let startCursor: string | undefined
  const blocks: NotionBlock[] = []

  while (hasMore) {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`)
    url.searchParams.set('page_size', '100')
    if (startCursor) {
      url.searchParams.set('start_cursor', startCursor)
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Error fetching block children:', response.status, errorData)
      throw new Error(`Failed to fetch block children: ${response.status}`)
    }

    const data = (await response.json()) as {
      results: NotionBlock[]
      has_more: boolean
      next_cursor?: string
    }

    blocks.push(...data.results)
    hasMore = data.has_more
    startCursor = data.next_cursor ?? undefined
  }

  return blocks
}

async function buildBlockTree(blocks: NotionBlock[]): Promise<NotionBlock[]> {
  return Promise.all(
    blocks.map(async (block) => {
      if (!block.has_children) {
        return block
      }

      // Skip child-specific types that should not be recursed into
      if (block.type === 'child_database') {
        return block
      }

      const children = await fetchBlockChildren(block.id)
      block.children = await buildBlockTree(children)
      return block
    })
  )
}

function indent(level: number): string {
  return level > 0 ? '  '.repeat(level) : ''
}

function blockToMarkdown(block: NotionBlock, depth = 0): string {
  const prepend = indent(depth)

  switch (block.type) {
    case 'paragraph': {
      const text = richTextToMarkdown(block.paragraph?.rich_text)
      return text ? `${prepend}${text}` : ''
    }
    case 'heading_1': {
      const text = richTextToMarkdown(block.heading_1?.rich_text)
      return text ? `# ${text}` : ''
    }
    case 'heading_2': {
      const text = richTextToMarkdown(block.heading_2?.rich_text)
      return text ? `## ${text}` : ''
    }
    case 'heading_3': {
      const text = richTextToMarkdown(block.heading_3?.rich_text)
      return text ? `### ${text}` : ''
    }
    case 'bulleted_list_item': {
      const text = richTextToMarkdown(block.bulleted_list_item?.rich_text)
      if (!text) return ''
      const childContent = block.children?.map(child => blockToMarkdown(child, depth + 1)).filter(Boolean).join('\n')
      return childContent ? `${prepend}- ${text}\n${childContent}` : `${prepend}- ${text}`
    }
    case 'numbered_list_item': {
      const text = richTextToMarkdown(block.numbered_list_item?.rich_text)
      if (!text) return ''
      const childContent = block.children?.map(child => blockToMarkdown(child, depth + 1)).filter(Boolean).join('\n')
      return childContent ? `${prepend}1. ${text}\n${childContent}` : `${prepend}1. ${text}`
    }
    case 'toggle': {
      const text = richTextToMarkdown(block.toggle?.rich_text)
      const childContent = block.children?.map(child => blockToMarkdown(child, depth + 1)).filter(Boolean).join('\n')
      return childContent ? `${prepend}- ${text}\n${childContent}` : `${prepend}- ${text}`
    }
    case 'quote': {
      const text = richTextToMarkdown(block.quote?.rich_text)
      if (!text) return ''
      const lines = text.split('\n').map(line => `> ${line}`)
      const quotedChildren = block.children?.map(child => blockToMarkdown(child, depth)).filter(Boolean)
      if (quotedChildren && quotedChildren.length > 0) {
        return [...lines, ...quotedChildren.map(line => (line.startsWith('>') ? line : `> ${line}`))].join('\n')
      }
      return lines.join('\n')
    }
    case 'callout': {
      const emoji = block.callout?.icon?.emoji ? `${block.callout.icon.emoji} ` : ''
      const text = richTextToMarkdown(block.callout?.rich_text)
      if (!text) return ''
      const lines = `> ${emoji}${text}`
      const childContent = block.children?.map(child => blockToMarkdown(child, depth + 1)).filter(Boolean)
      if (childContent && childContent.length > 0) {
        return [lines, ...childContent.map(line => `> ${line.trimStart()}`)].join('\n')
      }
      return lines
    }
    case 'code': {
      const language = block.code?.language ?? ''
      const text = richTextToMarkdown(block.code?.rich_text)
      return `\`\`\`${language}\n${text}\n\`\`\``
    }
    case 'divider':
      return '---'
    case 'image': {
      const caption = richTextToMarkdown(block.image?.caption)
      const url = block.image?.type === 'external'
        ? block.image.external.url
        : block.image?.file?.url
      if (!url) return ''
      return `![${caption}](${url})`
    }
    case 'bookmark': {
      const url = block.bookmark?.url
      const caption = richTextToMarkdown(block.bookmark?.caption)
      if (!url) return ''
      return caption ? `[${caption}](${url})` : url
    }
    case 'equation': {
      const expression = block.equation?.expression
      return expression ? `$$${expression}$$` : ''
    }
    default: {
      const content = block[block.type]?.rich_text
      const text = richTextToMarkdown(content)
      const fallback = text || `<!-- Unsupported block type: ${block.type} -->`
      if (block.children && block.children.length > 0) {
        const childContent = block.children
          .map(child => blockToMarkdown(child, depth + 1))
          .filter(Boolean)
          .join('\n')
        return `${fallback}\n${childContent}`
      }
      return fallback
    }
  }
}

function blocksToMarkdown(blocks: NotionBlock[]): string {
  const lines: string[] = []

  blocks.forEach((block, index) => {
    const content = blockToMarkdown(block)
    if (!content) {
      return
    }

    if (lines.length > 0 && !content.startsWith('- ') && !content.startsWith('1.') && !content.startsWith('> ') && !content.startsWith('#') && !content.startsWith('```') && !content.startsWith('<!') && !lines[lines.length - 1].startsWith('```')) {
      lines.push('')
    }

    lines.push(content)

    const nextBlock = blocks[index + 1]
    if (nextBlock && !content.endsWith('\n')) {
      lines.push('')
    }
  })

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim() || 'post'
}

export async function getQuotesFromNotion(): Promise<QuoteData[]> {
  if (!process.env.QUOTES_DATABASE_ID || !process.env.NOTION_TOKEN) {
    console.error('Missing required environment variables: QUOTES_DATABASE_ID and NOTION_TOKEN')
    throw new Error('Missing required environment variables: QUOTES_DATABASE_ID and NOTION_TOKEN')
  }

  try {
    console.log('Fetching quotes from Notion...')
    const pages = await queryNotionDatabase(process.env.QUOTES_DATABASE_ID)

    const quotes: QuoteData[] = pages.map((page: NotionPage) => {
      // Extract quote text from the "quote" property
      const quoteProperty = page.properties.quote
      let quoteText = ''
      
      if (quoteProperty && quoteProperty.type === 'title' && quoteProperty.title) {
        quoteText = extractPlainText(quoteProperty.title)
      } else if (quoteProperty && quoteProperty.type === 'rich_text' && quoteProperty.rich_text) {
        quoteText = extractPlainText(quoteProperty.rich_text)
      }

      // Extract author from page title
      const authorName = extractPageTitle(page)

      // Extract author link from author_link property (if exists)
      const authorLinkProperty = page.properties.author_link
      let authorLink = ''
      
      if (authorLinkProperty && authorLinkProperty.type === 'url' && authorLinkProperty.url) {
        authorLink = authorLinkProperty.url
      } else if (authorLinkProperty && authorLinkProperty.type === 'rich_text' && authorLinkProperty.rich_text) {
        authorLink = extractPlainText(authorLinkProperty.rich_text)
      }

      // Create author display text - use markdown link format if link exists
      const authorText = authorLink 
        ? `[${authorName}](${authorLink})`
        : authorName

      return {
        quote: quoteText,
        author: authorText,
      }
    }).filter((quote: QuoteData) => quote.quote && quote.author)

    console.log(`Successfully processed ${quotes.length} quotes from Notion`)
    return quotes
  } catch (error) {
    console.error('Error fetching quotes from Notion:', error)
    
    // Handle fetch errors and other issues
    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error('Quotes database not found. Please check your QUOTES_DATABASE_ID.')
      } else if (error.message.includes('401')) {
        throw new Error('Unauthorized access to Notion. Please check your NOTION_TOKEN.')
      } else if (error.message.includes('429')) {
        throw new Error('Notion API rate limit exceeded. Please try again later.')
      }
    }
    
    throw new Error('Failed to fetch quotes from Notion database')
  }
}

function extractStringProperty(page: NotionPage, propertyName: string): string {
  const property = page.properties[propertyName]
  if (!property) {
    return ''
  }

  if (property.type === 'rich_text') {
    return extractPlainText(property.rich_text)
  }

  if (property.type === 'title') {
    return extractPlainText(property.title)
  }

  if (property.type === 'formula' && property.formula?.type === 'string' && property.formula.string) {
    return property.formula.string
  }

  if (property.type === 'url' && property.url) {
    return property.url
  }

  return ''
}

export async function getBlogPostsFromNotion(): Promise<NotionBlogPost[]> {
  if (!process.env.BLOGS_DATABASE_ID || !process.env.NOTION_TOKEN) {
    console.error('Missing required environment variables: BLOGS_DATABASE_ID and NOTION_TOKEN')
    throw new Error('Missing required environment variables: BLOGS_DATABASE_ID and NOTION_TOKEN')
  }

  try {
    console.log('Fetching blog posts from Notion...')
    const pages = await queryNotionDatabase(process.env.BLOGS_DATABASE_ID)

    const publishedPages = pages.filter((page) => {
      const statusProperty = page.properties.Status
      if (statusProperty?.type === 'select' && statusProperty.select?.name) {
        return statusProperty.select.name.toLowerCase() === 'published'
      }
      return true
    })

    const blogPosts: NotionBlogPost[] = []

    for (const page of publishedPages) {
      const titleProperty = page.properties.Name ?? page.properties.Title ?? page.properties.title
      const title = titleProperty ? extractPlainText((titleProperty as NotionProperty).title) : extractPageTitle(page)
      const slugFromProperty = extractStringProperty(page, 'Slug')
      const slug = slugFromProperty || slugify(title)
      const summary = extractStringProperty(page, 'Summary')

      const publishDateProperty = page.properties['Publish Date'] ?? page.properties.publish_date ?? page.properties.Date
      let publishDate = new Date().toISOString().split('T')[0]
      if (publishDateProperty?.type === 'date' && publishDateProperty.date?.start) {
        publishDate = publishDateProperty.date.start
      }

      const canonicalUrl = extractStringProperty(page, 'Canonical URL')

      const tagsProperty = page.properties.Tags
      const tags = tagsProperty?.type === 'multi_select'
        ? tagsProperty.multi_select?.map(tag => tag.name).filter(Boolean) ?? []
        : []

      const statusProperty = page.properties.Status
      const status = statusProperty?.type === 'select' && statusProperty.select?.name
        ? statusProperty.select.name
        : 'Unknown'

      const rootBlocks = await fetchBlockChildren(page.id)
      const tree = await buildBlockTree(rootBlocks)
      const markdown = blocksToMarkdown(tree)

      blogPosts.push({
        id: page.id,
        title,
        slug,
        summary,
        publishDate,
        status,
        tags,
        canonicalUrl: canonicalUrl || undefined,
        lastEditedTime: page.last_edited_time,
        content: markdown,
      })
    }

    console.log(`Successfully processed ${blogPosts.length} blog posts from Notion`)
    return blogPosts
  } catch (error) {
    console.error('Error fetching blogs from Notion:', error)

    if (error instanceof Error) {
      if (error.message.includes('404')) {
        throw new Error('Blogs database not found. Please check your BLOGS_DATABASE_ID.')
      } else if (error.message.includes('401')) {
        throw new Error('Unauthorized access to Notion. Please check your NOTION_TOKEN.')
      } else if (error.message.includes('429')) {
        throw new Error('Notion API rate limit exceeded. Please try again later.')
      }
    }

    throw new Error('Failed to fetch blog posts from Notion database')
  }
}