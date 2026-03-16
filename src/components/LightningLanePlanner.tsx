import { useCallback, useState } from 'react';
import type {
  LLAttraction,
  LLMemberPlan,
  LLParkDay,
  LLParkDaySelections,
  LLParkId,
  LLParkInventory,
  LLPlannerData,
} from '../lib/trips/ll-types';
import {
  deserializePlan,
  emptySelections,
  getMultiPassCount,
  serializePlan,
  toggleSelection,
} from '../lib/trips/ll-planner';

interface Props {
  data: LLPlannerData;
}

type ViewMode = 'summary' | 'edit';

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
    parkDays: Object.fromEntries(data.parkDays.map((d) => [d.parkDate, emptySelections()])),
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

  const activeParkDay = data.parkDays.find((d) => d.parkDate === activeParkDate) ?? firstParkDay;
  const activeDaySelections = currentPlan.parkDays[activeParkDate] ?? emptySelections();
  const activeInventory = activeParkDay ? data.inventory[activeParkDay.parkId] : undefined;

  const handleToggle = useCallback(
    (attractionId: string) => {
      if (!activeInventory) return;
      setCurrentPlan((prev) => {
        const currentSelections = prev.parkDays[activeParkDate] ?? emptySelections();
        const newSelections = toggleSelection(currentSelections, attractionId, activeInventory);
        return {
          ...prev,
          parkDays: {
            ...prev.parkDays,
            [activeParkDate]: newSelections,
          },
        };
      });
    },
    [activeParkDate, activeInventory],
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

  const ownerName = data.party.find((m) => m.id === data.ownerMemberId)?.name;

  if (viewMode === 'summary') {
    return (
      <div className="ll-planner">
        {!isSharedLink && ownerName && (
          <div className="ll-shared-banner">
            <p className="ll-shared-banner__text">
              Viewing <strong>{ownerName}&rsquo;s</strong> Lightning Lane picks
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
        )}
        {data.parkDays.map((day) => (
          <LLParkDayCardReadOnly
            key={day.parkDate}
            day={day}
            inventory={data.inventory[day.parkId]}
            selections={currentPlan.parkDays[day.parkDate] ?? emptySelections()}
          />
        ))}
        {isSharedLink && (
          <div className="ll-planner__actions">
            <button
              className="ll-planner__action-btn"
              onClick={() => {
                setViewMode('edit');
              }}
              type="button"
            >
              Customize picks
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ll-planner">
      <div className="ll-planner__controls">
        <div className="ll-planner__control-group">
          <p className="ll-planner__control-label">Park day</p>
          <div className="ll-planner__chip-row">
            {data.parkDays.map((day) => {
              const abbrev = getParkAbbreviation(day.parkId);
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
                  {abbrev} &middot; {day.dateLabel}
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

// Edit mode park day card
function LLParkDayCard({
  day,
  inventory,
  selections,
  onToggle,
}: {
  day: LLParkDay;
  inventory: LLParkInventory;
  selections: LLParkDaySelections;
  onToggle: (id: string) => void;
}) {
  const illAttractions = inventory.attractions.filter((a) => a.passType === 'individual');
  const tier1Attractions = inventory.attractions.filter(
    (a) => a.passType === 'multipass' && a.tier === 'tier1',
  );
  const tier2Attractions = inventory.attractions.filter(
    (a) => a.passType === 'multipass' && a.tier === 'tier2',
  );
  const noTierAttractions = inventory.attractions.filter(
    (a) => a.passType === 'multipass' && a.tier === 'notier',
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
          {day.scheduleNotes ? ` \u00b7 ${day.scheduleNotes}` : ''}
        </p>
      </div>

      {/* ILL Section */}
      <LLSection
        eyebrow="Lightning Lane Single Pass"
        subtitle={'Purchased individually \u00b7 ~$15\u201325/person'}
      >
        {illAttractions.map((a) => (
          <LLAttractionRow
            key={a.id}
            attraction={a}
            checked={selections.illSelections.includes(a.id)}
            disabled={false}
            inputType="checkbox"
            onToggle={onToggle}
          />
        ))}
      </LLSection>

      {/* Tiered parks */}
      {inventory.hasTiers && (
        <>
          <LLSection
            eyebrow={'Multi Pass \u00b7 Tier 1'}
            constraint={`Choose ${String(inventory.maxTier1)}`}
          >
            {tier1Attractions.map((a) => (
              <LLAttractionRow
                key={a.id}
                attraction={a}
                checked={selections.tier1Selection === a.id}
                disabled={false}
                inputType="radio"
                onToggle={onToggle}
              />
            ))}
          </LLSection>

          <LLSection
            eyebrow={'Multi Pass \u00b7 Tier 2'}
            constraint={`Choose ${String(inventory.maxTier2)}`}
            count={selections.tier2Selections.length}
            max={inventory.maxTier2}
          >
            {tier2Attractions.map((a) => {
              const isSelected = selections.tier2Selections.includes(a.id);
              const atCap = selections.tier2Selections.length >= inventory.maxTier2;
              return (
                <LLAttractionRow
                  key={a.id}
                  attraction={a}
                  checked={isSelected}
                  disabled={!isSelected && atCap}
                  inputType="checkbox"
                  onToggle={onToggle}
                />
              );
            })}
          </LLSection>
        </>
      )}

      {/* Non-tiered (AK) */}
      {!inventory.hasTiers && (
        <LLSection
          eyebrow="Multi Pass"
          constraint={`Choose ${String(inventory.maxMultiPass)}`}
          count={selections.multiPassSelections.length}
          max={inventory.maxMultiPass}
        >
          {noTierAttractions.map((a) => {
            const isSelected = selections.multiPassSelections.includes(a.id);
            const atCap = selections.multiPassSelections.length >= inventory.maxMultiPass;
            return (
              <LLAttractionRow
                key={a.id}
                attraction={a}
                checked={isSelected}
                disabled={!isSelected && atCap}
                inputType="checkbox"
                onToggle={onToggle}
              />
            );
          })}
        </LLSection>
      )}

      {/* Summary */}
      <div className="ll-card__summary">
        Single Pass: {selections.illSelections.length} selected &middot; Multi Pass:{' '}
        {multiPassCount} of {multiPassMax}
      </div>
    </div>
  );
}

// Section wrapper
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

// Attraction row
function LLAttractionRow({
  attraction,
  checked,
  disabled,
  inputType,
  onToggle,
}: {
  attraction: LLAttraction;
  checked: boolean;
  disabled: boolean;
  inputType: 'checkbox' | 'radio';
  onToggle: (id: string) => void;
}) {
  const isClosed = attraction.closedDuringTrip;
  const isDisabled = disabled || isClosed;

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
      <span className={`ll-row__label${isClosed ? ' ll-row__label--closed' : ''}`}>
        {attraction.attractionLabel}
      </span>
      {isClosed && <span className="ll-badge--closed">CLOSED</span>}
      {attraction.heightRestriction && (
        <span className="ll-badge--height">{attraction.heightRestriction}</span>
      )}
      {attraction.heightRestriction && (
        <span className="ll-row__note">Not available for children</span>
      )}
    </label>
  );
}

// Read-only card for summary view
function LLParkDayCardReadOnly({
  day,
  inventory,
  selections,
}: {
  day: LLParkDay;
  inventory: LLParkInventory;
  selections: LLParkDaySelections;
}) {
  const multiPassCount = getMultiPassCount(selections, inventory);
  const multiPassMax = inventory.hasTiers
    ? inventory.maxTier1 + inventory.maxTier2
    : inventory.maxMultiPass;

  function getSelectedAttractions(ids: string[]): LLAttraction[] {
    return ids
      .map((id) => inventory.attractions.find((a) => a.id === id))
      .filter(Boolean) as LLAttraction[];
  }

  const illAttractions = getSelectedAttractions(selections.illSelections);
  const multiPassAttractions = inventory.hasTiers
    ? getSelectedAttractions([
        ...(selections.tier1Selection ? [selections.tier1Selection] : []),
        ...selections.tier2Selections,
      ])
    : getSelectedAttractions(selections.multiPassSelections);

  const hasSelections = illAttractions.length > 0 || multiPassAttractions.length > 0;

  return (
    <div className="ll-card ll-card--readonly">
      <div className="ll-card__header">
        <h3 className="ll-card__park-name">{day.parkLabel}</h3>
        <p className="ll-card__day-info">
          Day {day.dayNumber} &middot; {day.weekdayLabel} {day.dateLabel}
        </p>
      </div>

      {!hasSelections && <p className="ll-card__empty">No selections for this park day.</p>}

      {illAttractions.length > 0 && (
        <div className="ll-section">
          <p className="ll-section__eyebrow">Single Pass</p>
          <p className="ll-section__subtitle">{`Purchased individually \u00b7 ~$15\u201325/person`}</p>
          <ul className="ll-section__check-list">
            {illAttractions.map((a) => (
              <li key={a.id} className="ll-section__check-item">
                <span>&#10003; {a.attractionLabel}</span>
                {a.heightRestriction && (
                  <span className="ll-badge--height">{a.heightRestriction}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {multiPassAttractions.length > 0 && (
        <div className="ll-section">
          <p className="ll-section__eyebrow">
            Multi Pass ({multiPassCount} of {multiPassMax})
          </p>
          <ul className="ll-section__check-list">
            {multiPassAttractions.map((a) => (
              <li key={a.id} className="ll-section__check-item">
                <span>&#10003; {a.attractionLabel}</span>
                {a.heightRestriction && (
                  <span className="ll-badge--height">{a.heightRestriction}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
