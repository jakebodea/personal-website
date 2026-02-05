'use client';

import { useEffect, useRef } from 'react';
import { toast } from "sonner";

export function GPTSlopToast() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setTimeout(() => {
        toast("you have my word  🤝", {
          description: "no GPT-slop on this website. every word is mine –– even emdashes",
          duration: 8000,
        });
      }, 500);
      isFirstRender.current = false;
    }
  }, []);

  return null;
} 