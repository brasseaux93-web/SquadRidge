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
        "flex flex-col items-start justify-center rounded-[14px] border border-dashed border-border-default bg-surface-soft/60 px-5 py-10",
        className
      )}
    >
      <h3 className="text-[14px] font-medium tracking-tight text-ink">{title}</h3>
      {description && (
        <p className="mt-2 max-w-prose text-[14px] leading-relaxed text-ink-secondary">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
