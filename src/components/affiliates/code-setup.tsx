"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AffiliateCodeSetup() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setLoading(true); setError(null);
    try {
      const response = await fetch("/api/affiliates/code", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error ?? "Unable to save code");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to save code");
    } finally { setLoading(false); }
  }

  return (
    <Card className="border-sky/30 bg-sky/5">
      <CardHeader>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-success/10 text-success"><CheckCircle2 className="h-6 w-6" /></div>
        <CardTitle>Your application is approved</CardTitle>
        <CardDescription>Choose the permanent code customers will enter at checkout. It will also be used in your personal referral link.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end">
          <Input label="Choose your affiliate code" placeholder="IVO15" value={code} onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))} minLength={4} maxLength={24} hint="4–24 letters, numbers, or hyphens. Your code cannot be changed after saving." />
          <Button type="submit" disabled={loading || code.length < 4}>{loading ? "Saving…" : "Create my code"}</Button>
        </form>
        {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
      </CardContent>
    </Card>
  );
}
