import Link from "next/link";
import { getData, getPilotTenant } from "@/lib/store";

export default function LoginPage() {
  const tenant = getPilotTenant();
  const tenants = getData().tenants;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#14201c] text-white">
      {/* Atmospheric industrial plane */}
      <div
        className="pointer-events-none absolute inset-0 animate-grain-shift opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(158,201,184,0.18), transparent 42%), radial-gradient(circle at 80% 10%, rgba(208,137,58,0.16), transparent 36%), linear-gradient(160deg, #0f1916 0%, #1c2e28 48%, #24352f 100%)",
          backgroundSize: "140% 140%",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] animate-soft-pulse"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(255,255,255,0.04) 48px, rgba(255,255,255,0.04) 49px), repeating-linear-gradient(0deg, transparent, transparent 48px, rgba(255,255,255,0.03) 48px, rgba(255,255,255,0.03) 49px)",
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(158,201,184,0.22),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(208,137,58,0.2),transparent_70%)] blur-2xl" />

      <main className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16 md:px-10">
        <div className="max-w-xl">
          <p className="animate-fade-up font-display text-5xl font-extrabold tracking-tight text-white md:text-7xl">
            SheetForge
          </p>
          <h1 className="animate-fade-up-delay mt-5 max-w-lg font-display text-2xl font-semibold leading-snug text-[#d7e7df] md:text-3xl">
            Ops software for foam-board makers.
          </h1>
          <p className="animate-fade-up-late mt-4 max-w-md text-base leading-relaxed text-white/65">
            Quote, cut, stock, and invoice XPS/EPS sheets with lot tracking —
            multi-tenant from day one.
          </p>

          <div className="animate-fade-up-late mt-10 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="sf-btn-accent px-5 py-3 text-base">
              Enter {tenant.legalName} demo
            </Link>
            <span className="text-sm text-white/45">
              Sample data · no password required
            </span>
          </div>

          <div className="animate-fade-up-late mt-12 border-t border-white/10 pt-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
              Tenant switcher (mock)
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tenants.map((t) => (
                <Link
                  key={t.id}
                  href="/dashboard"
                  className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/80 backdrop-blur-sm transition hover:border-[var(--sf-accent)] hover:text-white"
                >
                  <span className="font-semibold">{t.brandName}</span>
                  <span className="mx-1.5 text-white/30">·</span>
                  <span className="text-white/55">{t.legalName}</span>
                </Link>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/40">
              Demo always opens the pilot tenant ({tenant.brandName} invoices /
              branding). Second tenant proves multi-tenant chrome only.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
