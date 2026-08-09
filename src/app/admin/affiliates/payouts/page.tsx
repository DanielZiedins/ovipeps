import { GeneratePayoutForm, MarkPayoutPaidButton } from "@/components/admin/payout-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminAffiliatePayoutsPage() {
  const payouts = await db.affiliatePayout.findMany({
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
    include: {
      items: {
        include: {
          affiliate: {
            include: {
              user: { select: { email: true, firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
          Affiliate Payouts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate monthly payout reports and mark commissions as paid.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Monthly Report</CardTitle>
        </CardHeader>
        <CardContent>
          <GeneratePayoutForm />
        </CardContent>
      </Card>

      {payouts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No payout reports yet.</p>
      ) : (
        <div className="space-y-6">
          {payouts.map((payout) => (
            <Card key={payout.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {payout.periodMonth}/{payout.periodYear}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Total: {formatCurrency(payout.totalAmount)}
                  </p>
                </div>
                <Badge
                  variant={
                    payout.status === "PAID" ? "success" : "default"
                  }
                >
                  {payout.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Affiliate</th>
                      <th className="pb-3 pr-4 font-medium">Gross Sales</th>
                      <th className="pb-3 pr-4 font-medium">Commission</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium" />
                    </tr>
                  </thead>
                  <tbody>
                    {payout.items.map((item) => (
                      <tr key={item.id} className="border-b border-border/60">
                        <td className="py-3 pr-4">
                          <p className="font-medium">
                            {item.affiliate.user.firstName}{" "}
                            {item.affiliate.user.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.affiliate.user.email}
                          </p>
                        </td>
                        <td className="py-3 pr-4 tabular-nums">
                          {formatCurrency(item.grossSales)}
                        </td>
                        <td className="py-3 pr-4 tabular-nums">
                          {formatCurrency(item.commissionOwed)}
                        </td>
                        <td className="py-3 pr-4">
                          <Badge
                            variant={
                              item.status === "PAID" ? "success" : "default"
                            }
                          >
                            {item.status}
                          </Badge>
                          {item.paidAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(item.paidAt)}
                            </p>
                          )}
                        </td>
                        <td className="py-3">
                          {item.status !== "PAID" && (
                            <MarkPayoutPaidButton payoutItemId={item.id} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
