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

  if (owner) return owner;

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

/** Promote the verified owner login and retire the placeholder admin identity. */
export async function activateOwnerAdmin(userId: string) {
  return db.$transaction(async (tx) => {
    await tx.user.updateMany({
      where: {
        email: LEGACY_ADMIN_EMAIL,
        role: "ADMIN",
      },
      data: { role: "CUSTOMER" },
    });

    return tx.user.update({
      where: { id: userId },
      data: { role: "ADMIN" },
    });
  });
}
