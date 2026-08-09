"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";

interface UpdateProfileInput {
  firstName: string;
  lastName: string;
  phone?: string;
}

export async function updateProfile(data: UpdateProfileInput) {
  const session = await requireAuth();
  if (!session?.user?.id) {
    throw new Error("You must be signed in to update your profile.");
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone?.trim() || null,
    },
  });

  revalidatePath("/account");
  revalidatePath("/account/settings");
}
