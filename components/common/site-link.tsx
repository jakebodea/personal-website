import { Link } from '@tanstack/react-router'
import { forwardRef, type AnchorHTMLAttributes } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

const SiteLink = forwardRef<HTMLAnchorElement, Props>(function SiteLink({ href, ...props }, ref) {
  if (/^(https?:|mailto:|tel:)/.test(href) || href.startsWith('#') || props.target) {
    return <a href={href} ref={ref} {...props} />
  }
  return <Link to={href as '/'} ref={ref} {...props} />
})

export default SiteLink
