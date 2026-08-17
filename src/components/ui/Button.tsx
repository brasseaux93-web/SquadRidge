"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "danger" | "subtle";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
  loading?: boolean;
}

/** Light-theme variants — semantic tokens only, no hardcoded hex */
const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink-inverse hover:bg-accent-hover shadow-soft border border-transparent",
  ghost:
    "bg-transparent text-ink border border-border-default hover:border-accent hover:bg-accent-muted",
  danger:
    "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/15",
  subtle:
    "bg-surface text-ink border border-border-subtle hover:border-border-default shadow-soft",
};

export function Button({
  variant = "primary",
  className,
  children,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      whileTap={reduce || disabled ? undefined : { scale: 0.98 }}
      className={cn(
        "inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[12px] px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Working…" : children}
    </motion.button>
  );
}
