"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useAppStore } from "@/data/store";
import type { UserRole } from "@/domain/types";

const roles: { role: UserRole; title: string; description: string }[] = [
  {
    role: "facilitator",
    title: "Facilitator",
    description:
      "Manage rooms, set phases, review proposed outcomes, and close sessions with message purge.",
  },
  {
    role: "participant",
    title: "Participant",
    description:
      "Join a live room under a facilitator-assigned role and contribute to dialogue.",
  },
];

export default function EnterPage() {
  const enterAs = useAppStore((s) => s.enterAs);
  const router = useRouter();

  function choose(role: UserRole) {
    enterAs(role);
    if (role === "facilitator") {
      router.push("/app");
    } else {
      router.push("/room/room-1");
    }
  }

  return (
    <div className="container-app flex min-h-[80dvh] flex-col items-center justify-center py-16">
      <div className="mb-10 max-w-lg text-center">
        <Link href="/" className="font-serif text-2xl text-ink">
          SquadRidge
        </Link>
        <h1 className="mt-6 font-serif text-3xl text-ink">Enter the demo</h1>
        <p className="mt-3 text-ink-muted">
          Choose a role to explore the product. This is fixture-backed demo data—not a
          production identity system.
        </p>
      </div>
      <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
        {roles.map((r) => (
          <Card key={r.role} className="flex flex-col">
            <h2 className="text-lg font-medium text-ink">{r.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink-muted">{r.description}</p>
            <Button className="mt-6 w-full" onClick={() => choose(r.role)}>
              Continue as {r.title.toLowerCase()}
            </Button>
          </Card>
        ))}
      </div>
      <p className="mt-8 text-center text-xs text-ink-muted">
        <Link href="/" className="hover:text-accent">
          ← Back to product overview
        </Link>
      </p>
    </div>
  );
}
