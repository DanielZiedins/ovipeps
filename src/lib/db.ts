import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient(): PrismaClient {
  if (process.env.TURSO_DATABASE_URL) {
    const adapter = new PrismaLibSql({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
    return new PrismaClient({ adapter });
  }

  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url }),
  });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getDb(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/** Lazy proxy — avoids crashing at import time if DB is unavailable */
export const db = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getDb();
    const value = client[prop as keyof PrismaClient];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
