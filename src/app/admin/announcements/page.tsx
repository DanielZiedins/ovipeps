import { AnnouncementManager } from "@/components/admin/announcement-manager";
import { db } from "@/lib/db";

export default async function AdminAnnouncementsPage() {
  const announcements = await db.announcement.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      message: true,
      link: true,
      linkText: true,
      active: true,
      sortOrder: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-navy-deep">
          Announcements
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage the announcement bar shown at the top of the site.
        </p>
      </div>

      <AnnouncementManager announcements={announcements} />
    </div>
  );
}
