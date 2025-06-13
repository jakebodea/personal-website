'use client';

import { useEffect, useRef } from 'react';
import { toast } from "sonner";

export function SiteToast() {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setTimeout(() => {
        toast.success("You have my word  🤝", {
          description: "You will not be reading GPT-slop on this website. Every word is mine!",
          duration: 8000,
        });
      }, 1000);
      isFirstRender.current = false;
    }
  }, []);

  return null;
} 