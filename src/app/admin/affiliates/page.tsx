import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";

export default async function AdminAffiliatesPage() {
  const affiliates = await db.affiliateAccount.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, firstName: true, lastName: true } },
    },
  });

  const pendingCount = await db.affiliateApplication.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
            Affiliates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage affiliate accounts and commissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/affiliates/applications">
            <Button variant="outline" size="sm">
              Applications
              {pendingCount > 0 && (
                <span className="ml-1.5 rounded-full bg-warning/20 px-1.5 text-xs text-warning">
                  {pendingCount}
                </span>
              )}
            </Button>
          </Link>
          <Link href="/admin/affiliates/payouts">
            <Button variant="outline" size="sm">Payouts</Button>
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Affiliate</th>
              <th className="px-4 py-3 font-medium">Code</th>
              <th className="px-4 py-3 font-medium">Rate</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Pending</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No affiliate accounts yet.
                </td>
              </tr>
            ) : (
              affiliates.map((affiliate) => (
                <tr
                  key={affiliate.id}
                  className="border-b border-border/60 hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium">
                      {affiliate.user.firstName} {affiliate.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {affiliate.user.email}
                    </p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{affiliate.code}</td>
                  <td className="px-4 py-3 tabular-nums">{affiliate.commissionRate}%</td>
                  <td className="px-4 py-3 tabular-nums">{affiliate.totalOrders}</td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatCurrency(affiliate.pendingEarnings)}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {formatCurrency(affiliate.paidEarnings)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        affiliate.status === "ACTIVE" ? "success" : "default"
                      }
                    >
                      {affiliate.status}
                    </Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
