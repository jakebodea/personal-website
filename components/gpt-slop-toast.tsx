'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from "sonner";

export function GPTSlopToast() {
  const isFirstRender = useRef(true);
  const pathname = usePathname();

  useEffect(() => {
    if (isFirstRender.current && pathname !== "/chat") {
      setTimeout(() => {
        toast("you have my word  🤝", {
          description: "no GPT-slop on this website. every word is mine –– even emdashes",
          duration: 8000,
        });
      }, 500);
      isFirstRender.current = false;
    }
  }, [pathname]);

  return null;
} 
