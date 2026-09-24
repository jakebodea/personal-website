"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useSyncExternalStore,
} from "react";
import { flushSync } from "react-dom";

import { ShortcutTooltip } from "@/components/common/shortcut-tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const iconSizeClasses = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

const themeOptions = [
  { value: "dark", label: "dark", icon: Moon },
  { value: "light", label: "light", icon: Sun },
  { value: "system", label: "system", icon: Monitor },
] as const;

const iconTransition = {
  duration: 0.15,
};

const emptySubscribe = (_onStoreChange: () => void) => () => {
  /* Static client snapshot; no subscription needed. */
};

const useIsClient = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

const ThemeIcon = ({
  theme,
  className,
}: {
  theme: string;
  className: string;
}) => {
  const option = themeOptions.find((o) => o.value === theme);
  const Icon = option?.icon ?? Moon;
  return <Icon className={className} />;
};

export const ThemeToggle = ({
  iconSize = "sm",
  shortcut,
  align = "start",
}: {
  iconSize?: "sm" | "md";
  shortcut?: string;
  align?: "start" | "end";
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const mounted = useIsClient();
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const triggerRectRef = useRef<DOMRect | null>(null);
  const setThemeWithTransitionRef = useRef<(newTheme: string) => void>(() => {
    /* Populated after setThemeWithTransition is defined. */
  });

  const capturePosition = useCallback(() => {
    if (triggerRef.current !== null) {
      triggerRectRef.current = triggerRef.current.getBoundingClientRect();
    }
  }, []);

  const setThemeWithTransition = useCallback(
    (newTheme: string) => {
      const supportsViewTransition =
        typeof document !== "undefined" && "startViewTransition" in document;

      if (!supportsViewTransition) {
        setTheme(newTheme);
        return;
      }

      const rect =
        triggerRectRef.current ?? triggerRef.current?.getBoundingClientRect();

      if (rect === null || rect === undefined) {
        setTheme(newTheme);
        return;
      }

      if (rect.x === 0 && rect.y === 0 && rect.width === 0) {
        setTheme(newTheme);
        return;
      }

      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const root = document.documentElement;
      root.style.setProperty("--reveal-x", `${x}px`);
      root.style.setProperty("--reveal-y", `${y}px`);

      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      });

      void (async () => {
        try {
          await transition.ready;
          root.animate(
            { "--reveal-size": [`0px`, `${endRadius + 80}px`] },
            {
              duration: 350,
              easing: "ease-out",
              fill: "forwards",
              pseudoElement: "::view-transition-new(root)",
            }
          );
        } catch {
          // View transition was cancelled or unsupported at runtime.
        }
      })();

      triggerRectRef.current = null;
    },
    [setTheme]
  );

  useEffect(() => {
    setThemeWithTransitionRef.current = setThemeWithTransition;
  });

  useEffect(() => {
    if (shortcut === undefined || shortcut === "") {
      return () => {
        /* No keyboard listener when shortcut is disabled. */
      };
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const { target } = e;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        return;
      }

      if (e.key === "t") {
        setThemeWithTransitionRef.current(
          resolvedTheme === "dark" ? "light" : "dark"
        );
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [shortcut, resolvedTheme]);

  useEffect(
    () => () => {
      if (leaveTimer.current !== null) {
        clearTimeout(leaveTimer.current);
      }
    },
    []
  );

  if (!mounted) {
    return null;
  }

  const sizeClass = iconSizeClasses[iconSize];

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") {
      return;
    }
    if (leaveTimer.current !== null) {
      clearTimeout(leaveTimer.current);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") {
      return;
    }
    leaveTimer.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  const trigger = (
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        ref={triggerRef}
        className="rounded-md p-2 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Toggle theme"
        onPointerDown={capturePosition}
        onPointerEnter={(e) => {
          capturePosition();
          handlePointerEnter(e);
        }}
        onPointerLeave={handlePointerLeave}
      >
        <LazyMotion features={domAnimation}>
          <AnimatePresence mode="wait">
            <m.div
              key={theme}
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={iconTransition}
            >
              <ThemeIcon theme={theme ?? "dark"} className={sizeClass} />
            </m.div>
          </AnimatePresence>
        </LazyMotion>
      </button>
    </DropdownMenuTrigger>
  );

  const hasShortcut = shortcut !== undefined && shortcut !== "";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      {hasShortcut ? (
        <ShortcutTooltip shortcut={shortcut} disabled={open}>
          {trigger}
        </ShortcutTooltip>
      ) : (
        trigger
      )}
      <DropdownMenuContent
        align={align}
        className="z-[90]"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        {themeOptions.map((option) => {
          const isActive = theme === option.value;
          return (
            <DropdownMenuItem
              key={option.value}
              onSelect={() => {
                setThemeWithTransition(option.value);
              }}
              className={
                isActive
                  ? "bg-accent/10 text-accent focus:bg-accent/10 focus:text-accent"
                  : "text-muted-foreground focus:bg-muted focus:text-foreground"
              }
            >
              <option.icon className="h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
