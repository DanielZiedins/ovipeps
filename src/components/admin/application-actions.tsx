"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");

  async function handleApprove() {
    setLoading("approve");
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/affiliates/applications/${applicationId}/approve`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to approve");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    setLoading("reject");
    setError(null);

    try {
      const res = await fetch(
        `/api/admin/affiliates/applications/${applicationId}/reject`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reviewNotes: rejectNotes }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to reject");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={loading !== null}
        >
          {loading === "approve" ? "Approving…" : "Approve"}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowReject(!showReject)}
          disabled={loading !== null}
        >
          Reject
        </Button>
      </div>

      {showReject && (
        <div className="space-y-2">
          <Textarea
            label="Rejection notes (optional)"
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            rows={2}
          />
          <Button
            size="sm"
            variant="danger"
            onClick={handleReject}
            disabled={loading !== null}
          >
            {loading === "reject" ? "Rejecting…" : "Confirm Reject"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  );
}
