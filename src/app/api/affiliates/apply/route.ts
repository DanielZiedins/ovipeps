import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const applySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  socialChannel: z.string().optional(),
  socialChannel2: z.string().optional(),
  socialChannel3: z.string().optional(),
  socialChannel4: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  audienceSize: z.string().optional(),
  primaryPlatform: z.string().optional(),
  promotionPlan: z.string().min(20, "Please describe your promotion plan in more detail"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = applySchema.parse(body);
    const session = await auth();

    if (session?.user?.id) {
      const existingForUser = await db.affiliateApplication.findUnique({
        where: { userId: session.user.id },
      });

      if (existingForUser) {
        return NextResponse.json(
          {
            error:
              existingForUser.status === "PENDING"
                ? "You already have a pending application under review."
                : "An application is already on file for your account.",
          },
          { status: 409 }
        );
      }
    }

    const existingEmail = await db.affiliateApplication.findFirst({
      where: {
        email: data.email.toLowerCase(),
        status: "PENDING",
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An application with this email is already pending review." },
        { status: 409 }
      );
    }

    const application = await db.affiliateApplication.create({
      data: {
        userId: session?.user?.id,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        socialChannel: [data.socialChannel, data.socialChannel2, data.socialChannel3, data.socialChannel4]
          .map((value) => value?.trim()).filter(Boolean).join(" | ") || undefined,
        website: data.website?.trim() || undefined,
        audienceSize: data.audienceSize?.trim() || undefined,
        primaryPlatform: data.primaryPlatform?.trim() || undefined,
        promotionPlan: data.promotionPlan.trim(),
      },
    });

    return NextResponse.json({ success: true, id: application.id });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message ?? "Please check the highlighted details." },
        { status: 400 }
      );
    }
    console.error("Affiliate application failed", error);
    return NextResponse.json(
      { error: "Invalid submission. Please check your details and try again." },
      { status: 400 }
    );
  }
}
