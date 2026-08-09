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

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                {app.socialChannel && (
                  <div>
                    <span className="text-muted-foreground">Social: </span>
                    {app.socialChannel}
                  </div>
                )}
                {app.website && (
                  <div>
                    <span className="text-muted-foreground">Website: </span>
                    {app.website}
                  </div>
                )}
                {app.audienceSize && (
                  <div>
                    <span className="text-muted-foreground">Audience: </span>
                    {app.audienceSize}
                  </div>
                )}
                {app.primaryPlatform && (
                  <div>
                    <span className="text-muted-foreground">Platform: </span>
                    {app.primaryPlatform}
                  </div>
                )}
              </div>

              {app.promotionPlan && (
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Plan: </span>
                  {app.promotionPlan}
                </p>
              )}

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
