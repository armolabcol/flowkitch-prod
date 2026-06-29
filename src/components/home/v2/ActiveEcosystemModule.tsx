import type { HomepageV2FlowStepModule } from "@/components/home/v2/types";

type ActiveEcosystemModuleProps = {
  module: HomepageV2FlowStepModule;
  labels: {
    activeModule: string;
    impact: string;
    owner: string;
  };
};

export function ActiveEcosystemModule({
  module,
  labels,
}: ActiveEcosystemModuleProps) {
  return (
    <article className="active-ecosystem-module" aria-live="polite">
      <p className="active-ecosystem-module__label">{labels.activeModule}</p>

      <div className="active-ecosystem-module__meta">
        <span className="active-ecosystem-module__icon" aria-hidden>
          {module.symbol}
        </span>
        <span className="active-ecosystem-module__badge">{module.signal}</span>
      </div>

      <h3 className="active-ecosystem-module__title">{module.title}</h3>

      <p className="active-ecosystem-module__description">{module.description}</p>

      <div className="active-ecosystem-module__impact">
        <strong>{labels.impact}</strong>
        <span>{module.benefit}</span>
      </div>

      <div className="active-ecosystem-module__owner">
        <strong>{labels.owner}</strong>
        <p>{module.ownerValue}</p>
      </div>
    </article>
  );
}
