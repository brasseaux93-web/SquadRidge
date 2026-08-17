import Link from "next/link";

export default function SecurityPage() {
  return (
    <div className="container-app max-w-2xl py-16">
      <Link href="/" className="text-sm text-ink-muted hover:text-accent">
        ← SquadRidge
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-ink">Security overview</h1>
      <div className="mt-6 space-y-4 text-ink-muted">
        <p>
          The marketing source describes encrypted live-room communication and minimized retention.
          Those are product goals for a production deployment.
        </p>
        <p>
          <strong className="text-ink">This repository is a prototype.</strong> It uses local
          fixtures and an in-memory store. It does not implement transport encryption beyond normal
          HTTPS hosting, server-side key management, formal access auditing, or third-party security
          certifications.
        </p>
        <p>
          Role boundaries are modeled in the UI and domain types so a future backend can enforce them
          with real authorization. Until then, treat all data as non-sensitive demo content.
        </p>
      </div>
    </div>
  );
}
