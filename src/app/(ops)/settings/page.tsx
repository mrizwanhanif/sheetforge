import { PageHeader } from "@/components/page-header";
import { getData, getPilotTenant } from "@/lib/store";

export default function SettingsPage() {
  const tenant = getPilotTenant();
  const users = getData().users.filter((u) => u.tenantId === tenant.id);
  const roles = getData().roles;

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Tenant branding, NTN fields, and day-one roles."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="sf-card p-5">
          <h2 className="font-display text-base font-semibold">Tenant branding</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-[var(--sf-border)] pb-2">
              <dt className="text-[var(--sf-muted)]">Legal name</dt>
              <dd className="font-medium">{tenant.legalName}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--sf-border)] pb-2">
              <dt className="text-[var(--sf-muted)]">Brand / invoice name</dt>
              <dd className="font-medium">{tenant.brandName}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--sf-border)] pb-2">
              <dt className="text-[var(--sf-muted)]">Logo text</dt>
              <dd
                className="font-display text-lg font-bold"
                style={{ color: tenant.primaryColor }}
              >
                {tenant.logoText}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--sf-border)] pb-2">
              <dt className="text-[var(--sf-muted)]">Primary / accent</dt>
              <dd className="flex items-center gap-2">
                <span
                  className="inline-block h-5 w-5 rounded"
                  style={{ background: tenant.primaryColor }}
                />
                <span
                  className="inline-block h-5 w-5 rounded"
                  style={{ background: tenant.accentColor }}
                />
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--sf-border)] pb-2">
              <dt className="text-[var(--sf-muted)]">NTN</dt>
              <dd className="font-mono font-medium">{tenant.ntn}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-[var(--sf-border)] pb-2">
              <dt className="text-[var(--sf-muted)]">STRN</dt>
              <dd className="font-mono font-medium">{tenant.strn || "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[var(--sf-muted)]">Slug</dt>
              <dd className="font-mono text-xs">{tenant.slug}</dd>
            </div>
          </dl>
          <p className="mt-4 text-xs text-[var(--sf-muted)]">
            Edit forms stubbed — values come from seed until Postgres + settings API.
          </p>
        </section>

        <section className="sf-card overflow-hidden">
          <div className="border-b border-[var(--sf-border)] px-5 py-3">
            <h2 className="font-display text-base font-semibold">Roles & users</h2>
          </div>
          <div className="border-b border-[var(--sf-border)] px-5 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--sf-muted)]">
              Day-one roles
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <span
                  key={r}
                  className="rounded border border-[var(--sf-border)] bg-[var(--sf-canvas)] px-2 py-1 text-xs font-medium"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <table className="sf-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="font-medium">{u.name}</td>
                  <td className="text-xs">{u.email}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
