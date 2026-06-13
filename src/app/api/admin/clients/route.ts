import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import { createClientRecord } from "@/services/saas/clients-admin-service";

type Body = {
  name?: string;
  email?: string;
  country?: string;
  taxId?: string;
};

export async function POST(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim();
  const country = body.country === "US" ? "US" : "CO";

  if (!name || !email) {
    return NextResponse.json(
      { ok: false, message: "name and email required" },
      { status: 400 },
    );
  }

  const result = await createClientRecord({
    name,
    email,
    country,
    taxId: body.taxId,
    actorId: session.userId,
  });

  if (!result) {
    return NextResponse.json({ ok: false, message: "Create failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id, message: "Client created" });
}
