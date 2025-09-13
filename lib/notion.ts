import { QuoteData } from './quotes'

// Helper function to extract plain text from Notion rich text
function extractPlainText(richTextArray: any[]): string {
  if (!richTextArray || richTextArray.length === 0) {
    return ''
  }

  return richTextArray
    .map(textBlock => textBlock.plain_text)
    .join('')
    .replace(/\\n/g, '\n') // Convert literal \n to actual newlines
    .replace(/\\t/g, '\t') // Convert literal \t to actual tabs
    .trim()
}

// Helper function to extract page title
function extractPageTitle(page: any): string {
  // Try to get the title from page properties
  const titleProperty = Object.values(page.properties).find((prop: any) => prop.type === 'title')
  
  if (titleProperty && (titleProperty as any).title && (titleProperty as any).title.length > 0) {
    return extractPlainText((titleProperty as any).title)
  }
  
  return 'Unknown Author'
}

export async function getQuotesFromNotion(): Promise<QuoteData[]> {
  if (!process.env.QUOTES_DATABASE_ID || !process.env.NOTION_TOKEN) {
    console.error('Missing required environment variables: QUOTES_DATABASE_ID and NOTION_TOKEN')
    throw new Error('Missing required environment variables: QUOTES_DATABASE_ID and NOTION_TOKEN')
  }

  try {
    console.log('Fetching quotes from Notion...')
    
    // Use direct REST API call instead of SDK
    const response = await fetch(`https://api.notion.com/v1/databases/${process.env.QUOTES_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({}),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Notion API error response:', response.status, errorData)
      throw new Error(`Notion API error: ${response.status} - ${errorData}`)
    }

    const data = await response.json()

    const quotes: QuoteData[] = data.results.map((page: any) => {
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