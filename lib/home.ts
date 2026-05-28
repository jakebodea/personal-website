import fs from 'fs'
import path from 'path'

export function getHomeContent(): string {
  const filePath = path.join(process.cwd(), 'content', 'home.md')
  return fs.readFileSync(filePath, 'utf8').trim()
}
