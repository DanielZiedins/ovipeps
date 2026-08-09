"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PaymentReferenceFormProps {
  orderNumber: string;
  initialReference?: string | null;
}

export function PaymentReferenceForm({
  orderNumber,
  initialReference,
}: PaymentReferenceFormProps) {
  const [reference, setReference] = useState(initialReference ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(Boolean(initialReference));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!reference.trim()) {
      setError("Please enter your e-Transfer reference or message");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentReference: reference.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to save payment reference");
      }

      setSaved(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save payment reference"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (saved && !isSubmitting) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-success/25 bg-success/8 p-4">
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
        <div>
          <p className="font-medium text-foreground">Payment reference saved</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reference: <span className="font-mono">{reference}</span>
          </p>
          <button
            type="button"
            onClick={() => setSaved(false)}
            className="mt-2 text-sm font-medium text-navy hover:underline"
          >
            Update reference
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="e-Transfer reference / message"
        placeholder="Enter the message you used when sending payment"
        hint="Include your order number or any reference from your bank transfer."
        value={reference}
        onChange={(event) => setReference(event.target.value)}
        error={error ?? undefined}
      />
      <Button type="submit" variant="primary" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Payment Reference"
        )}
      </Button>
    </form>
  );
}
