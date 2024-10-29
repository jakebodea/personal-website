'use client';

import { useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export function SiteToast() {
  const { toast } = useToast();
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      setTimeout(() => {
        toast({
          title: "🚧 Website is Still Under Construction",
          description: "You'll probably see some rough edges and empty pages, sorry!",
          variant: "destructive",
          duration: 10000,
        });
      }, 100);
      isFirstRender.current = false;
    }
  }, [toast]);

  return null;
} 