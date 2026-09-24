"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { usePathname } from "@/lib/site-navigation";

// oxlint-disable-next-line sonarjs/function-name -- React components must use PascalCase; sonarjs camelCase rule conflicts.
export const GptSlopToast = () => {
  const isFirstRender = useRef(true);
  const pathname = usePathname();

  useEffect(() => {
    let timerId: number | undefined;

    if (isFirstRender.current && pathname !== "/chat") {
      isFirstRender.current = false;
      timerId = window.setTimeout(() => {
        toast("you have my word  🤝", {
          description:
            "no GPT-slop on this website. every word is mine –– even emdashes",
          duration: 8000,
        });
      }, 500);
    }

    return () => {
      if (timerId !== undefined) {
        window.clearTimeout(timerId);
      }
    };
  }, [pathname]);

  return null;
};
