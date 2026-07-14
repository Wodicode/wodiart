import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type IntakePayload = {
  name: string;
  brand: string;
  email: string;
  phone: string;
  stage: string;
  needs: string[];
  details: string;
  budget: string;
  timeline: string;
};

function isValidPayload(body: unknown): body is IntakePayload {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    b.name.trim().length > 0 &&
    typeof b.brand === "string" &&
    b.brand.trim().length > 0 &&
    typeof b.email === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email.trim()) &&
    typeof b.phone === "string" &&
    b.phone.trim().length > 0 &&
    typeof b.stage === "string" &&
    b.stage.trim().length > 0 &&
    Array.isArray(b.needs) &&
    b.needs.length > 0 &&
    typeof b.details === "string" &&
    b.details.trim().length >= 50 &&
    typeof b.budget === "string" &&
    b.budget.trim().length > 0 &&
    typeof b.timeline === "string" &&
    b.timeline.trim().length > 0
  );
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INTAKE_TO_EMAIL;
  const fromEmail = process.env.INTAKE_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error("Missing Resend configuration: check RESEND_API_KEY, INTAKE_TO_EMAIL, INTAKE_FROM_EMAIL");
    return NextResponse.json({ error: "Email service is not configured" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const rows: [string, string][] = [
    ["Name", body.name],
    ["Business / brand", body.brand],
    ["Email", body.email],
    ["Phone / WhatsApp", body.phone],
    ["Business stage", body.stage],
    ["What they need", body.needs.join(", ")],
    ["Budget", body.budget],
    ["Timeline", body.timeline],
  ];

  const htmlRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#6B6B6B;white-space:nowrap;vertical-align:top;">${escapeHtml(
          label
        )}</td><td style="padding:4px 0;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  const html = `
    <div style="font-family:sans-serif;font-size:14px;color:#0A0A0A;">
      <h2 style="margin:0 0 16px;">New project request — Wodiart</h2>
      <table cellpadding="0" cellspacing="0">${htmlRows}</table>
      <p style="margin:20px 0 4px;color:#6B6B6B;">Project details</p>
      <p style="white-space:pre-wrap;margin:0;">${escapeHtml(body.details)}</p>
    </div>
  `;

  const text = [
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    "Project details:",
    body.details,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: body.email,
      subject: `New project request — ${body.brand}`,
      html,
      text,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Unexpected error sending intake email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
