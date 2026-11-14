import { AppShell } from "@/components/app-shell";
import { getData, getPilotTenant } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const tenant = getPilotTenant();
  const user = getData().users.find((u) => u.role === "Owner")!;

  return (
    <AppShell
      brandName={tenant.brandName}
      legalName={tenant.legalName}
      userName={user.name}
      role={user.role}
    >
      {children}
    </AppShell>
  );
}
