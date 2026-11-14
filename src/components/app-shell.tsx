"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/catalog", label: "Catalog" },
  { href: "/dealers", label: "Dealers" },
  { href: "/quotations", label: "Quotations" },
  { href: "/orders", label: "Orders" },
  { href: "/inventory", label: "Inventory" },
  { href: "/production", label: "Production" },
  { href: "/invoices", label: "Invoices" },
  { href: "/purchases", label: "Purchases" },
  { href: "/reports", label: "Reports" },
  { href: "/integrations", label: "Integrations" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({
  children,
  brandName,
  legalName,
  userName,
  role,
}: {
  children: React.ReactNode;
  brandName: string;
  legalName: string;
  userName: string;
  role: string;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--sf-canvas)] text-[var(--sf-ink)]">
      <div className="flex min-h-screen">
        <aside className="hidden w-56 shrink-0 flex-col border-r border-[var(--sf-border)] bg-[var(--sf-ink)] text-[var(--sf-foam)] md:flex">
          <div className="border-b border-white/10 px-4 py-4">
            <div className="font-display text-lg font-bold tracking-tight text-white">
              SheetForge
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--sf-foam)]/70">
              {brandName}
            </div>
            <div className="mt-0.5 truncate text-xs text-white/50">{legalName}</div>
          </div>
          <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-sm transition ${
                    active
                      ? "bg-[var(--sf-accent)] text-[var(--sf-ink)] font-semibold"
                      : "text-white/75 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/10 px-4 py-3 text-xs text-white/55">
            <div className="font-medium text-white/80">{userName}</div>
            <div>{role} · Sample data</div>
            <Link href="/" className="mt-2 inline-block text-[var(--sf-accent)] hover:underline">
              Sign out
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-[var(--sf-border)] bg-[var(--sf-panel)] px-4 py-3 md:px-6">
            <div className="md:hidden">
              <div className="font-display text-base font-bold">SheetForge</div>
              <div className="text-[11px] text-[var(--sf-muted)]">{brandName}</div>
            </div>
            <div className="hidden text-sm text-[var(--sf-muted)] md:block">
              Foam-board manufacturing ERP · Pilot demo
            </div>
            <div className="rounded-full border border-[var(--sf-border)] bg-[var(--sf-canvas)] px-3 py-1 text-xs font-medium">
              Tenant: {legalName}
            </div>
          </header>

          <div className="overflow-x-auto border-b border-[var(--sf-border)] bg-[var(--sf-panel)] md:hidden">
            <div className="flex gap-1 px-2 py-2">
              {nav.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs ${
                      active
                        ? "bg-[var(--sf-ink)] text-white"
                        : "text-[var(--sf-muted)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <main className="flex-1 px-4 py-5 md:px-6 md:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
