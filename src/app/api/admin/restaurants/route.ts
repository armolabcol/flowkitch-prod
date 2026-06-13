import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
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
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
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

  const country = body.country === "US" ? "US" : "CO";
  const result = await createRestaurantRecord({
    clientId,
    name,
    city,
    country,
    timezone: body.timezone,
    actorId: session.userId,
  });

  if (!result) {
    return NextResponse.json({ ok: false, message: "Create failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.id });
}

export async function PATCH(request: Request) {
  const session = await getAdminApiSession();
  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

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

  const ok = await updateRestaurantRecord(
    restaurantId,
    { name: body.name, city: body.city },
    session.userId,
  );

  return NextResponse.json(
    ok ? { ok: true } : { ok: false, message: "Update failed" },
    { status: ok ? 200 : 500 },
  );
}
