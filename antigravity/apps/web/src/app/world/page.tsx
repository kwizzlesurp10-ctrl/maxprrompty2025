import { createObject } from "../actions";
import { WorldRealtimePanel } from "@/components/WorldRealtimePanel";

export default function WorldPage() {
  return (
    <section className="space-y-6">
      <header>
        <p className="text-sm text-slate-400">Earth-001</p>
        <h2 className="text-4xl font-semibold">Orbital fabrication deck</h2>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        <WorldRealtimePanel />
        <form action={createObject} className="space-y-4 rounded-3xl border border-white/10 bg-black/40 p-6">
          <label className="flex flex-col gap-2">
            <span className="text-sm uppercase tracking-wide text-slate-400">GLB URL</span>
            <input className="rounded-2xl border border-white/20 bg-black/60 p-3" name="glb" defaultValue="https://assets.keith.sh/spires.glb" required />
          </label>
          <button type="submit" className="rounded-full bg-antigravity-accent px-6 py-3 text-black">
            Instantiate persistent object
          </button>
        </form>
      </div>
    </section>
  );
}
