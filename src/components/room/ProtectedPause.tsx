"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Protected Pause — a calm, non-punitive way for any participant to request
 * a temporary halt or facilitator attention. No escalation theater.
 */

type PauseIntent =
  | "pause"
  | "support"
  | "concern"
  | "step_away";

const INTENTS: {
  id: PauseIntent;
  label: string;
  description: string;
}[] = [
  {
    id: "pause",
    label: "Request a pause",
    description: "Temporarily slow the conversation so the group can reset.",
  },
  {
    id: "support",
    label: "Need facilitator support",
    description: "Ask the facilitator for a private check-in or clarification.",
  },
  {
    id: "concern",
    label: "Raise a concern",
    description: "Flag something that needs careful handling. Not a formal complaint.",
  },
  {
    id: "step_away",
    label: "Step away briefly",
    description: "Leave the active exchange for a short time and return when ready.",
  },
];

export function ProtectedPause({
  onRequest,
  disabled,
  className,
}: {
  onRequest?: (intent: PauseIntent, note: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<PauseIntent | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!intent) return;
    onRequest?.(intent, note.trim());
    setSubmitted(true);
    setTimeout(() => {
      setOpen(false);
      setSubmitted(false);
      setIntent(null);
      setNote("");
    }, 1600);
  }

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="ghost"
        className="min-h-[36px] border-white/10 px-3 py-1.5 text-xs"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        Request pause / support
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Protected pause options"
          className="absolute right-0 z-30 mt-2 w-[min(100vw-2rem,22rem)] rounded-lg border border-[var(--border-default)] bg-raised p-4 shadow-lift"
        >
          {submitted ? (
            <div className="py-4 text-center">
              <p className="text-sm font-medium text-ink">Request recorded</p>
              <p className="mt-1 text-xs text-ink-secondary">
                The facilitator has been notified. You may continue or step away.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-ink-secondary">
                This is a private, non-punitive request. It is visible only to the
                assigned facilitator.
              </p>
              <ul className="mt-3 space-y-1.5" role="listbox">
                {INTENTS.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={intent === item.id}
                      onClick={() => setIntent(item.id)}
                      className={cn(
                        "w-full rounded-md border px-3 py-2 text-left transition-colors",
                        intent === item.id
                          ? "border-accent/40 bg-accent-muted"
                          : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"
                      )}
                    >
                      <div className="text-sm font-medium text-ink">{item.label}</div>
                      <div className="mt-0.5 text-[0.7rem] text-ink-quiet">
                        {item.description}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
              {intent && (
                <div className="mt-3">
                  <label htmlFor="pause-note" className="sr-only">
                    Optional note
                  </label>
                  <textarea
                    id="pause-note"
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional note for the facilitator…"
                    className="w-full rounded-md border border-white/10 bg-canvas px-3 py-2 text-sm text-ink placeholder:text-ink-quiet focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25"
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      className="min-h-[32px] px-3 py-1 text-xs"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="min-h-[32px] px-3 py-1 text-xs"
                      onClick={handleSubmit}
                    >
                      Send request
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
