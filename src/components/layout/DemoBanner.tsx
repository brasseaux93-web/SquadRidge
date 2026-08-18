"use client";

/**
 * Single global prototype disclosure. Do not duplicate this copy on page bodies.
 */
export function DemoBanner() {
  return (
    <div
      role="status"
      className="border-b border-border-subtle bg-surface-soft px-4 py-2 text-center text-[12px] leading-relaxed text-ink-quiet"
    >
      Prototype preview - sample data only. Production identity verification and
      encryption are not active.
    </div>
  );
}
