"use client";

export function DemoBanner() {
  return (
    <div
      role="status"
      className="border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2 text-center text-[11px] leading-relaxed tracking-wide text-ink-quiet"
    >
      <span className="font-medium text-ink-secondary">Prototype</span>
      <span className="mx-2 opacity-40">·</span>
      Sample data only. Not a production identity or encryption system.
    </div>
  );
}
