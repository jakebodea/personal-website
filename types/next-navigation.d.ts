declare module 'next/navigation' {
  export function useRouter(): {
    push: (url: string) => void;
    replace: (url: string) => void;
    back: () => void;
    forward: () => void;
    prefetch: (url: string) => void;
    // Add other methods as needed
  };
}
