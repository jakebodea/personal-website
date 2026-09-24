import homeContent from '@/content/home.md?raw'

export function getHomeContent(): string {
  return homeContent.trim()
}
