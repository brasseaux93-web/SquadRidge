"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppStore } from "@/data/store";
import { cn } from "@/lib/utils";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useAppStore((s) => s.currentUser);
  const signOut = useAppStore((s) => s.signOut);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user) router.replace("/enter");
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center text-[14px] text-ink-quiet">
        Preparing workspace…
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-canvas/90 backdrop-blur-md">
        <div className="container-app flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              href="/app"
              className="text-[15px] font-semibold tracking-tight text-ink"
            >
              SquadRidge
            </Link>
            <nav className="flex gap-1" aria-label="Workspace">
              <Link
                href="/app"
                className={cn(
                  "rounded-[10px] px-3 py-1.5 text-[13px] transition-colors",
                  pathname === "/app" || pathname.startsWith("/app/rooms")
                    ? "bg-white/[0.06] text-ink"
                    : "text-ink-secondary hover:text-ink"
                )}
              >
                Rooms
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-[13px]">
            <span className="hidden text-ink-quiet sm:inline">
              {user.name}
              <span className="mx-1.5 opacity-40">·</span>
              <span className="capitalize">{user.role}</span>
            </span>
            <button
              type="button"
              className="rounded-[10px] border border-[var(--border-default)] px-3 py-1.5 text-[13px] text-ink-secondary transition-colors hover:border-[var(--border-strong)] hover:text-ink"
              onClick={() => {
                signOut();
                router.push("/enter");
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="container-app py-10">{children}</main>
    </div>
  );
}
