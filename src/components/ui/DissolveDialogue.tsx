"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Signature close transition: live dialogue visually dissolves, leaving
 * approved commitment content that the parent keeps mounted.
 *
 * Represents application-level message purge on room close — not cryptographic erasure.
 */
export interface DissolveDialogueProps {
  /** When true, applies dissolve animation to children */
  dissolving?: boolean;
  /** Called after dissolve animation completes */
  onDissolved?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function DissolveDialogue({
  dissolving = false,
  onDissolved,
  className,
  children,
}: DissolveDialogueProps) {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (!dissolving) return;
    const ms = reduceMotion ? 0 : 1200;
    const t = window.setTimeout(() => onDissolved?.(), ms);
    return () => window.clearTimeout(t);
  }, [dissolving, onDissolved, reduceMotion]);

  return (
    <div
      className={cn(
        "transition-[opacity,filter,transform] duration-deliberate ease-out",
        dissolving && (reduceMotion ? "opacity-0" : "animate-dissolve"),
        className
      )}
      aria-hidden={dissolving || undefined}
      data-state={dissolving ? "dissolving" : "present"}
    >
      {children}
    </div>
  );
}
