import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import {
  extendInstallationLicense,
  updateInstallationLicense,
} from "@/services/saas/installations-admin-service";
import type { LicenseStatus } from "@/types/saas";

const VALID_STATUSES: LicenseStatus[] = [
  "active",
  "past_due",
  "grace_period",
  "suspended",
  "cancelled",
  "maintenance_required",
];

type Body = {
  action?: "update" | "extend";
  installationId?: string;
  license_status?: string;
  license_expires_at?: string;
  grace_until?: string | null;
  days?: number;
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
    return NextResponse.json({ ok: false, message: "Invalid JSON body" }, { status: 400 });
  }

  const installationId = body.installationId?.trim();
  if (!installationId) {
    return NextResponse.json(
      { ok: false, message: "installationId required" },
      { status: 400 },
    );
  }

  if (body.action === "extend") {
    const days = body.days ?? 30;
    const ok = await extendInstallationLicense(
      installationId,
      days,
      session.userId,
    );
    return NextResponse.json(
      ok
        ? { ok: true, message: `Extended ${days} days` }
        : { ok: false, message: "Extend failed" },
      { status: ok ? 200 : 500 },
    );
  }

  if (body.action === "update") {
    const status = body.license_status as LicenseStatus | undefined;
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ ok: false, message: "Invalid license_status" }, { status: 400 });
    }

    const ok = await updateInstallationLicense(
      installationId,
      {
        license_status: status,
        license_expires_at: body.license_expires_at,
        grace_until: body.grace_until,
      },
      session.userId,
    );
    return NextResponse.json(
      ok ? { ok: true, message: "License updated" } : { ok: false, message: "Update failed" },
      { status: ok ? 200 : 500 },
    );
  }

  return NextResponse.json(
    { ok: false, message: "action must be update or extend" },
    { status: 400 },
  );
}
