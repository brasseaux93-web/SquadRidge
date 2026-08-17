import { cn } from "@/lib/utils";

export type PrivacyScope =
  | "room"
  | "facilitators"
  | "organization"
  | "ledger"
  | "demo";

const LABELS: Record<
  PrivacyScope,
  { text: string; tone: string; title: string }
> = {
  room: {
    text: "Visible to this room",
    tone: "border-private/40 bg-private-muted text-private",
    title: "Content is limited to active room members while the session is open.",
  },
  facilitators: {
    text: "Facilitators only",
    tone: "border-attention/40 bg-attention-muted text-attention",
    title: "Visible to assigned facilitators and organization admins.",
  },
  organization: {
    text: "Organization",
    tone: "border-private/40 bg-private-muted text-private",
    title: "Visible within the authorized organization boundary.",
  },
  ledger: {
    text: "Consented ledger",
    tone: "border-consented/40 bg-consented-muted text-consented",
    title: "Eligible for anonymized publication only after explicit consent and approval.",
  },
  demo: {
    text: "Demo data",
    tone: "border-attention/35 bg-attention-muted text-attention",
    title: "Fixture or demonstration data. Not a live pilot record.",
  },
};

export function PrivacyLabel({
  scope,
  className,
}: {
  scope: PrivacyScope;
  className?: string;
}) {
  const cfg = LABELS[scope];
  return (
    <span
      className={cn("privacy-chip", cfg.tone, className)}
      title={cfg.title}
      role="status"
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current opacity-80"
        aria-hidden
      />
      {cfg.text}
    </span>
  );
}
