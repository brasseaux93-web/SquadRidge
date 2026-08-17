"use client";

export function DemoBanner() {
  return (
    <div
      role="status"
      className="border-b border-attention/20 bg-attention-muted/60 px-4 py-2 text-center text-[0.7rem] leading-relaxed text-attention"
    >
      <span className="font-medium">Demo mode</span>
      <span className="mx-2 text-attention/50">·</span>
      Fixture data only. Session messages are purged when a room closes. No live
      identity verification or production encryption is active in this prototype.
    </div>
  );
}
