import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    // Placeholder for email/CRM integration — validated submissions are accepted.
    console.info("[contact]", {
      name: data.name,
      email: data.email,
      subject: data.subject,
      messageLength: data.message.length,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Invalid submission. Please check your details and try again." },
      { status: 400 }
    );
  }
}
