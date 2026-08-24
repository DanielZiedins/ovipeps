import { db } from "@/lib/db";

export const OWNER_EMAIL = "ovipeps@gmail.com";
const LEGACY_ADMIN_EMAIL = "admin@ovipeps.ca";

/**
 * Resolve the owner's administrator account and migrate the legacy placeholder
 * login without changing its password hash.
 */
export async function getOrMigrateOwnerAdmin() {
  const owner = await db.user.findUnique({
    where: { email: OWNER_EMAIL },
  });

  if (owner) {
    await db.user.updateMany({
      where: {
        email: LEGACY_ADMIN_EMAIL,
        role: "ADMIN",
      },
      data: { role: "CUSTOMER" },
    });

    return owner.role === "ADMIN"
      ? owner
      : db.user.update({
          where: { id: owner.id },
          data: { role: "ADMIN" },
        });
  }

  const legacyAdmin = await db.user.findUnique({
    where: { email: LEGACY_ADMIN_EMAIL },
  });

  if (!legacyAdmin) return null;

  return db.user.update({
    where: { id: legacyAdmin.id },
    data: {
      email: OWNER_EMAIL,
      role: "ADMIN",
    },
  });
}
