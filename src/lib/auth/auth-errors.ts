/** Map Supabase Auth errors to stable codes for i18n. */
export function mapForgotPasswordError(
  message: string,
  code?: string | null,
): { code: string; message: string } {
  const normalized = message.toLowerCase();
  const supabaseCode = code ?? "";

  if (
    supabaseCode === "over_email_send_rate_limit" ||
    normalized.includes("rate limit")
  ) {
    return {
      code: "rate_limit",
      message: "email rate limit exceeded",
    };
  }

  return { code: supabaseCode || "reset_failed", message };
}
