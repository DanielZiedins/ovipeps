import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const maxSort = await db.announcement.aggregate({
      _max: { sortOrder: true },
    });

    const announcement = await db.announcement.create({
      data: {
        message,
        link: typeof body.link === "string" ? body.link.trim() || null : null,
        linkText:
          typeof body.linkText === "string" ? body.linkText.trim() || null : null,
        active: true,
        sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create announcement";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
