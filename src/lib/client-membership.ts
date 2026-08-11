import type { LicenseStatus } from "@/types/saas";

const STATUS_RANK: Record<string, number> = {
  suspended: 0,
  cancelled: 1,
  past_due: 2,
  grace_period: 3,
  maintenance_required: 4,
  trialing: 5,
  license_unknown: 6,
  active: 7,
};

export function daysUntil(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const end = new Date(iso).getTime();
  if (Number.isNaN(end)) return null;
  return Math.ceil((end - Date.now()) / 86_400_000);
}

/** Expiry the restaurant actually sees: plugin license, not billing period. */
export function operationalExpiry(params: {
  licenseDates: Array<string | null | undefined>;
  billingPeriodEnd?: string | null;
}): string | null {
  return earliestDate(params.licenseDates) ?? params.billingPeriodEnd ?? null;
}

export function earliestDate(
  dates: Array<string | null | undefined>,
): string | null {
  const times = dates
    .filter((value): value is string => Boolean(value))
    .map((value) => ({ value, time: new Date(value).getTime() }))
    .filter((item) => !Number.isNaN(item.time))
    .sort((a, b) => a.time - b.time);

  return times[0]?.value ?? null;
}

export function toMembershipStatus(
  statuses: Array<string | null | undefined>,
): LicenseStatus {
  let best: string | null = null;
  let bestRank = Number.POSITIVE_INFINITY;

  for (const raw of statuses) {
    if (!raw) continue;
    const mapped = raw === "trialing" ? "active" : raw;
    const rank = STATUS_RANK[mapped] ?? STATUS_RANK.license_unknown;
    if (rank < bestRank) {
      bestRank = rank;
      best = mapped;
    }
  }

  if (!best || STATUS_RANK[best] === undefined) {
    return "license_unknown";
  }

  return best as LicenseStatus;
}
