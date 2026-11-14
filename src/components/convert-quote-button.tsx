"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export function ConvertQuoteButton({
  quotationId,
  disabled,
}: {
  quotationId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={disabled || pending}
        className="sf-btn-accent disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => {
          setError(null);
          startTransition(async () => {
            const res = await fetch("/api/quotations/convert", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ quotationId }),
            });
            const body = await res.json();
            if (!res.ok) {
              setError(body.error ?? "Convert failed");
              return;
            }
            router.push(`/orders/${body.orderId}`);
            router.refresh();
          });
        }}
      >
        {pending ? "Converting…" : "Convert to sales order"}
      </button>
      {error ? <span className="text-xs text-rose-700">{error}</span> : null}
    </div>
  );
}
