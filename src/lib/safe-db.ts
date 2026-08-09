import { db } from "./db";

/** Safely query the database — returns fallback if DB is unavailable (e.g. during Vercel build without Turso). */
export async function safeDbQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[safeDbQuery] Database unavailable:", error);
    }
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
    []
  );
}
