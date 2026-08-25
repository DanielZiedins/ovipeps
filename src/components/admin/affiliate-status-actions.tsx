"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AffiliateStatusActions({ affiliateId, status }: { affiliateId: string; status: "ACTIVE" | "SUSPENDED" | "INACTIVE" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(nextStatus: string) {
    setLoading(true); setError(null);
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}/status`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to update status");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to update status");
    } finally { setLoading(false); }
  }

  return (
    <div>
      <select aria-label="Affiliate status" value={status} disabled={loading} onChange={(event) => updateStatus(event.target.value)} className="h-9 rounded-md border border-border bg-white px-2 text-xs">
        <option value="ACTIVE">Active</option>
        <option value="SUSPENDED">Suspended</option>
        <option value="INACTIVE">Terminated</option>
      </select>
      {error ? <p className="mt-1 max-w-36 text-xs text-error">{error}</p> : null}
    </div>
  );
}
