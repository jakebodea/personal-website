#!/usr/bin/env bun

import { getQuotesFromNotion } from '../lib/notion'
import { createHash } from 'crypto'
import { writeFileSync, readFileSync } from 'fs'

/**
 * Check if quotes have changed since last check
 * Exits with code 0 if changed, 1 if unchanged, 2 on error
 */
async function checkQuotesChanged() {
  try {
    console.log('Fetching current quotes from Notion...')
    const quotes = await getQuotesFromNotion()
    
    // Create hash of quotes content (sorted for consistency)
    const quotesString = JSON.stringify(
      quotes.sort((a, b) => a.quote.localeCompare(b.quote))
    )
    const currentHash = createHash('sha256').update(quotesString).digest('hex')
    
    console.log(`Found ${quotes.length} quotes`)
    console.log(`Current hash: ${currentHash}`)
    
    // Read previous hash if it exists
    let previousHash = ''
    try {
      previousHash = readFileSync('quotes-hash.txt', 'utf8').trim()
      console.log(`Previous hash: ${previousHash}`)
    } catch (e) {
      console.log('No previous hash found (first run)')
    }
    
    // Compare hashes
    if (currentHash !== previousHash) {
      console.log('Quotes have changed! Build needed.')
      writeFileSync('quotes-hash.txt', currentHash)
      console.log('Saved new hash')
      process.exit(0) // Success - changes detected
    } else {
      console.log('No changes in quotes. Skipping build.')
      process.exit(1) // Exit with code 1 to skip build
    }
  } catch (error) {
    console.error('Error checking quotes:', error instanceof Error ? error.message : String(error))
    console.error('Will trigger build to be safe')
    process.exit(2) // Error - should probably build to be safe
  }
}

// Only run if called directly
if (import.meta.main) {
  await checkQuotesChanged()
}
