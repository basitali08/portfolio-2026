/**
 * Optional contact endpoint.
 * Wire Resend (or any provider) by:
 *   1. pnpm add resend
 *   2. set RESEND_API_KEY in .env.local
 *   3. uncomment the block below
 */
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };
    if (!body.email || !body.message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "Portfolio <noreply@your-domain.com>",
    //   to: "hello@example.com",
    //   replyTo: body.email,
    //   subject: `[Portfolio] ${body.name ?? "New lead"}`,
    //   text: body.message,
    // });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
