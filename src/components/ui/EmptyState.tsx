import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-center rounded-lg border border-dashed border-white/10 bg-canvas/40 px-5 py-8",
        className
      )}
    >
      <h3 className="text-sm font-medium text-ink">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-prose text-sm text-ink-secondary">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
