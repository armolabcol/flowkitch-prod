import { NextResponse } from "next/server";
import {
  forbidden,
  requireClientWrite,
  requireScopedAdmin,
  unauthorized,
} from "@/lib/auth/admin-api-helpers";
import { getClientIdForRestaurant } from "@/services/saas/scope-service";
import {
  createRestaurantRecord,
  updateRestaurantRecord,
} from "@/services/saas/restaurants-admin-service";

type PostBody = {
  clientId?: string;
  name?: string;
  city?: string;
  country?: string;
  timezone?: string;
};

type PatchBody = {
  restaurantId?: string;
  name?: string;
  city?: string;
};

export async function POST(request: Request) {
  const ctx = await requireScopedAdmin();
  if (!ctx) return unauthorized();

  if (ctx.scope.kind === "portfolio") {
    return forbidden("Sales agents cannot create restaurants");
  }

  let body: PostBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const clientId = body.clientId?.trim();
  const name = body.name?.trim();
  const city = body.city?.trim();
  if (!clientId || !name || !city) {
    return NextResponse.json(
      { ok: false, message: "clientId, name, city required" },
      { status: 400 },
    );
  }

  const access = await requireClientWrite(clientId);
  if ("error" in access && access.error) return access.error;

  const country = body.country === "US" ? "US" : "CO";
  const result = await createRestaurantRecord({
    clientId,
    name,
    city,
    country,
    timezone: body.timezone,
    actorId: ctx.session.userId,
  });

  if (!result) {
    return NextResponse.json({ ok: false, message: "Create failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}

export async function PATCH(request: Request) {
  let body: PatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON" }, { status: 400 });
  }

  const restaurantId = body.restaurantId?.trim();
  if (!restaurantId) {
    return NextResponse.json({ ok: false, message: "restaurantId required" }, { status: 400 });
  }

  const clientId = await getClientIdForRestaurant(restaurantId);
  if (!clientId) {
    return NextResponse.json({ ok: false, message: "Restaurant not found" }, { status: 404 });
  }

  const access = await requireClientWrite(clientId);
  if ("error" in access && access.error) return access.error;

  const ok = await updateRestaurantRecord(
    restaurantId,
    { name: body.name, city: body.city },
    access.session.userId,
  );

  return NextResponse.json(
    ok ? { ok: true } : { ok: false, message: "Update failed" },
    { status: ok ? 200 : 500 },
  );
}
