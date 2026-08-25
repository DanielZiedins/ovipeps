"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function GeneratePayoutForm() {
  const router = useRouter();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear().toString());
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/affiliates/payouts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: Number(year), month: Number(month) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate payout");
      setSuccess(`Payout generated for ${month}/${year}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleGenerate} className="flex flex-wrap items-end gap-3">
      <Input
        label="Year"
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="w-24"
      />
      <Input
        label="Month"
        type="number"
        min={1}
        max={12}
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="w-24"
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Generating…" : "Generate Report"}
      </Button>
      {error && <p className="text-sm text-error">{error}</p>}
      {success && <p className="text-sm text-success">{success}</p>}
    </form>
  );
}

export function MarkPayoutPaidButton({ payoutItemId, amount }: { payoutItemId: string; amount: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"E_TRANSFER" | "CRYPTO">("E_TRANSFER");
  const [paymentAmount, setPaymentAmount] = useState(amount.toFixed(2));
  const [paidBy, setPaidBy] = useState("");
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [paymentReference, setPaymentReference] = useState("");

  async function handleMarkPaid() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/affiliates/payouts/${payoutItemId}/mark-paid`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentMethod,
            paymentAmount: Number(paymentAmount),
            paidBy,
            paidAt,
            paymentReference: paymentReference || undefined,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to mark as paid");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-w-[260px] space-y-2 rounded-lg border border-border bg-muted/20 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Record manual payment</p>
      <label className="block text-xs font-medium">Method
        <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as "E_TRANSFER" | "CRYPTO")} className="mt-1 h-9 w-full rounded-md border border-border bg-white px-2 text-sm">
          <option value="E_TRANSFER">e-Transfer</option>
          <option value="CRYPTO">Crypto</option>
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        <Input label="Amount sent" type="number" min="0.01" step="0.01" value={paymentAmount} onChange={(event) => setPaymentAmount(event.target.value)} />
        <Input label="Date paid" type="date" value={paidAt} onChange={(event) => setPaidAt(event.target.value)} />
      </div>
      <Input label="Sent by (employee)" placeholder="Employee name" value={paidBy} onChange={(event) => setPaidBy(event.target.value)} />
      <Input label="Reference / transaction ID" placeholder="Optional" value={paymentReference} onChange={(event) => setPaymentReference(event.target.value)} />
      <Button size="sm" onClick={handleMarkPaid} disabled={loading || !paidBy.trim() || !paidAt || Number(paymentAmount) <= 0}>
        {loading ? "Saving…" : "Confirm paid"}
      </Button>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
