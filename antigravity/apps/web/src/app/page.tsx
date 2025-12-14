import Link from "next/link";
import { Suspense } from "react";
import { RealtimeFeed } from "@/components/RealtimeFeed";

export default function HomePage() {
  return (
    <section className="space-y-10">
      <header className="space-y-4">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Google Antigravity</p>
        <h1 className="text-5xl font-semibold text-white">Planet-scale spatial runtime</h1>
        <p className="text-xl text-slate-300">
          Zero-lag multiplayer, persistent CRDT worlds, and autonomous agent swarms deployed in under 3 minutes.
        </p>
        <div className="flex gap-3">
          <Link className="rounded-full bg-antigravity-primary px-6 py-2 font-medium text-black" href="/world">
            Enter Earth-001
          </Link>
          <a className="rounded-full border border-white/30 px-6 py-2" href="https://fly.io/dashboard" target="_blank" rel="noreferrer">
            Launch Fly global mesh
          </a>
        </div>
      </header>
      <Suspense fallback={<p className="text-slate-500">Syncing…</p>}>
        <RealtimeFeed />
      </Suspense>
    </section>
  );
}
