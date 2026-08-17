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

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink-inverse hover:bg-accent-hover shadow-soft border border-transparent",
  ghost:
    "bg-transparent text-ink border border-white/15 hover:border-accent hover:bg-white/[0.04]",
  danger:
    "bg-danger/10 text-danger border border-danger/40 hover:bg-danger/20",
  subtle:
    "bg-elevated text-ink border border-white/8 hover:border-white/15",
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
        "inline-flex min-h-[42px] items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
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
