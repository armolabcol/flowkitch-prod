import { FlowNode } from "@/components/ui/FlowNode";
import { cn } from "@/lib/cn";

type Node = { key: string; name: string; note: string };

export function RoleFlowDiagram({
  nodes,
  className,
}: {
  nodes: readonly Node[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-kitch-border bg-gradient-to-br from-kitch-elevated/90 to-kitch-surface/80 p-6 sm:p-8",
        className,
      )}
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {nodes.map((n) => (
          <li key={n.key}>
            <FlowNode active size="lg" className="h-full min-h-[5.5rem] flex-col justify-center py-4">
              <span className="block text-sm font-semibold text-white">{n.name}</span>
              <span className="mt-1 block text-xs leading-snug text-kitch-subtle">{n.note}</span>
            </FlowNode>
          </li>
        ))}
      </ul>
    </div>
  );
}
