import {
  startTransition,
  useDeferredValue,
  useId,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import AttractionHeatmap from './AttractionHeatmap';
import ConsensusBars from './ConsensusBars';
import type {
  AttractionsExplorerAttraction,
  AttractionsExplorerData,
  AttractionsExplorerState,
} from '../lib/trips/attractions-explorer';
import { deriveAttractionsExplorerView } from '../lib/trips/attractions-explorer';

interface Props {
  data: AttractionsExplorerData;
}

interface SentimentOption {
  value: AttractionsExplorerState['sentiment'];
  label: string;
}

const GROUP_SENTIMENT_OPTIONS: readonly SentimentOption[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

const TRAVELER_SENTIMENT_OPTIONS: readonly SentimentOption[] = [
  { value: 'all', label: 'All' },
  { value: 1, label: 'Must Do' },
  { value: 2, label: 'Preferred' },
  { value: 3, label: 'Indifferent' },
  { value: 4, label: "Don't Want" },
  { value: 5, label: 'Will Skip' },
];

function getDefaultState(): AttractionsExplorerState {
  return {
    selectedDayId: null,
    parkLabel: null,
    areaLabel: null,
    memberId: null,
    sentiment: 'all',
    search: '',
  };
}

function SignalList({
  title,
  items,
  emptyText,
  variant,
}: {
  title: string;
  items: AttractionsExplorerAttraction[];
  emptyText: string;
  variant: 'approval' | 'division';
}) {
  return (
    <section className="attractions-explorer__signal-group">
      <div className="attractions-explorer__signal-header">
        <p className="page-label">{title}</p>
      </div>

      {items.length > 0 ? (
        <ol className="attractions-explorer__signal-list">
          {items.map((item) => (
            <li className="attractions-explorer__signal-item" key={`${variant}-${item.id}`}>
              <div>
                <p className="attractions-explorer__signal-title">{item.attractionLabel}</p>
                <p className="attractions-explorer__signal-meta">
                  {item.parkLabel} / {item.areaLabel}
                </p>
              </div>
              <p className="attractions-explorer__signal-stat">
                {variant === 'approval'
                  ? `${String(item.preferredVotes)} preferred / ${String(item.consensusScore)} score`
                  : `Variance ${item.ratingVariance.toFixed(2)} / ${String(item.consensusScore)} score`}
              </p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="attractions-explorer__signal-empty">{emptyText}</p>
      )}
    </section>
  );
}

function DisclosurePanel({
  label,
  summary,
  detail,
  children,
  className,
}: {
  label: string;
  summary: string;
  detail: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details className={['disclosure-panel', className].filter(Boolean).join(' ')} open>
      <summary className="disclosure-panel__summary">
        <span className="disclosure-panel__summary-copy">
          <span className="disclosure-panel__label">{label}</span>
          <span className="disclosure-panel__headline">{summary}</span>
          <span className="disclosure-panel__detail">{detail}</span>
        </span>
        <span className="disclosure-panel__toggle" aria-hidden="true" />
      </summary>

      <div className="disclosure-panel__body">{children}</div>
    </details>
  );
}

export default function AttractionsExplorer({ data }: Props) {
  const [state, setState] = useState<AttractionsExplorerState>(getDefaultState);
  const deferredSearch = useDeferredValue(state.search);
  const travelerFieldId = useId();
  const searchFieldId = useId();
  const view = deriveAttractionsExplorerView(data, {
    ...state,
    search: deferredSearch,
  });
  const sentimentOptions =
    view.mode === 'group' ? GROUP_SENTIMENT_OPTIONS : TRAVELER_SENTIMENT_OPTIONS;
  const resetDisabled =
    state.selectedDayId === null &&
    state.parkLabel === null &&
    state.areaLabel === null &&
    state.memberId === null &&
    state.sentiment === 'all' &&
    state.search.length === 0;
  const summaryCards = (
    <div className="detail-stat-grid attractions-explorer__summary-grid">
      {view.summaryCards.map((item) => (
        <article className="detail-stat-card" key={item.label}>
          <p className="detail-label">{item.label}</p>
          <p className="detail-value attractions-explorer__summary-value">{item.value}</p>
          <p className="detail-note">{item.detail}</p>
        </article>
      ))}
    </div>
  );

  function updateState(
    nextState: (previousState: AttractionsExplorerState) => AttractionsExplorerState,
  ) {
    startTransition(() => {
      setState((previousState) => nextState(previousState));
    });
  }

  function handleDaySelect(dayId: string | null) {
    if (dayId === null) {
      updateState(() => getDefaultState());
      return;
    }

    const preset = data.dayPresets.find((candidate) => candidate.id === dayId);

    if (!preset) {
      return;
    }

    updateState((previousState) => ({
      ...previousState,
      selectedDayId: preset.id,
      parkLabel: preset.parkLabel,
      areaLabel: null,
    }));
  }

  function handleParkSelect(parkLabel: string | null) {
    updateState((previousState) => ({
      ...previousState,
      selectedDayId: null,
      parkLabel,
      areaLabel: null,
    }));
  }

  function handleAreaSelect(areaLabel: string | null) {
    updateState((previousState) => ({
      ...previousState,
      areaLabel,
    }));
  }

  function handleMemberChange(event: ChangeEvent<HTMLSelectElement>) {
    const memberId = event.target.value.length > 0 ? event.target.value : null;

    updateState((previousState) => ({
      ...previousState,
      memberId,
      sentiment:
        memberId === null
          ? 'all'
          : typeof previousState.sentiment === 'number'
            ? previousState.sentiment
            : 'all',
    }));
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setState((previousState) => ({
      ...previousState,
      search: event.target.value,
    }));
  }

  function handleReset() {
    updateState(() => getDefaultState());
  }

  return (
    <section className="attractions-explorer">
      <article className="attractions-explorer__panel">
        <div className="attractions-explorer__panel-header">
          <div className="attractions-explorer__context">
            <p className="page-label">Decision board</p>
            <h3 className="section-title">{view.contextHeading}</h3>
            <p className="attractions-explorer__context-detail">{view.contextDetail}</p>
          </div>

          <button
            className="attractions-explorer__reset"
            disabled={resetDisabled}
            onClick={handleReset}
            type="button"
          >
            Reset filters
          </button>
        </div>

        <div className="attractions-explorer__filters">
          <section className="attractions-explorer__filter-group">
            <div className="attractions-explorer__filter-heading">
              <p className="attractions-explorer__filter-label">Quick scope</p>
            </div>

            <div className="attractions-explorer__chip-row">
              <button
                aria-pressed={state.selectedDayId === null}
                className={[
                  'attractions-explorer__chip',
                  state.selectedDayId === null ? 'attractions-explorer__chip--active' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  handleDaySelect(null);
                }}
                type="button"
              >
                <span className="attractions-explorer__chip-label">All Trip</span>
                <span className="attractions-explorer__chip-meta">
                  Whole-trip overview across every scored park
                </span>
              </button>

              {data.dayPresets.map((preset) => (
                <button
                  aria-pressed={state.selectedDayId === preset.id}
                  className={[
                    'attractions-explorer__chip',
                    state.selectedDayId === preset.id ? 'attractions-explorer__chip--active' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={preset.id}
                  onClick={() => {
                    handleDaySelect(preset.id);
                  }}
                  type="button"
                >
                  <span className="attractions-explorer__chip-label">{preset.parkLabel}</span>
                  <span className="attractions-explorer__chip-meta">
                    Day {preset.dayNumber} / {preset.weekdayLabel} {preset.dateLabel}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="attractions-explorer__filter-group">
            <div className="attractions-explorer__filter-heading">
              <p className="attractions-explorer__filter-label">Park filter</p>
            </div>

            <div className="attractions-explorer__chip-row attractions-explorer__chip-row--compact">
              <button
                aria-pressed={state.selectedDayId === null && state.parkLabel === null}
                className={[
                  'attractions-explorer__chip',
                  'attractions-explorer__chip--compact',
                  state.selectedDayId === null && state.parkLabel === null
                    ? 'attractions-explorer__chip--active'
                    : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  handleParkSelect(null);
                }}
                type="button"
              >
                All parks
              </button>

              {data.parkLabels.map((parkLabel) => (
                <button
                  aria-pressed={
                    state.parkLabel === parkLabel || view.activeDayPreset?.parkLabel === parkLabel
                  }
                  className={[
                    'attractions-explorer__chip',
                    'attractions-explorer__chip--compact',
                    state.parkLabel === parkLabel || view.activeDayPreset?.parkLabel === parkLabel
                      ? 'attractions-explorer__chip--active'
                      : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={parkLabel}
                  onClick={() => {
                    handleParkSelect(parkLabel);
                  }}
                  type="button"
                >
                  {parkLabel}
                </button>
              ))}
            </div>
          </section>

          {view.availableAreas.length > 0 ? (
            <section className="attractions-explorer__filter-group">
              <div className="attractions-explorer__filter-heading">
                <p className="attractions-explorer__filter-label">Area filter</p>
              </div>

              <div className="attractions-explorer__chip-row attractions-explorer__chip-row--compact">
                <button
                  aria-pressed={state.areaLabel === null}
                  className={[
                    'attractions-explorer__chip',
                    'attractions-explorer__chip--compact',
                    state.areaLabel === null ? 'attractions-explorer__chip--active' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => {
                    handleAreaSelect(null);
                  }}
                  type="button"
                >
                  All areas
                </button>

                {view.availableAreas.map((areaLabel) => (
                  <button
                    aria-pressed={state.areaLabel === areaLabel}
                    className={[
                      'attractions-explorer__chip',
                      'attractions-explorer__chip--compact',
                      state.areaLabel === areaLabel ? 'attractions-explorer__chip--active' : null,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    key={areaLabel}
                    onClick={() => {
                      handleAreaSelect(areaLabel);
                    }}
                    type="button"
                  >
                    {areaLabel}
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          <div className="attractions-explorer__control-grid">
            <label className="attractions-explorer__field" htmlFor={travelerFieldId}>
              <span className="attractions-explorer__filter-label">Traveler</span>
              <select
                className="attractions-explorer__select"
                id={travelerFieldId}
                onChange={handleMemberChange}
                value={state.memberId ?? ''}
              >
                <option value="">Whole group</option>
                {data.party.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="attractions-explorer__field" htmlFor={searchFieldId}>
              <span className="attractions-explorer__filter-label">Search</span>
              <input
                className="attractions-explorer__input"
                id={searchFieldId}
                onChange={handleSearchChange}
                placeholder="Search attraction names"
                type="search"
                value={state.search}
              />
            </label>
          </div>

          <section className="attractions-explorer__filter-group">
            <div className="attractions-explorer__filter-heading">
              <p className="attractions-explorer__filter-label">Sentiment</p>
            </div>

            <div className="attractions-explorer__chip-row attractions-explorer__chip-row--compact">
              {sentimentOptions.map((option) => (
                <button
                  aria-pressed={state.sentiment === option.value}
                  className={[
                    'attractions-explorer__chip',
                    'attractions-explorer__chip--compact',
                    state.sentiment === option.value ? 'attractions-explorer__chip--active' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={`${String(option.value)}-${option.label}`}
                  onClick={() => {
                    updateState((previousState) => ({
                      ...previousState,
                      sentiment: option.value,
                    }));
                  }}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </section>
        </div>
      </article>

      {view.hasResults ? (
        <div className="attractions-explorer__results">
          <article className="attractions-explorer__card attractions-explorer__card--top-picks">
            <div className="trip-page-section__copy">
              <p className="page-label">Top picks</p>
              <h3 className="section-title">The best options in the current slice</h3>
            </div>

            <p className="attractions-explorer__card-note">
              Showing the first {view.topPicks.length} rides from the active ranking stack.
            </p>

            <ConsensusBars items={view.topPicks} />
          </article>

          <DisclosurePanel
            className="attractions-explorer__disclosure--rankings"
            detail={`${String(view.rankedAttractions.length)} rides matched after filtering`}
            label="Detailed rankings"
            summary="Open the full filtered rankings"
          >
            <ConsensusBars items={view.rankedAttractions} />
          </DisclosurePanel>

          {summaryCards}

          <article className="attractions-explorer__card attractions-explorer__card--signals">
            <div className="trip-page-section__copy">
              <p className="page-label">Interesting signals</p>
              <h3 className="section-title">Patterns worth noticing before you commit</h3>
            </div>

            <SignalList
              emptyText="No broad-approval rides remain after the current filters."
              items={view.broadApproval}
              title="Broad approval"
              variant="approval"
            />

            <SignalList
              emptyText="No split-decision rides remain after the current filters."
              items={view.splitDecisions}
              title="Split decisions"
              variant="division"
            />
          </article>

          <article className="attractions-explorer__card attractions-explorer__card--areas">
            <div className="trip-page-section__copy">
              <p className="page-label">Area breakdown</p>
              <h3 className="section-title">Where the strongest pocket of rides lives</h3>
            </div>

            {view.areaBreakdown.length > 0 ? (
              <div className="attractions-explorer__area-grid">
                {view.areaBreakdown.map((area) => (
                  <article className="attractions-explorer__area-card" key={area.areaLabel}>
                    <p className="attractions-explorer__area-name">{area.areaLabel}</p>
                    <div className="attractions-explorer__area-stats">
                      <p className="attractions-explorer__area-score">
                        {area.averageScorePercent}
                        <span>% avg</span>
                      </p>
                      <p className="attractions-explorer__area-meta">
                        {area.attractionCount} rides / {area.highConsensusCount} high-confidence
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="attractions-explorer__signal-empty">
                Area breakdown returns once at least one attraction matches the current filters.
              </p>
            )}
          </article>

          <DisclosurePanel
            className="attractions-explorer__disclosure--matrix"
            detail={`${String(view.heatmapRows.length)} attractions x ${String(data.party.length)} travelers`}
            label="Full matrix"
            summary="Open the filtered traveler matrix"
          >
            <AttractionHeatmap
              highlightMemberId={view.activeMember?.id ?? null}
              party={data.party}
              rows={view.heatmapRows}
            />
          </DisclosurePanel>
        </div>
      ) : (
        <>
          {summaryCards}

          <article className="attractions-explorer__card attractions-explorer__card--empty">
            <div className="empty-state">
              <p className="empty-state__text">No attractions matched the current filter stack.</p>
            </div>

            <p className="attractions-explorer__empty-detail">
              Clear the traveler, sentiment, or search filters to get the board moving again.
            </p>

            <button
              className="attractions-explorer__reset attractions-explorer__reset--inline"
              onClick={handleReset}
              type="button"
            >
              Reset filters
            </button>
          </article>
        </>
      )}
    </section>
  );
}
