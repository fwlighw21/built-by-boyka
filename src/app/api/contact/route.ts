import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, goal, packageName, message } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Please provide your name" }, { status: 400 });
    }

    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json({ error: "Please provide a valid phone or WhatsApp number" }, { status: 400 });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Please provide a message or description of your goals" }, { status: 400 });
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email ? email.trim() : null,
        goal: goal || "General Coaching",
        packageName: packageName || null,
        message: message.trim(),
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, inquiryId: inquiry.id }, { status: 201 });
  } catch (error) {
    console.error("Error creating contact inquiry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
