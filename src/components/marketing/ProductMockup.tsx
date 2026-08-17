/**
 * Static product interface mockup for the landing hero.
 * Illustrative only — not live data.
 */
export function ProductMockup() {
  return (
    <div
      className="overflow-hidden rounded-[18px] border bg-[var(--m-surface)] shadow-[var(--m-shadow)]"
      style={{ borderColor: "var(--m-border)" }}
      aria-hidden="true"
    >
      {/* Title bar */}
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5"
        style={{ borderColor: "var(--m-border)" }}
      >
        <div className="min-w-0">
          <p className="truncate text-[15px] font-medium text-[var(--m-ink)]">
            Team repair conversation
          </p>
          <p className="mt-0.5 text-xs text-[var(--m-ink-quiet)]">
            Facilitator-led session
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium"
          style={{
            background: "var(--m-accent-soft)",
            color: "var(--m-accent)",
          }}
        >
          Listening
        </span>
      </div>

      {/* Participants */}
      <div
        className="flex flex-wrap gap-2 border-b px-4 py-2.5 sm:px-5"
        style={{ borderColor: "var(--m-border)" }}
      >
        {["Facilitator", "Participant A", "Participant B"].map((role, i) => (
          <span
            key={role}
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-[var(--m-ink-secondary)]"
            style={{ borderColor: "var(--m-border)" }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{
                background: i === 0 ? "var(--m-accent)" : "var(--m-ink-quiet)",
              }}
            />
            {role}
          </span>
        ))}
      </div>

      {/* Dialogue */}
      <div className="space-y-4 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[11px] font-medium text-[var(--m-accent)]">
            Participant A
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--m-ink)]">
            I need us to acknowledge that the handoff process left people unclear
            on ownership.
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-[var(--m-ink-quiet)]">
            Participant B
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--m-ink)]">
            I hear that. The timeline pressure was real, and the checklist did not
            get the attention it needed.
          </p>
        </div>
        <div
          className="rounded-[14px] border px-3.5 py-3"
          style={{
            borderColor: "var(--m-border)",
            background: "var(--m-surface-soft)",
          }}
        >
          <p className="text-[11px] font-medium text-[var(--m-accent)]">
            Facilitator
          </p>
          <p className="mt-1 text-[14px] leading-relaxed text-[var(--m-ink)]">
            What do you need to be understood before we talk about next steps?
          </p>
        </div>
      </div>

      {/* State + commitment */}
      <div
        className="space-y-3 border-t px-4 py-4 sm:px-5"
        style={{ borderColor: "var(--m-border)", background: "#fafaf8" }}
      >
        <p className="text-[11px] text-[var(--m-ink-quiet)]">
          Live dialogue · temporary
        </p>
        <div
          className="rounded-[14px] border bg-[var(--m-surface)] px-3.5 py-3 shadow-[var(--m-shadow-sm)]"
          style={{ borderColor: "var(--m-border)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[11px] font-medium text-[var(--m-ink-quiet)]">
              Commitment
            </p>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                background: "var(--m-accent-soft)",
                color: "var(--m-accent)",
              }}
            >
              Approved by all participants
            </span>
          </div>
          <p className="mt-2 text-[14px] leading-snug text-[var(--m-ink)]">
            We agree to schedule a follow-up by Friday.
          </p>
        </div>
      </div>
    </div>
  );
}
