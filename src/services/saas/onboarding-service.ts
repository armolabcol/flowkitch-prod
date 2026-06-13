import { createApiKeyRecord } from "@/services/api-key-service";
import { writeAuditLog } from "@/services/audit-service";
import { createClientRecord } from "@/services/saas/clients-admin-service";
import { createInstallationRecord } from "@/services/saas/installations-admin-service";
import {
  linkOrInvitePortalUser,
  type PortalUserResult,
} from "@/services/saas/profiles-admin-service";
import { createRestaurantRecord } from "@/services/saas/restaurants-admin-service";
import { createSubscriptionRecord } from "@/services/saas/subscriptions-admin-service";
import { getServiceSaasClient } from "@/services/saas/db";

export type OnboardingInput = {
  client: {
    name: string;
    email: string;
    country: "CO" | "US";
    taxId?: string | null;
  };
  restaurant: {
    name: string;
    city: string;
    timezone?: string;
  };
  installation: {
    siteUrl: string;
    pluginVersion?: string;
    licenseDays?: number;
  };
  subscription?: {
    planName?: string;
    amountCents?: number;
    currency?: "USD" | "COP";
    periodDays?: number;
  };
  portalUser?: {
    email: string;
    fullName?: string | null;
  };
  actorId?: string | null;
};

export type OnboardingResult = {
  clientId: string;
  restaurantId: string;
  installationId: string;
  subscriptionId: string;
  apiKey: string;
  apiKeyLast4: string;
  portalUser?: PortalUserResult;
};

function defaultSubscription(country: "CO" | "US") {
  return country === "US"
    ? { amountCents: 29900, currency: "USD" as const }
    : { amountCents: 119000, currency: "COP" as const };
}

async function rollbackOnboarding(ids: {
  clientId?: string;
  restaurantId?: string;
  installationId?: string;
  subscriptionId?: string;
}) {
  const supabase = getServiceSaasClient();
  if (!supabase) return;

  if (ids.installationId) {
    await supabase.from("api_keys").delete().eq("installation_id", ids.installationId);
    await supabase.from("plugin_installations").delete().eq("id", ids.installationId);
  }
  if (ids.subscriptionId) {
    await supabase.from("subscriptions").delete().eq("id", ids.subscriptionId);
  }
  if (ids.restaurantId) {
    await supabase.from("restaurants").delete().eq("id", ids.restaurantId);
  }
  if (ids.clientId) {
    await supabase.from("clients").delete().eq("id", ids.clientId);
  }
}

export async function provisionClientStack(
  input: OnboardingInput,
): Promise<OnboardingResult | { error: string }> {
  const subDefaults = defaultSubscription(input.client.country);
  const created: {
    clientId?: string;
    restaurantId?: string;
    installationId?: string;
    subscriptionId?: string;
  } = {};

  const client = await createClientRecord({
    name: input.client.name,
    email: input.client.email,
    country: input.client.country,
    taxId: input.client.taxId,
    actorId: input.actorId,
  });
  if (!client) {
    return { error: "Failed to create client" };
  }
  created.clientId = client.id;

  const restaurant = await createRestaurantRecord({
    clientId: client.id,
    name: input.restaurant.name,
    country: input.client.country,
    city: input.restaurant.city,
    timezone: input.restaurant.timezone,
    actorId: input.actorId,
  });
  if (!restaurant) {
    await rollbackOnboarding(created);
    return { error: "Failed to create restaurant" };
  }
  created.restaurantId = restaurant.id;

  const installation = await createInstallationRecord({
    restaurantId: restaurant.id,
    siteUrl: input.installation.siteUrl,
    pluginVersion: input.installation.pluginVersion,
    licenseDays: input.installation.licenseDays ?? 30,
    actorId: input.actorId,
  });
  if (!installation) {
    await rollbackOnboarding(created);
    return { error: "Failed to create installation" };
  }
  created.installationId = installation.id;

  const subscription = await createSubscriptionRecord({
    clientId: client.id,
    planName: input.subscription?.planName,
    amountCents: input.subscription?.amountCents ?? subDefaults.amountCents,
    currency: input.subscription?.currency ?? subDefaults.currency,
    periodDays: input.subscription?.periodDays ?? 30,
    actorId: input.actorId,
  });
  if (!subscription) {
    await rollbackOnboarding(created);
    return { error: "Failed to create subscription" };
  }
  created.subscriptionId = subscription.id;

  const keyResult = await createApiKeyRecord(installation.id, input.actorId);
  if (!keyResult) {
    await rollbackOnboarding(created);
    return { error: "Failed to create API key" };
  }

  let portalUser: PortalUserResult | undefined;
  if (input.portalUser?.email) {
    portalUser = await linkOrInvitePortalUser({
      email: input.portalUser.email,
      clientId: client.id,
      fullName: input.portalUser.fullName,
      actorId: input.actorId,
    });
  }

  await writeAuditLog({
    actorId: input.actorId,
    action: "onboarding.completed",
    entityType: "client",
    entityId: client.id,
    metadata: {
      restaurantId: restaurant.id,
      installationId: installation.id,
      subscriptionId: subscription.id,
      portalUser,
    },
  });

  return {
    clientId: client.id,
    restaurantId: restaurant.id,
    installationId: installation.id,
    subscriptionId: subscription.id,
    apiKey: keyResult.apiKey,
    apiKeyLast4: keyResult.publicView.last4,
    portalUser,
  };
}
