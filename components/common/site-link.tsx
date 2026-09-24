/* oxlint-disable prefer-arrow-callback -- forwardRef uses named functions for react(function-component-definition) */
import { Link } from "@tanstack/react-router";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children?: ReactNode;
};

const EXTERNAL_HREF_PATTERN = /^(?<protocol>https?:|mailto:|tel:)/u;

const isExternalHref = (href: string) => EXTERNAL_HREF_PATTERN.test(href);

const SiteLink = forwardRef<HTMLAnchorElement, Props>(function SiteLink(
  { href, children, target, ...props },
  ref
) {
  if (
    isExternalHref(href) ||
    href.startsWith("#") ||
    (target !== undefined && target !== "")
  ) {
    return (
      <a href={href} ref={ref} target={target} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link to={href} ref={ref} {...props}>
      {children}
    </Link>
  );
});

SiteLink.displayName = "SiteLink";

export default SiteLink;
