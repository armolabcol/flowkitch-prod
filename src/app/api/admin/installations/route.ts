import { NextResponse } from "next/server";
import { getAdminApiSession } from "@/lib/auth/admin-api";
import {
  createInstallationRecord,
  extendInstallationLicense,
  updateInstallationDetails,
  updateInstallationLicense,
} from "@/services/saas/installations-admin-service";
import { createApiKeyRecord } from "@/services/api-key-service";
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
  action?: "create" | "update" | "extend" | "patch";
  installationId?: string;
  restaurantId?: string;
  siteUrl?: string;
  pluginVersion?: string;
  licenseDays?: number;
  license_status?: string;
  license_expires_at?: string;
  grace_until?: string | null;
  site_url?: string;
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

  if (body.action === "create") {
    const restaurantId = body.restaurantId?.trim();
    const siteUrl = body.siteUrl?.trim();
    if (!restaurantId || !siteUrl) {
      return NextResponse.json(
        { ok: false, message: "restaurantId and siteUrl required" },
        { status: 400 },
      );
    }

    const installation = await createInstallationRecord({
      restaurantId,
      siteUrl,
      pluginVersion: body.pluginVersion,
      licenseDays: body.licenseDays,
      actorId: session.userId,
    });
    if (!installation) {
      return NextResponse.json({ ok: false, message: "Create failed" }, { status: 500 });
    }

    const key = await createApiKeyRecord(installation.id, session.userId);
    return NextResponse.json({
      ok: true,
      installationId: installation.id,
      apiKey: key?.apiKey,
      last4: key?.publicView.last4,
    });
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
    const ok = await extendInstallationLicense(installationId, days, session.userId);
    return NextResponse.json(
      ok
        ? { ok: true, message: `Extended ${days} days` }
        : { ok: false, message: "Extend failed" },
      { status: ok ? 200 : 500 },
    );
  }

  if (body.action === "patch") {
    const status = body.license_status as LicenseStatus | undefined;
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ ok: false, message: "Invalid license_status" }, { status: 400 });
    }

    const ok = await updateInstallationDetails(
      installationId,
      {
        site_url: body.site_url,
        plugin_version: body.pluginVersion,
        license_status: status,
        license_expires_at: body.license_expires_at,
        grace_until: body.grace_until,
      },
      session.userId,
    );
    return NextResponse.json(
      ok ? { ok: true, message: "Installation updated" } : { ok: false, message: "Patch failed" },
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
    { ok: false, message: "action must be create, update, extend, or patch" },
    { status: 400 },
  );
}
