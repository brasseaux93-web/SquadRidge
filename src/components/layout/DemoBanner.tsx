"use client";

export function DemoBanner() {
  return (
    <div
      role="status"
      className="border-b border-warning/25 bg-warning/10 px-4 py-2 text-center text-xs text-warning"
    >
      Demo mode — fixture data only. Session messages are purged when a room is
      closed. No real identity verification or encryption is active in this
      prototype.
    </div>
  );
}
