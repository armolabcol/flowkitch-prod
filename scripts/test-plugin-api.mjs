#!/usr/bin/env node
/**
 * Test plugin APIs against local or production.
 * Usage:
 *   node scripts/test-plugin-api.mjs
 *   BASE_URL=https://flowkitch.com API_KEY=kitch_live_... node scripts/test-plugin-api.mjs
 */
const base = process.env.BASE_URL ?? "http://localhost:3000";
const apiKey = process.env.API_KEY ?? "kitch_live_mock_active_col_7x9k";

async function post(path, body) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  console.log(`\n${path} → ${res.status}`);
  try {
    console.log(JSON.stringify(JSON.parse(text), null, 2));
  } catch {
    console.log(text.slice(0, 500));
  }
}

console.log(`Testing ${base}`);

await post("/api/plugin/license/check", {
  api_key: apiKey,
  site_url: "https://example-restaurant.com",
  plugin_version: "3.0.0",
});

await post("/api/plugin/telemetry", {
  api_key: apiKey,
  date: new Date().toISOString().slice(0, 10),
  orders_count: 10,
  revenue_cents: 150000,
  average_ticket_cents: 15000,
  plugin_version: "3.0.0",
});

const health = await fetch(`${base}/api/health`);
console.log(`\n/api/health → ${health.status}`);
console.log(await health.text());
