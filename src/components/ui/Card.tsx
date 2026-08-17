import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass rounded-xl p-5 shadow-soft",
        className
      )}
    >
      {children}
    </div>
  );
}
