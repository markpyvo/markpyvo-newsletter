import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await fetch(
    `https://magic.beehiiv.com/v1/776356cb-d743-407a-b85d-6e58a838b418?email=${encodeURIComponent(email)}`,
    { method: "POST" }
  );

  return NextResponse.json({ ok: true });
}
