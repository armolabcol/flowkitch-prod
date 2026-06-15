import { NextResponse } from "next/server";
import {
  canCreateClientInCountry,
  forbidden,
  requireClientWrite,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import { createClientRecord, updateClientRecord } from "@/services/saas/clients-admin-service";

type PostBody = {
  name?: string;
  email?: string;
  country?: string;
  taxId?: string;
};

type PatchBody = {
  clientId?: string;
  name?: string;
  email?: string;
  country?: string;
  taxId?: string;
  stripeCustomerId?: string;
  wompiCustomerEmail?: string;
  assignedSalesAgentId?: string | null;
};

export async function POST(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  if (ctx.scope.kind === "portfolio") {
    return forbidden("Sales agents cannot create clients");
  }

  let body: PostBody;
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

  if (!canCreateClientInCountry(ctx.scope, country)) {
    return forbidden(`Cannot create clients in ${country}`);
  }

  const result = await createClientRecord({
    name,
    email,
    country,
    taxId: body.taxId,
    actorId: ctx.session.userId,
  });

  if (!result) {
    return NextResponse.json({ ok: false, message: "Create failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id, message: "Client created" });
}

export async function PATCH(request: Request) {
  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  if (!clientId) {
    return NextResponse.json({ ok: false, message: "clientId required" }, { status: 400 });
  }

  const access = await requireClientWrite(clientId);
  if ("error" in access && access.error) return access.error;

  const ok = await updateClientRecord(
    clientId,
    {
      name: body.name,
      email: body.email,
      country: body.country === "US" ? "US" : body.country === "CO" ? "CO" : undefined,
      taxId: body.taxId,
      stripeCustomerId: body.stripeCustomerId,
      wompiCustomerEmail: body.wompiCustomerEmail,
      assignedSalesAgentId: body.assignedSalesAgentId,
    },
    access.session.userId,
  );

  return NextResponse.json(
    ok ? { ok: true, message: "Client updated" } : { ok: false, message: "Update failed" },
    { status: ok ? 200 : 500 },
  );
}
