import type { ReactNode } from "react";

export function SaasPageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-kitch-muted">{description}</p>
      )}
      {children}
    </div>
  );
}

export function SaasMockTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-kitch-surface/60">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wider text-kitch-subtle">
              {headers.map((h) => (
                <th key={h} className="px-5 py-3 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-white/[0.04] hover:bg-white/[0.02]"
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-3.5 text-kitch-muted">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
