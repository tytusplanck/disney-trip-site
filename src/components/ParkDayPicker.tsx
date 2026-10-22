import type { ReactNode } from 'react';

export interface ParkDayOption {
  id: string;
  label: string;
  meta: string;
}

interface Props {
  label: string;
  options: ParkDayOption[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Adds a leading chip that selects no park day, for whole-trip views. */
  allOption?: Omit<ParkDayOption, 'id'>;
  /** Optional control rendered beside the label, such as a reset button. */
  action?: ReactNode;
}

export default function ParkDayPicker({
  label,
  options,
  selectedId,
  onSelect,
  allOption,
  action,
}: Props) {
  return (
    <div className="park-day-picker" role="group" aria-label={label}>
      <div className="park-day-picker__header">
        <p className="eyebrow" aria-hidden="true">
          {label}
        </p>
        {action}
      </div>
      <div className="park-day-picker__chips">
        {allOption && (
          <ParkDayChip
            option={{ id: '', ...allOption }}
            selected={selectedId === null}
            onSelect={() => {
              onSelect(null);
            }}
          />
        )}
        {options.map((option) => (
          <ParkDayChip
            key={option.id}
            option={option}
            selected={selectedId === option.id}
            onSelect={() => {
              onSelect(option.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function ParkDayChip({
  option,
  selected,
  onSelect,
}: {
  option: ParkDayOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-pressed={selected}
      className="choice-chip park-day-picker__chip"
      onClick={onSelect}
      type="button"
    >
      <span className="park-day-picker__chip-label">{option.label}</span>{' '}
      <span className="park-day-picker__chip-meta">{option.meta}</span>
    </button>
  );
}
