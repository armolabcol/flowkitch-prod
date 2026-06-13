import { env, isResendConfigured } from "@/lib/env";

type ExpiringItem = {
  restaurantName: string;
  clientName: string;
  clientEmail: string;
  license_expires_at: string;
};

export async function sendLicenseAlertEmail(
  expiring: ExpiringItem[],
): Promise<boolean> {
  if (!isResendConfigured() || expiring.length === 0) return false;

  const lines = expiring
    .map(
      (e) =>
        `- ${e.restaurantName} (${e.clientName}) vence ${e.license_expires_at.slice(0, 10)} — ${e.clientEmail}`,
    )
    .join("\n");

  const html = `<p>Licencias Kitch por vencer (30 días):</p><pre>${lines}</pre><p><a href="${env.siteUrl}/es/admin/licenses">Admin licencias</a></p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Kitch Alerts <alerts@flowkitch.com>",
        to: [env.alertEmailTo],
        subject: `[Kitch] ${expiring.length} licencia(s) por vencer`,
        html,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
