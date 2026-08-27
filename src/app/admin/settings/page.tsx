import { SettingsEditor } from "@/components/admin/settings-editor";
import { db } from "@/lib/db";

const CORE_SETTING_KEYS = [
  "etransfer_email",
  "etransfer_instructions",
  "shipping_threshold",
  "free_shipping_message",
  "affiliate_attribution_days",
  "commission_hold_days",
  "site_name",
  "support_email",
  "research_disclaimer",
];

export default async function AdminSettingsPage() {
  const allSettings = await db.siteSetting.findMany({
    where: { key: { in: CORE_SETTING_KEYS } },
    orderBy: { key: "asc" },
  });

  const settings = CORE_SETTING_KEYS.map((key) => {
    const found = allSettings.find((s) => s.key === key);
    return { key, value: found?.value ?? "" };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
          Site Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure store settings, payment instructions, and affiliate defaults.
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-border bg-card p-6">
        <SettingsEditor settings={settings} />
      </div>
    </div>
  );
}
