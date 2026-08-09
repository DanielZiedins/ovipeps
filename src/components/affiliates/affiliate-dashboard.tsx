"use client";

import { useState, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Check,
  Copy,
  DollarSign,
  MousePointerClick,
  Percent,
  ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  COMMISSION_STATUS_LABELS,
  type AffiliateDashboardData,
} from "@/lib/affiliate-types";
import { SITE_URL } from "@/lib/content";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import type { CommissionStatus } from "@/generated/prisma/enums";

interface AffiliateDashboardProps {
  data: AffiliateDashboardData;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable
    }
  }

  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="flex gap-2">
        <code className="flex-1 truncate rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          {value}
        </code>
        <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function commissionBadgeVariant(status: CommissionStatus) {
  switch (status) {
    case "PAID":
      return "success" as const;
    case "APPROVED":
      return "research" as const;
    case "PENDING":
      return "warning" as const;
    case "REVERSED":
      return "default" as const;
    default:
      return "default" as const;
  }
}

function formatChartDate(date: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function DataTable({
  title,
  description,
  columns,
  rows,
  emptyMessage,
}: {
  title: string;
  description?: string;
  columns: { key: string; label: string; className?: string }[];
  rows: Record<string, ReactNode>[];
  emptyMessage: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        {rows.length === 0 ? (
          <p className="px-6 py-8 text-sm text-muted-foreground">{emptyMessage}</p>
        ) : (
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-6 py-3 font-medium text-muted-foreground",
                      col.className
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-b border-border/60 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className={cn("px-6 py-3", col.className)}>
                      {row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

export function AffiliateDashboard({ data }: AffiliateDashboardProps) {
  const referralUrl = `${SITE_URL}?r=${data.account.code}`;
  const pendingCommission = data.commissionByStatus.PENDING ?? 0;
  const approvedCommission = data.commissionByStatus.APPROVED ?? 0;
  const paidCommission = data.commissionByStatus.PAID ?? 0;

  const overviewCards = [
    {
      label: "Total clicks",
      value: data.account.totalClicks.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Referred orders",
      value: data.account.totalOrders.toLocaleString(),
      icon: ShoppingCart,
    },
    {
      label: "Conversion rate",
      value: `${data.conversionRate}%`,
      icon: Percent,
    },
    {
      label: "Pending commission",
      value: formatCurrency(pendingCommission),
      icon: DollarSign,
    },
    {
      label: "Approved commission",
      value: formatCurrency(approvedCommission),
      icon: DollarSign,
    },
    {
      label: "Paid commission",
      value: formatCurrency(paidCommission),
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 py-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <card.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="text-xl font-semibold text-navy-deep">{card.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your referral link</CardTitle>
          <CardDescription>
            Share this link to earn {data.account.commissionRate}% commission on
            qualifying orders. Attribution window: 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <CopyField label="Referral code" value={data.account.code} />
          <CopyField label="Referral URL" value={referralUrl} />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clicks (30 days)</CardTitle>
            <CardDescription>Daily referral link clicks</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {data.clickChart.length === 0 ? (
              <p className="text-sm text-muted-foreground">No click data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.clickChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(label) => formatChartDate(String(label))}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Clicks"
                    stroke="var(--color-teal)"
                    fill="var(--color-teal)"
                    fillOpacity={0.15}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commissions (30 days)</CardTitle>
            <CardDescription>Daily commission earned</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            {data.commissionChart.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No commission data yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.commissionChart}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatChartDate}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    labelFormatter={(label) => formatChartDate(String(label))}
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    name="Commission"
                    stroke="var(--color-navy)"
                    fill="var(--color-navy)"
                    fillOpacity={0.12}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <DataTable
        title="Referrals"
        description="Tracked attribution sessions from your referral link"
        emptyMessage="No referral sessions recorded yet."
        columns={[
          { key: "date", label: "Date" },
          { key: "code", label: "Code" },
          { key: "converted", label: "Converted" },
          { key: "expires", label: "Expires" },
        ]}
        rows={data.attributions.map((row) => ({
          date: formatDate(row.createdAt),
          code: row.code,
          converted: row.converted ? (
            <Badge variant="success">Yes</Badge>
          ) : (
            <Badge variant="default">No</Badge>
          ),
          expires: formatDate(row.expiresAt),
        }))}
      />

      <DataTable
        title="Orders"
        description="Orders attributed to your referral code"
        emptyMessage="No referred orders yet."
        columns={[
          { key: "order", label: "Order" },
          { key: "amount", label: "Order total" },
          { key: "commission", label: "Commission" },
          { key: "status", label: "Status" },
        ]}
        rows={data.commissions.map((row) => ({
          order: row.orderNumber,
          amount: formatCurrency(row.orderAmount),
          commission: formatCurrency(row.commissionAmount),
          status: (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={commissionBadgeVariant(row.status)}>
                {COMMISSION_STATUS_LABELS[row.status]}
              </Badge>
              {row.flagged ? (
                <Badge variant="warning">Under review</Badge>
              ) : null}
            </div>
          ),
        }))}
      />

      <DataTable
        title="Commissions"
        description="Full commission ledger with status tracking"
        emptyMessage="No commissions recorded yet."
        columns={[
          { key: "date", label: "Date" },
          { key: "order", label: "Order" },
          { key: "amount", label: "Commission" },
          { key: "status", label: "Status" },
        ]}
        rows={data.commissions.map((row) => ({
          date: formatDate(row.createdAt),
          order: row.orderNumber,
          amount: formatCurrency(row.commissionAmount),
          status: (
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={commissionBadgeVariant(row.status)}>
                {COMMISSION_STATUS_LABELS[row.status]}
              </Badge>
              {row.flagged ? (
                <Badge variant="warning" title={row.flagReason ?? undefined}>
                  Under review
                </Badge>
              ) : null}
            </div>
          ),
        }))}
      />

      <DataTable
        title="Payouts"
        description="Monthly payout history"
        emptyMessage="No payouts processed yet."
        columns={[
          { key: "period", label: "Period" },
          { key: "gross", label: "Gross sales" },
          { key: "owed", label: "Commission owed" },
          { key: "status", label: "Status" },
          { key: "paid", label: "Paid on" },
        ]}
        rows={data.payouts.map((row) => ({
          period: new Intl.DateTimeFormat("en-CA", {
            month: "long",
            year: "numeric",
          }).format(new Date(row.periodYear, row.periodMonth - 1, 1)),
          gross: formatCurrency(row.grossSales),
          owed: formatCurrency(row.commissionOwed),
          status: (
            <Badge
              variant={row.status === "PAID" ? "success" : "default"}
            >
              {row.status}
            </Badge>
          ),
          paid: row.paidAt ? formatDate(row.paidAt) : "—",
        }))}
      />
    </div>
  );
}
