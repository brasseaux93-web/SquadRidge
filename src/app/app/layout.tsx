"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/data/store";
import { cn } from "@/lib/utils";

const nav = [{ href: "/app", label: "Rooms" }];

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
      <div className="flex min-h-[50dvh] items-center justify-center text-ink-secondary">
        Checking session…
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-[var(--border-subtle)] bg-canvas/90 backdrop-blur-md">
        <div className="container-app flex h-14 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/app" className="font-display text-xl tracking-tight text-ink">
              SquadRidge
            </Link>
            <nav className="flex gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm transition-colors",
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "bg-white/[0.06] text-ink"
                      : "text-ink-secondary hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink-quiet sm:inline">
              {user.name} · {user.role}
            </span>
            <Button
              variant="ghost"
              className="min-h-[34px] px-3 py-1 text-xs"
              onClick={() => {
                signOut();
                router.push("/enter");
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container-app py-8">{children}</main>
    </div>
  );
}
