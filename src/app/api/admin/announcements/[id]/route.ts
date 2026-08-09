import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const announcement = await db.announcement.update({
      where: { id },
      data: {
        active: typeof body.active === "boolean" ? body.active : undefined,
        message: typeof body.message === "string" ? body.message : undefined,
        link: typeof body.link === "string" ? body.link : undefined,
        linkText: typeof body.linkText === "string" ? body.linkText : undefined,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update announcement";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await db.announcement.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete announcement";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
