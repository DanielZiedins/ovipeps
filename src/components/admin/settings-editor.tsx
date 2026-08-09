"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SettingRow {
  key: string;
  value: string;
}

const SETTING_LABELS: Record<string, string> = {
  etransfer_email: "E-Transfer Email",
  etransfer_instructions: "E-Transfer Instructions",
  shipping_threshold: "Free Shipping Threshold ($)",
  free_shipping_message: "Free Shipping Message",
  affiliate_default_commission: "Default Affiliate Commission (%)",
  affiliate_attribution_days: "Affiliate Attribution Days",
  commission_hold_days: "Commission Hold Days",
  site_name: "Site Name",
  support_email: "Support Email",
  research_disclaimer: "Research Disclaimer",
};

export function SettingsEditor({ settings: initial }: { settings: SettingRow[] }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function updateValue(key: string, value: string) {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value } : s))
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to save");
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {settings.map((setting) => {
        const label = SETTING_LABELS[setting.key] ?? setting.key;
        const isLong = setting.value.length > 80 || setting.key.includes("instructions") || setting.key.includes("disclaimer") || setting.key.includes("message");

        return isLong ? (
          <Textarea
            key={setting.key}
            label={label}
            value={setting.value}
            onChange={(e) => updateValue(setting.key, e.target.value)}
            rows={3}
          />
        ) : (
          <Input
            key={setting.key}
            label={label}
            value={setting.value}
            onChange={(e) => updateValue(setting.key, e.target.value)}
          />
        );
      })}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save Settings"}
        </Button>
        {success && <p className="text-sm text-success">Settings saved.</p>}
        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    </form>
  );
}
