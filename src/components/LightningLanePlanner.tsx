import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import LLProjectedCosts from './LLProjectedCosts';
import ParkDayPicker from './ParkDayPicker';
import { getShortParkLabel } from '../lib/trips/format';
import type {
  LLAttraction,
  LLMemberPlan,
  LLParkDay,
  LLParkDaySelections,
  LLParkInventory,
  LLPlannerData,
  LLProjectedPrice,
} from '../lib/trips/ll-types';
import {
  deserializePlan,
  emptySelections,
  getAttractionPriceEstimate,
  getChildParkDayPriceEstimate,
  getHeightRestrictedSelections,
  getMultiPassCount,
  getMultiPassPriceEstimate,
  getParkDayInventory,
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

function getSharedPlan(data: LLPlannerData, hash: string): LLMemberPlan | null {
  if (!hash.includes('ll=')) return null;

  const result = deserializePlan(hash, data.inventory, data.parkDays);
  if (!result) return null;
  return result.plan;
}

function subscribeToHash(onChange: () => void) {
  window.addEventListener('hashchange', onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
  };
}

function getHashSnapshot() {
  return window.location.hash;
}

// The hash only exists in the browser; the server snapshot keeps hydration in sync with the server render.
function getServerHashSnapshot() {
  return '';
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
  const hash = useSyncExternalStore(subscribeToHash, getHashSnapshot, getServerHashSnapshot);
  const sharedPlan = useMemo(() => getSharedPlan(data, hash), [data, hash]);
  const isSharedLink = sharedPlan != null;
  const [editedPlan, setEditedPlan] = useState<LLMemberPlan | null>(null);
  const currentPlan = editedPlan ?? sharedPlan ?? data.defaultPlan;
  const [viewMode, setViewMode] = useState<ViewMode>('summary');
  const [toastVisible, setToastVisible] = useState(false);

  const activeParkDay =
    data.parkDays.find((day) => day.parkDate === activeParkDate) ?? firstParkDay;
  const activeDaySelections = currentPlan.parkDays[activeParkDate] ?? emptySelections();
  const activeInventory = activeParkDay ? getParkDayInventory(data, activeParkDay) : undefined;

  const handleToggle = useCallback(
    (attractionId: string) => {
      if (!activeInventory) return;
      const currentSelections = currentPlan.parkDays[activeParkDate] ?? emptySelections();
      const newSelections = toggleSelection(currentSelections, attractionId, activeInventory);
      setEditedPlan({
        ...currentPlan,
        parkDays: {
          ...currentPlan.parkDays,
          [activeParkDate]: newSelections,
        },
      });
    },
    [activeInventory, activeParkDate, currentPlan],
  );

  function handleCopyLink() {
    const planHash = serializePlan(currentPlan, data.inventory, data.parkDays);
    const url = `${window.location.origin}${window.location.pathname}#${planHash}`;
    void navigator.clipboard.writeText(url).then(() => {
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
      }, 2000);
    });
  }

  function handleStartFresh() {
    setEditedPlan(makeEmptyPlan(data));
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
              inventory={getParkDayInventory(data, day)}
              selections={currentPlan.parkDays[day.parkDate] ?? emptySelections()}
              hasChildren={data.hasChildren}
              heightRestrictionsMatter={data.heightRestrictionsMatter}
            />
          ))}
        </>
      ) : (
        <>
          <ParkDayPicker
            label="Park day"
            options={data.parkDays.map((day) => ({
              id: day.parkDate,
              label: getShortParkLabel(day.parkLabel),
              meta: `${day.weekdayLabel} ${day.dateLabel}`,
            }))}
            selectedId={activeParkDate}
            onSelect={(parkDate) => {
              if (parkDate) setActiveParkDate(parkDate);
            }}
          />

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

function getMultiPassSummary(selections: LLParkDaySelections, inventory: LLParkInventory) {
  return {
    multiPassCount: getMultiPassCount(selections, inventory),
    multiPassMax: inventory.hasTiers
      ? inventory.maxTier1 + inventory.maxTier2
      : inventory.maxMultiPass,
  };
}

function LLCardTop({
  day,
  inventory,
  selections,
  hasChildren,
  heightRestrictionsMatter,
  showScheduleNotes = false,
}: {
  day: LLParkDay;
  inventory: LLParkInventory;
  selections: LLParkDaySelections;
  hasChildren?: boolean | undefined;
  heightRestrictionsMatter: boolean;
  showScheduleNotes?: boolean;
}) {
  return (
    <>
      <div className="ll-card__header">
        <h3 className="ll-card__park-name">{day.parkLabel}</h3>
        <p className="ll-card__day-info">
          Day {day.dayNumber} &middot; {day.weekdayLabel} {day.dateLabel}
          {showScheduleNotes && day.scheduleNotes ? ` · ${day.scheduleNotes}` : ''}
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
    </>
  );
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

  const { multiPassCount, multiPassMax } = getMultiPassSummary(selections, inventory);

  return (
    <div className="ll-card">
      <LLCardTop
        day={day}
        inventory={inventory}
        selections={selections}
        hasChildren={hasChildren}
        heightRestrictionsMatter={heightRestrictionsMatter}
        showScheduleNotes
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
                <span className="tag" data-tone="accent">
                  {formatPriceBadge(priceEstimate)}
                </span>
              )}
              {isClosed && (
                <span className="tag" data-tone="highlight">
                  CLOSED
                </span>
              )}
              {showHeightRestrictions && attraction.heightRestriction && (
                <span className="tag" data-tone="recommended">
                  {attraction.heightRestriction}
                </span>
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
  const { multiPassCount, multiPassMax } = getMultiPassSummary(selections, inventory);

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
      <LLCardTop
        day={day}
        inventory={inventory}
        selections={selections}
        hasChildren={hasChildren}
        heightRestrictionsMatter={heightRestrictionsMatter}
      />

      {!hasSelections && <p className="ll-card__empty">No selections for this park day.</p>}

      {individualAttractions.length > 0 && (
        <div className="ll-section">
          <p className="ll-section__eyebrow">Single Pass</p>
          <p className="ll-section__subtitle">{SINGLE_PASS_SUBTITLE}</p>
          <ul className="ll-section__check-list">
            {individualAttractions.map((attraction) => {
              const priceEstimate = getAttractionPriceEstimate(attraction);
              const returnWindow = selections.returnWindows?.[attraction.id];

              return (
                <li key={attraction.id} className="ll-section__check-item">
                  <span className="ll-section__check-main">
                    &#10003; {attraction.attractionLabel}
                  </span>
                  {(returnWindow != null ||
                    priceEstimate != null ||
                    (heightRestrictionsMatter && attraction.heightRestriction != null)) && (
                    <span className="ll-section__check-meta">
                      {returnWindow && (
                        <span className="tag" data-tone="neutral">
                          {returnWindow}
                        </span>
                      )}
                      {priceEstimate && (
                        <span className="tag" data-tone="accent">
                          {formatPriceBadge(priceEstimate)}
                        </span>
                      )}
                      {heightRestrictionsMatter && attraction.heightRestriction && (
                        <span className="tag" data-tone="recommended">
                          {attraction.heightRestriction}
                        </span>
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
            {multiPassAttractions.map((attraction) => {
              const returnWindow = selections.returnWindows?.[attraction.id];

              return (
                <li key={attraction.id} className="ll-section__check-item">
                  <span className="ll-section__check-main">
                    &#10003; {attraction.attractionLabel}
                  </span>
                  {(returnWindow != null ||
                    (heightRestrictionsMatter && attraction.heightRestriction != null)) && (
                    <span className="ll-section__check-meta">
                      {returnWindow && (
                        <span className="tag" data-tone="neutral">
                          {returnWindow}
                        </span>
                      )}
                      {heightRestrictionsMatter && attraction.heightRestriction && (
                        <span className="tag" data-tone="recommended">
                          {attraction.heightRestriction}
                        </span>
                      )}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatPriceBadge(estimate: LLProjectedPrice): string {
  return `$${String(estimate.estimatedPriceUsd)}`;
}
