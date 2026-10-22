import DisclosurePanel from './islands/DisclosurePanel';
import type { LLAttraction, LLProjectedPrice } from '../lib/trips/ll-types';
import { formatPriceEstimate } from '../lib/trips/ll-planner';

const CHILD_CARD_ABBREVIATIONS: Record<string, string> = {
  'Avatar Flight of Passage': 'FOP',
  'Star Wars: Rise of the Resistance': 'RoTR',
  'Guardians of the Galaxy: Cosmic Rewind': 'GoTGCR',
  'TRON Lightcycle / Run': 'TRON',
};

interface Props {
  multiPassEstimate: LLProjectedPrice;
  selectedSinglePassEstimate: LLProjectedPrice | null;
  totalEstimate: LLProjectedPrice | null;
  childEstimate?: LLProjectedPrice | null | undefined;
  heightRestrictedSelections?: LLAttraction[] | undefined;
}

/**
 * The per-person total lives in the disclosure headline; the body only breaks it down,
 * adding a child total when height limits make it differ from the adult total.
 */
export default function LLProjectedCosts({
  multiPassEstimate,
  selectedSinglePassEstimate,
  totalEstimate,
  childEstimate,
  heightRestrictedSelections,
}: Props) {
  const showChildRow =
    childEstimate != null &&
    totalEstimate != null &&
    childEstimate.estimatedPriceUsd !== totalEstimate.estimatedPriceUsd;
  const visibleChildEstimate = showChildRow ? childEstimate : null;

  const childSubtitle =
    showChildRow && heightRestrictedSelections && heightRestrictedSelections.length > 0
      ? `Excl. ${heightRestrictedSelections.map((a) => `${CHILD_CARD_ABBREVIATIONS[a.attractionLabel] ?? a.attractionLabel}${a.heightRestriction ? ` (${a.heightRestriction})` : ''}`).join(', ')}`
      : undefined;

  const summary = totalEstimate
    ? `${formatPriceEstimate(totalEstimate)}${showChildRow ? ' adult' : ''}`
    : 'No selections';

  return (
    <DisclosurePanel
      label="Projected per-person cost"
      summary={summary}
      detail="Projections based on historical data · actual prices vary"
      className="ll-costs"
      defaultOpen={true}
      mobileBehavior="collapsed"
    >
      <dl className="ll-costs__items">
        <LLCostItem label="Multi Pass" value={formatPriceEstimate(multiPassEstimate)} />
        {selectedSinglePassEstimate && (
          <LLCostItem
            label="Single Pass picks"
            value={formatPriceEstimate(selectedSinglePassEstimate)}
          />
        )}
        {visibleChildEstimate && (
          <LLCostItem
            label="Child total"
            subtitle={childSubtitle}
            value={formatPriceEstimate(visibleChildEstimate)}
          />
        )}
      </dl>
    </DisclosurePanel>
  );
}

function LLCostItem({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle?: string | undefined;
}) {
  return (
    <div className="ll-costs__item">
      <dt className="ll-costs__label">{label}</dt>
      <dd className="ll-costs__value">{value}</dd>
      {subtitle && <dd className="ll-costs__subtitle">{subtitle}</dd>}
    </div>
  );
}
