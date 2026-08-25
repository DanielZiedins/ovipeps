import { ApplicationActions } from "@/components/admin/application-actions";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/utils";

export default async function AdminAffiliateApplicationsPage() {
  const applications = await db.affiliateApplication.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
          Affiliate Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve pending affiliate applications.
        </p>
      </div>

      {applications.length === 0 ? (
        <p className="text-sm text-muted-foreground">No pending applications.</p>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-border bg-card p-5 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-navy-deep">{app.name}</h2>
                  <p className="text-sm text-muted-foreground">{app.email}</p>
                  {app.user && (
                    <p className="text-xs text-muted-foreground">
                      Account: {app.user.email}
                    </p>
                  )}
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                {app.phone && (
                  <div>
                    <span className="text-muted-foreground">Phone: </span>{app.phone}
                  </div>
                )}
                {app.address1 && <div className="lg:col-span-2"><span className="text-muted-foreground">Address: </span>{[app.address1, app.address2, app.city, app.province, app.postalCode, app.country].filter(Boolean).join(", ")}</div>}
                <div><span className="text-muted-foreground">Canadian resident: </span>{app.canadianResident ? "Confirmed" : "Not confirmed"}</div>
                {app.website && (
                  <div>
                    <span className="text-muted-foreground">Website: </span>
                    {app.website}
                  </div>
                )}
                <div><span className="text-muted-foreground">$300 monthly commitment: </span>{app.monthlyMinimumAccepted ? "Accepted" : "Not accepted"}</div>
              </div>

              {app.socialChannel && <div className="rounded-lg bg-muted/30 p-3 text-sm"><span className="font-medium text-foreground">Social profiles: </span>{app.socialChannel}</div>}

              <div className="space-y-3 rounded-lg border border-border p-4 text-sm">
                {app.whyAffiliate && <p><span className="font-medium text-foreground">Why they want to join: </span>{app.whyAffiliate}</p>}
                {app.affiliateStrengths && <p><span className="font-medium text-foreground">Why they would be a good affiliate: </span>{app.affiliateStrengths}</p>}
                {app.promotionPlan && <p><span className="font-medium text-foreground">Promotion plan: </span>{app.promotionPlan}</p>}
              </div>

              <div className="rounded-lg border border-success/20 bg-success/5 p-4 text-sm">
                <p><span className="font-medium">Compliance agreement: </span>{app.complianceAccepted ? "Accepted" : "Not accepted"}</p>
                <p className="mt-1"><span className="font-medium">Electronic signature: </span>{app.signedName ?? "—"}</p>
                <p className="mt-1"><span className="font-medium">Signed: </span>{app.signedAt ? formatDate(app.signedAt) : "—"} {app.agreementVersion ? `(agreement ${app.agreementVersion})` : ""}</p>
              </div>

              <p className="text-xs text-muted-foreground">
                Applied {formatDate(app.createdAt)}
              </p>

              <ApplicationActions applicationId={app.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
