import type { ComponentProps } from 'react'

export default function SiteImage(props: ComponentProps<'img'>) {
  return <img loading="lazy" {...props} />
}
