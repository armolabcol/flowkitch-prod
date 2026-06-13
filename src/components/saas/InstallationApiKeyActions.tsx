"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  installationId: string;
  locale: "es" | "en";
};

export function InstallationApiKeyActions({ installationId, locale }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [newKey, setNewKey] = useState<string | null>(null);

  async function runAction(action: "rotate" | "revoke") {
    setStatus("loading");
    setMessage(null);
    setNewKey(null);

    try {
      const res = await fetch("/api/admin/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, installationId }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        message?: string;
        apiKey?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.message ?? (locale === "es" ? "Error" : "Error"));
        return;
      }

      setStatus("done");
      setMessage(data.message ?? "");
      if (data.apiKey) setNewKey(data.apiKey);
    } catch {
      setStatus("error");
      setMessage(locale === "es" ? "Error de red" : "Network error");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={status === "loading"}
          onClick={() => runAction("rotate")}
        >
          {locale === "es" ? "Rotar key" : "Rotate key"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={status === "loading"}
          onClick={() => runAction("revoke")}
        >
          {locale === "es" ? "Revocar" : "Revoke"}
        </Button>
      </div>
      {message && (
        <p
          className={`text-xs ${status === "error" ? "text-red-400" : "text-kitch-muted"}`}
        >
          {message}
        </p>
      )}
      {newKey && (
        <code className="break-all rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-xs text-amber-100">
          {newKey}
        </code>
      )}
    </div>
  );
}
