"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

// Keep in sync with --background in src/styles.css.
export const THEME_COLOR_LIGHT = "#F7F7F4";
export const THEME_COLOR_DARK = "#14120B";

/**
 * Keeps mobile Safari's status bar and toolbar the same color as the page.
 * Renders fixed edge strips Safari samples from, and mirrors the resolved
 * background into theme-color for browsers and installed apps that use it.
 */
export const SafariEdges = () => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme === undefined) {
      return;
    }
    const color =
      resolvedTheme === "dark" ? THEME_COLOR_DARK : THEME_COLOR_LIGHT;
    for (const meta of document.querySelectorAll<HTMLMetaElement>(
      'meta[name="theme-color"]'
    )) {
      meta.content = color;
    }
  }, [resolvedTheme]);

  return (
    <>
      <div aria-hidden className="safari-edge safari-edge-top" />
      <div aria-hidden className="safari-edge safari-edge-bottom" />
    </>
  );
};
