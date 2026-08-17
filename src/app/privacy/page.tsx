import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="container-app max-w-2xl py-16">
      <Link href="/" className="text-sm text-ink-muted hover:text-accent">
        ← SquadRidge
      </Link>
      <h1 className="mt-6 font-serif text-3xl text-ink">Privacy</h1>
      <div className="mt-6 space-y-4 text-ink-muted">
        <p>
          SquadRidge is designed around <strong className="text-ink">minimized retention</strong> of
          live dialogue. The product intent is that session messages exist for facilitation and are
          not kept as a searchable transcript after the room closes. Approved outcome ledger entries
          are retained so agreements can be followed through.
        </p>
        <p>
          In-room identities are facilitator-assigned roles. Real names used for verification are not
          meant to be the primary label inside the dialogue space.
        </p>
        <p>
          <strong className="text-ink">This prototype</strong> stores data in the browser session via
          a local demo store. It does not provide production encryption, legal compliance
          certification, or guarantees against screenshots or external note-taking.
        </p>
        <p>
          No session dialogue in this demo is sent to external model-training pipelines.
        </p>
      </div>
    </div>
  );
}
