import { db } from "./db";
import { FALLBACK_ANNOUNCEMENTS } from "./fallback-data";

/** Safely query the database — returns fallback if DB is unavailable (e.g. during Vercel build without Turso). */
export async function safeDbQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getAnnouncements() {
  return safeDbQuery(
    () =>
      db.announcement.findMany({
        where: { active: true },
        orderBy: { sortOrder: "asc" },
        select: { id: true, message: true, link: true, linkText: true },
      }),
    FALLBACK_ANNOUNCEMENTS
  );
}
