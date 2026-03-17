import {
  startTransition,
  useDeferredValue,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';
import ConsensusBars from './ConsensusBars';
import type {
  AttractionsExplorerData,
  AttractionsExplorerState,
} from '../lib/trips/attractions-explorer';
import { deriveAttractionsExplorerView } from '../lib/trips/attractions-explorer';

interface Props {
  data: AttractionsExplorerData;
}

const DEFAULT_VISIBLE_RIDES = 15;

function getDefaultState(): AttractionsExplorerState {
  return {
    selectedDayId: null,
    search: '',
  };
}

export default function AttractionsExplorer({ data }: Props) {
  const [state, setState] = useState<AttractionsExplorerState>(getDefaultState);
  const [showAllRides, setShowAllRides] = useState(false);
  const deferredSearch = useDeferredValue(state.search);
  const searchFieldId = useId();
  const deferredState = useMemo(
    () => ({
      ...state,
      search: deferredSearch,
    }),
    [state, deferredSearch],
  );
  const view = useMemo(
    () => deriveAttractionsExplorerView(data, deferredState),
    [data, deferredState],
  );
  const resetDisabled =
    state.selectedDayId === null && state.search.length === 0;
  const visibleAttractions = showAllRides
    ? view.rankedAttractions
    : view.rankedAttractions.slice(0, DEFAULT_VISIBLE_RIDES);
  const canToggleRideCount = view.rankedAttractions.length > DEFAULT_VISIBLE_RIDES;

  function updateState(
    nextState: (previousState: AttractionsExplorerState) => AttractionsExplorerState,
  ) {
    startTransition(() => {
      setState((previousState) => nextState(previousState));
    });
  }

  function handleDaySelect(dayId: string | null) {
    updateState((previousState) => ({
      ...previousState,
      selectedDayId: dayId,
    }));
    setShowAllRides(false);
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const nextSearch = event.target.value;

    setState((previousState) => ({
      ...previousState,
      search: nextSearch,
    }));
    setShowAllRides(false);
  }

  function handleReset() {
    updateState(() => getDefaultState());
    setShowAllRides(false);
  }

  return (
    <section className="attractions-explorer">
      <article className="attractions-explorer__panel">
        <label
          className="attractions-explorer__field attractions-explorer__field--search"
          htmlFor={searchFieldId}
        >
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

        <section className="attractions-explorer__filter-group">
          <div className="attractions-explorer__filter-heading">
            <p className="attractions-explorer__filter-label">Day scope</p>
            {!resetDisabled ? (
              <button className="attractions-explorer__reset" onClick={handleReset} type="button">
                Reset filters
              </button>
            ) : null}
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
              <span className="attractions-explorer__chip-label">All Park Days</span>
              <span className="attractions-explorer__chip-meta">Whole-trip ranking</span>
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

      </article>

      {view.hasResults ? (
        <section className="attractions-explorer__results" aria-label="Ranked rides">
          <ConsensusBars items={visibleAttractions} />
          {canToggleRideCount ? (
            <button
              className="attractions-explorer__list-toggle"
              onClick={() => {
                setShowAllRides((previousState) => !previousState);
              }}
              type="button"
            >
              {showAllRides
                ? 'Show Top 15 Only'
                : `Show ${String(view.rankedAttractions.length - DEFAULT_VISIBLE_RIDES)} More Rides`}
            </button>
          ) : null}
        </section>
      ) : (
        <article className="attractions-explorer__empty">
          <p className="empty-state__text">No attractions matched the current filters.</p>
          {!resetDisabled ? (
            <button
              className="attractions-explorer__list-toggle"
              onClick={handleReset}
              type="button"
            >
              Reset filters
            </button>
          ) : null}
        </article>
      )}
    </section>
  );
}
