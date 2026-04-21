import { useCallback, useState } from 'react';
import DisclosurePanel from './islands/DisclosurePanel';
import type {
  LLAttraction,
  LLMemberPlan,
  LLParkDay,
  LLParkDaySelections,
  LLParkId,
  LLParkInventory,
  LLPlannerData,
  LLProjectedPrice,
} from '../lib/trips/ll-types';
import {
  deserializePlan,
  emptySelections,
  formatPriceEstimate,
  getAttractionPriceEstimate,
  getChildParkDayPriceEstimate,
  getHeightRestrictedSelections,
  getMultiPassCount,
  getMultiPassPriceEstimate,
  getProjectedParkDayPriceEstimate,
  getSelectedSinglePassPriceEstimate,
  serializePlan,
  toggleSelection,
} from '../lib/trips/ll-planner';

interface Props {
  data: LLPlannerData;
}

type ViewMode = 'summary' | 'edit';

const SINGLE_PASS_SUBTITLE = 'Purchased individually';

const CHILD_CARD_ABBREVIATIONS: Record<string, string> = {
  'Avatar Flight of Passage': 'FOP',
  'Star Wars: Rise of the Resistance': 'RoTR',
  'Guardians of the Galaxy: Cosmic Rewind': 'GoTGCR',
  'TRON Lightcycle / Run': 'TRON',
};

function getSharedPlan(data: LLPlannerData): LLMemberPlan | null {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash;
  if (!hash.includes('ll=')) return null;

  const result = deserializePlan(hash, data.inventory, data.parkDays);
  if (!result) return null;
  return result.plan;
}

function makeEmptyPlan(data: LLPlannerData): LLMemberPlan {
  return {
    memberId: data.ownerMemberId,
    parkDays: Object.fromEntries(data.parkDays.map((day) => [day.parkDate, emptySelections()])),
  };
}

export default function LightningLanePlanner({ data }: Props) {
  const firstParkDay = data.parkDays[0];
  const [activeParkDate, setActiveParkDate] = useState(firstParkDay?.parkDate ?? '');
  const [isSharedLink] = useState(() => getSharedPlan(data) != null);
  const [currentPlan, setCurrentPlan] = useState<LLMemberPlan>(
    () => getSharedPlan(data) ?? data.defaultPlan,
  );
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [toastVisible, setToastVisible] = useState(false);

  const activeParkDay =
    data.parkDays.find((day) => day.parkDate === activeParkDate) ?? firstParkDay;
  const activeDaySelections = currentPlan.parkDays[activeParkDate] ?? emptySelections();
  const activeInventory = activeParkDay ? data.inventory[activeParkDay.parkId] : undefined;

  const handleToggle = useCallback(
    (attractionId: string) => {
      if (!activeInventory) return;
      setCurrentPlan((previousPlan) => {
        const currentSelections = previousPlan.parkDays[activeParkDate] ?? emptySelections();
        const newSelections = toggleSelection(currentSelections, attractionId, activeInventory);
        return {
          ...previousPlan,
          parkDays: {
            ...previousPlan.parkDays,
            [activeParkDate]: newSelections,
          },
        };
      });
    },
    [activeInventory, activeParkDate],
  );

  function handleParkDaySwitch(parkDate: string) {
    setActiveParkDate(parkDate);
    const dayCode = parkDate.slice(5).replace('-', '');
    window.history.replaceState(null, '', `#day=${dayCode}`);
  }

  function handleCopyLink() {
    const hash = serializePlan(currentPlan, data.inventory, data.parkDays);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;
    void navigator.clipboard.writeText(url).then(() => {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    });
  }

  function handleStartFresh() {
    setCurrentPlan(makeEmptyPlan(data));
  }

  const ownerName = data.party.find((member) => member.id === data.ownerMemberId)?.name;

  return (
    <div className="ll-planner">
      {viewMode === 'summary' ? (
        <>
          <div className="ll-shared-banner">
            <p className="ll-shared-banner__text">
              {isSharedLink ? (
                'Someone thinks they can outplan Tytus\u2026 \uD83D\uDE44'
              ) : (
                <>
                  Viewing <strong>{ownerName}&rsquo;s</strong> Lightning Lane picks
                </>
              )}
            </p>
            <button
              className="ll-shared-banner__fork"
              onClick={() => {
                setViewMode('edit');
              }}
              type="button"
            >
              Customize picks
            </button>
          </div>

          {data.parkDays.map((day) => (
            <LLParkDayCardReadOnly
              key={day.parkDate}
              day={day}
              inventory={data.inventory[day.parkId]}
              selections={currentPlan.parkDays[day.parkDate] ?? emptySelections()}
              hasChildren={data.hasChildren}
              heightRestrictionsMatter={data.heightRestrictionsMatter}
            />
          ))}
        </>
      ) : (
        <>
          <div className="ll-planner__controls">
            <div className="ll-planner__control-group">
              <p className="ll-planner__control-label">Park day</p>
              <div className="ll-planner__chip-row">
                {data.parkDays.map((day) => {
                  const abbreviation = getParkAbbreviation(day.parkId);
                  return (
                    <button
                      aria-pressed={activeParkDate === day.parkDate}
                      className={`ll-planner__chip${activeParkDate === day.parkDate ? ' ll-planner__chip--active' : ''}`}
                      key={day.parkDate}
                      onClick={() => {
                        handleParkDaySwitch(day.parkDate);
                      }}
                      type="button"
                    >
                      {abbreviation} &middot; {day.dateLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {activeParkDay && activeInventory && (
            <LLParkDayCard
              day={activeParkDay}
              inventory={activeInventory}
              selections={activeDaySelections}
              onToggle={handleToggle}
              hasChildren={data.hasChildren}
              heightRestrictionsMatter={data.heightRestrictionsMatter}
            />
          )}

          <div className="ll-planner__actions">
            <button className="ll-planner__action-btn" onClick={handleCopyLink} type="button">
              Copy plan link
            </button>
            <button
              className="ll-planner__action-btn ll-planner__action-btn--secondary"
              onClick={() => {
                setViewMode('summary');
              }}
              type="button"
            >
              Back to summary
            </button>
            <button
              className="ll-planner__action-btn ll-planner__action-btn--secondary"
              onClick={handleStartFresh}
              type="button"
            >
              Start fresh
            </button>
          </div>
        </>
      )}

      {toastVisible && (
        <div className="ll-toast" role="status">
          Link copied!
        </div>
      )}
    </div>
  );
}

function getParkAbbreviation(parkId: LLParkId): string {
  switch (parkId) {
    case 'magic-kingdom':
      return 'MK';
    case 'epcot':
      return 'EPCOT';
    case 'hollywood-studios':
      return 'DHS';
    case 'animal-kingdom':
      return 'DAK';
  }
}

function LLParkDayCard({
  day,
  inventory,
  selections,
  onToggle,
  hasChildren,
  heightRestrictionsMatter,
}: {
  day: LLParkDay;
  inventory: LLParkInventory;
  selections: LLParkDaySelections;
  onToggle: (id: string) => void;
  hasChildren?: boolean | undefined;
  heightRestrictionsMatter: boolean;
}) {
  const individualAttractions = inventory.attractions.filter(
    (attraction) => attraction.passType === 'individual',
  );
  const tierOneAttractions = inventory.attractions.filter(
    (attraction) => attraction.passType === 'multipass' && attraction.tier === 'tier1',
  );
  const tierTwoAttractions = inventory.attractions.filter(
    (attraction) => attraction.passType === 'multipass' && attraction.tier === 'tier2',
  );
  const noTierAttractions = inventory.attractions.filter(
    (attraction) => attraction.passType === 'multipass' && attraction.tier === 'notier',
  );

  const multiPassCount = getMultiPassCount(selections, inventory);
  const multiPassMax = inventory.hasTiers
    ? inventory.maxTier1 + inventory.maxTier2
    : inventory.maxMultiPass;

  return (
    <div className="ll-card">
      <div className="ll-card__header">
        <h3 className="ll-card__park-name">{day.parkLabel}</h3>
        <p className="ll-card__day-info">
          Day {day.dayNumber} &middot; {day.weekdayLabel} {day.dateLabel}
          {day.scheduleNotes ? ` · ${day.scheduleNotes}` : ''}
        </p>
      </div>

      <LLProjectedCosts
        multiPassEstimate={getMultiPassPriceEstimate(inventory)}
        selectedSinglePassEstimate={getSelectedSinglePassPriceEstimate(selections, inventory)}
        totalEstimate={getProjectedParkDayPriceEstimate(selections, inventory)}
        childEstimate={
          hasChildren
            ? getChildParkDayPriceEstimate(selections, inventory, heightRestrictionsMatter)
            : undefined
        }
        heightRestrictedSelections={
          hasChildren
            ? getHeightRestrictedSelections(selections, inventory, heightRestrictionsMatter)
            : undefined
        }
      />

      <LLSection eyebrow="Lightning Lane Single Pass" subtitle={SINGLE_PASS_SUBTITLE}>
        {individualAttractions.map((attraction) => (
          <LLAttractionRow
            key={attraction.id}
            attraction={attraction}
            checked={selections.illSelections.includes(attraction.id)}
            disabled={false}
            inputType="checkbox"
            onToggle={onToggle}
            showHeightRestrictions={heightRestrictionsMatter}
          />
        ))}
      </LLSection>

      {inventory.hasTiers && (
        <>
          <LLSection
            eyebrow="Multi Pass · Tier 1"
            constraint={`Choose ${String(inventory.maxTier1)}`}
          >
            {tierOneAttractions.map((attraction) => (
              <LLAttractionRow
                key={attraction.id}
                attraction={attraction}
                checked={selections.tier1Selection === attraction.id}
                disabled={false}
                inputType="radio"
                onToggle={onToggle}
                showHeightRestrictions={heightRestrictionsMatter}
              />
            ))}
          </LLSection>

          <LLSection
            eyebrow="Multi Pass · Tier 2"
            constraint={`Choose ${String(inventory.maxTier2)}`}
            count={selections.tier2Selections.length}
            max={inventory.maxTier2}
          >
            {tierTwoAttractions.map((attraction) => {
              const isSelected = selections.tier2Selections.includes(attraction.id);
              const atCap = selections.tier2Selections.length >= inventory.maxTier2;
              return (
                <LLAttractionRow
                  key={attraction.id}
                  attraction={attraction}
                  checked={isSelected}
                  disabled={!isSelected && atCap}
                  inputType="checkbox"
                  onToggle={onToggle}
                  showHeightRestrictions={heightRestrictionsMatter}
                />
              );
            })}
          </LLSection>
        </>
      )}

      {!inventory.hasTiers && (
        <LLSection
          eyebrow="Multi Pass"
          constraint={`Choose ${String(inventory.maxMultiPass)}`}
          count={selections.multiPassSelections.length}
          max={inventory.maxMultiPass}
        >
          {noTierAttractions.map((attraction) => {
            const isSelected = selections.multiPassSelections.includes(attraction.id);
            const atCap = selections.multiPassSelections.length >= inventory.maxMultiPass;
            return (
              <LLAttractionRow
                key={attraction.id}
                attraction={attraction}
                checked={isSelected}
                disabled={!isSelected && atCap}
                inputType="checkbox"
                onToggle={onToggle}
                showHeightRestrictions={heightRestrictionsMatter}
              />
            );
          })}
        </LLSection>
      )}

      <div className="ll-card__summary">
        Single Pass: {selections.illSelections.length} selected &middot; Multi Pass:{' '}
        {multiPassCount} of {multiPassMax}
      </div>
    </div>
  );
}

function LLProjectedCosts({
  multiPassEstimate,
  selectedSinglePassEstimate,
  totalEstimate,
  childEstimate,
  heightRestrictedSelections,
}: {
  multiPassEstimate: LLProjectedPrice;
  selectedSinglePassEstimate: LLProjectedPrice | null;
  totalEstimate: LLProjectedPrice | null;
  childEstimate?: LLProjectedPrice | null | undefined;
  heightRestrictedSelections?: LLAttraction[] | undefined;
}) {
  const showChildRow =
    childEstimate != null &&
    totalEstimate != null &&
    childEstimate.estimatedPriceUsd !== totalEstimate.estimatedPriceUsd;
  const visibleChildEstimate = showChildRow ? childEstimate : null;

  const childSubtitle =
    showChildRow && heightRestrictedSelections && heightRestrictedSelections.length > 0
      ? `Excl. ${heightRestrictedSelections.map((a) => `${CHILD_CARD_ABBREVIATIONS[a.attractionLabel] ?? a.attractionLabel}${a.heightRestriction ? ` (${a.heightRestriction})` : ''}`).join(', ')}`
      : undefined;

  return (
    <DisclosurePanel
      label="Projected per-person costs"
      summary={totalEstimate ? formatPriceEstimate(totalEstimate) : 'No selections'}
      detail="Projections based on historical data · actual prices vary"
      className="ll-costs"
      defaultOpen={true}
      mobileBehavior="collapsed"
    >
      <div className="ll-costs__items">
        <LLProjectedCostItem label="Multi Pass" value={formatPriceEstimate(multiPassEstimate)} />
        {selectedSinglePassEstimate && (
          <LLProjectedCostItem
            label="Selected Single Pass"
            value={formatPriceEstimate(selectedSinglePassEstimate)}
          />
        )}
        {totalEstimate && (
          <LLProjectedCostItem
            emphasized
            label={showChildRow ? 'Adult total' : 'Current plan total'}
            value={formatPriceEstimate(totalEstimate)}
          />
        )}
        {visibleChildEstimate && (
          <LLProjectedCostItem
            emphasized
            label="Child total"
            subtitle={childSubtitle}
            value={formatPriceEstimate(visibleChildEstimate)}
          />
        )}
      </div>
    </DisclosurePanel>
  );
}

function LLProjectedCostItem({
  label,
  value,
  emphasized = false,
  subtitle,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
  subtitle?: string | undefined;
}) {
  return (
    <div className={`ll-costs__item${emphasized ? ' ll-costs__item--total' : ''}`}>
      <span className="ll-costs__label">{label}</span>
      {subtitle && <span className="ll-costs__subtitle">{subtitle}</span>}
      <span className="ll-costs__value">{value}</span>
    </div>
  );
}

function LLSection({
  eyebrow,
  subtitle,
  constraint,
  count,
  max,
  children,
}: {
  eyebrow: string;
  subtitle?: string;
  constraint?: string;
  count?: number;
  max?: number;
  children: React.ReactNode;
}) {
  return (
    <div className="ll-section">
      <div className="ll-section__header">
        <p className="ll-section__eyebrow">{eyebrow}</p>
        {constraint && (
          <span
            className={`ll-section__constraint${count != null && max != null && count >= max ? ' ll-section__constraint--filled' : ''}`}
          >
            {count != null && max != null
              ? `${String(count)} of ${String(max)} selected`
              : constraint}
          </span>
        )}
      </div>
      {subtitle && <p className="ll-section__subtitle">{subtitle}</p>}
      <div className="ll-section__list">{children}</div>
    </div>
  );
}

function LLAttractionRow({
  attraction,
  checked,
  disabled,
  inputType,
  onToggle,
  showHeightRestrictions,
}: {
  attraction: LLAttraction;
  checked: boolean;
  disabled: boolean;
  inputType: 'checkbox' | 'radio';
  onToggle: (id: string) => void;
  showHeightRestrictions: boolean;
}) {
  const isClosed = attraction.closedDuringTrip;
  const isDisabled = disabled || isClosed;
  const priceEstimate = getAttractionPriceEstimate(attraction);

  return (
    <label
      className={`ll-row${isClosed ? ' ll-row--closed' : ''}${isDisabled && !isClosed ? ' ll-row--disabled' : ''}`}
      title={isClosed && attraction.closureNote ? attraction.closureNote : undefined}
    >
      <input
        type={inputType}
        checked={checked}
        disabled={isDisabled}
        onChange={() => {
          onToggle(attraction.id);
        }}
        className="ll-row__input"
      />
      <span className="ll-row__main">
        <span className="ll-row__top">
          <span className={`ll-row__label${isClosed ? ' ll-row__label--closed' : ''}`}>
            {attraction.attractionLabel}
          </span>
          {(priceEstimate != null ||
            isClosed ||
            (showHeightRestrictions && attraction.heightRestriction != null)) && (
            <span className="ll-row__meta">
              {priceEstimate && (
                <span className="ll-badge--price">{formatPriceBadge(priceEstimate)}</span>
              )}
              {isClosed && <span className="ll-badge--closed">CLOSED</span>}
              {showHeightRestrictions && attraction.heightRestriction && (
                <span className="ll-badge--height">{attraction.heightRestriction}</span>
              )}
            </span>
          )}
        </span>
        {showHeightRestrictions && attraction.heightRestriction && (
          <span className="ll-row__note">Not available for children</span>
        )}
      </span>
    </label>
  );
}

function LLParkDayCardReadOnly({
  day,
  inventory,
  selections,
  hasChildren,
  heightRestrictionsMatter,
}: {
  day: LLParkDay;
  inventory: LLParkInventory;
  selections: LLParkDaySelections;
  hasChildren?: boolean | undefined;
  heightRestrictionsMatter: boolean;
}) {
  const multiPassCount = getMultiPassCount(selections, inventory);
  const multiPassMax = inventory.hasTiers
    ? inventory.maxTier1 + inventory.maxTier2
    : inventory.maxMultiPass;

  function getSelectedAttractions(ids: string[]): LLAttraction[] {
    return ids
      .map((id) => inventory.attractions.find((attraction) => attraction.id === id))
      .filter((attraction): attraction is LLAttraction => attraction != null);
  }

  const individualAttractions = getSelectedAttractions(selections.illSelections);
  const multiPassAttractions = inventory.hasTiers
    ? getSelectedAttractions([
        ...(selections.tier1Selection ? [selections.tier1Selection] : []),
        ...selections.tier2Selections,
      ])
    : getSelectedAttractions(selections.multiPassSelections);
  const hasSelections = individualAttractions.length > 0 || multiPassAttractions.length > 0;

  return (
    <div className="ll-card ll-card--readonly">
      <div className="ll-card__header">
        <h3 className="ll-card__park-name">{day.parkLabel}</h3>
        <p className="ll-card__day-info">
          Day {day.dayNumber} &middot; {day.weekdayLabel} {day.dateLabel}
        </p>
      </div>

      <LLProjectedCosts
        multiPassEstimate={getMultiPassPriceEstimate(inventory)}
        selectedSinglePassEstimate={getSelectedSinglePassPriceEstimate(selections, inventory)}
        totalEstimate={getProjectedParkDayPriceEstimate(selections, inventory)}
        childEstimate={
          hasChildren
            ? getChildParkDayPriceEstimate(selections, inventory, heightRestrictionsMatter)
            : undefined
        }
        heightRestrictedSelections={
          hasChildren
            ? getHeightRestrictedSelections(selections, inventory, heightRestrictionsMatter)
            : undefined
        }
      />

      {!hasSelections && <p className="ll-card__empty">No selections for this park day.</p>}

      {individualAttractions.length > 0 && (
        <div className="ll-section">
          <p className="ll-section__eyebrow">Single Pass</p>
          <p className="ll-section__subtitle">{SINGLE_PASS_SUBTITLE}</p>
          <ul className="ll-section__check-list">
            {individualAttractions.map((attraction) => {
              const priceEstimate = getAttractionPriceEstimate(attraction);

              return (
                <li key={attraction.id} className="ll-section__check-item">
                  <span className="ll-section__check-main">
                    &#10003; {attraction.attractionLabel}
                  </span>
                  {(priceEstimate != null ||
                    (heightRestrictionsMatter && attraction.heightRestriction != null)) && (
                    <span className="ll-section__check-meta">
                      {priceEstimate && (
                        <span className="ll-badge--price">{formatPriceBadge(priceEstimate)}</span>
                      )}
                      {heightRestrictionsMatter && attraction.heightRestriction && (
                        <span className="ll-badge--height">{attraction.heightRestriction}</span>
                      )}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {multiPassAttractions.length > 0 && (
        <div className="ll-section">
          <p className="ll-section__eyebrow">
            Multi Pass ({multiPassCount} of {multiPassMax})
          </p>
          <ul className="ll-section__check-list">
            {multiPassAttractions.map((attraction) => (
              <li key={attraction.id} className="ll-section__check-item">
                <span className="ll-section__check-main">
                  &#10003; {attraction.attractionLabel}
                </span>
                {heightRestrictionsMatter && attraction.heightRestriction && (
                  <span className="ll-section__check-meta">
                    <span className="ll-badge--height">{attraction.heightRestriction}</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatPriceBadge(estimate: LLProjectedPrice): string {
  return `$${String(estimate.estimatedPriceUsd)}`;
}
