import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "danger" | "warning" | "success" | "private" | "consented";
  className?: string;
}) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.04] text-ink-secondary",
    accent: "border-accent/30 bg-accent-muted text-accent",
    danger: "border-critical/30 bg-critical-muted text-critical",
    warning: "border-attention/30 bg-attention-muted text-attention",
    success: "border-progress/30 bg-progress-muted text-progress",
    private: "border-private/30 bg-private-muted text-private",
    consented: "border-consented/30 bg-consented-muted text-consented",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
