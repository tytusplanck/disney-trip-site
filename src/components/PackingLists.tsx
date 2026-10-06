import PackingIcon from './PackingIcon';
import { useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { PackingArchetype, PackingPriority, TripPackingData } from '../lib/trips/types';
import {
  countPackingItems,
  getPackingCategories,
  PACKING_PRIORITY_LABELS,
} from '../lib/trips/packing';

interface Props {
  data: TripPackingData;
}

const ARCHETYPES = ['adults', 'kids'] as const;
const FILTERS = ['all', 'must', 'rec', 'nice'] as const;

export default function PackingLists({ data }: Props) {
  const [archetype, setArchetype] = useState<PackingArchetype>('adults');
  const [priority, setPriority] = useState<PackingPriority | 'all'>('all');
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const adultCategories = getPackingCategories(data.categories, 'adults');
  const familyCategories = getPackingCategories(data.categories, 'kids');
  const adultCount = countPackingItems(adultCategories);
  const familyCount = countPackingItems(familyCategories);
  const kidsCount = countPackingItems(familyCategories.filter((category) => category.kidsOnly));
  const categories = getPackingCategories(data.categories, archetype, priority);

  function handleRadioKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (index + 1) % ARCHETYPES.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = ARCHETYPES.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setArchetype(ARCHETYPES[next] ?? 'adults');
    radios.current[next]?.focus();
  }

  return (
    <div className="packing">
      <div className="packing__archetypes" role="radiogroup" aria-label="Who are you packing for?">
        {ARCHETYPES.map((value, index) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={archetype === value}
            tabIndex={archetype === value ? 0 : -1}
            className="packing__archetype"
            ref={(element) => {
              radios.current[index] = element;
            }}
            onClick={() => {
              setArchetype(value);
            }}
            onKeyDown={(event) => {
              handleRadioKey(event, index);
            }}
          >
            <PackingIcon name={value === 'adults' ? 'user' : 'friends'} />
            <span className="packing__archetype-title">
              {value === 'adults' ? 'Adults' : 'Adults with kids'}
            </span>{' '}
            <span className="packing__archetype-count">
              {value === 'adults'
                ? `${String(adultCount)} items`
                : `${String(familyCount)} items, ${String(kidsCount)} for kids`}
            </span>
          </button>
        ))}
      </div>
      <div className="packing__filters" role="group" aria-label="Filter by priority">
        {FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            className="packing__chip"
            aria-pressed={priority === value}
            onClick={() => {
              setPriority(value);
            }}
          >
            {value === 'all' ? 'All' : PACKING_PRIORITY_LABELS[value]}
          </button>
        ))}
      </div>
      <p className="visually-hidden" role="status">
        {categories.length > 0
          ? `${String(countPackingItems(categories))} items shown.`
          : 'No items match this priority.'}
      </p>
      {categories.map((category, index) => (
        <section
          className="packing__section"
          key={category.category}
          aria-labelledby={`${id}-${String(index)}`}
        >
          <div className="packing__section-heading">
            <h2 id={`${id}-${String(index)}`}>{category.category}</h2>
            {category.kidsOnly && (
              <span className="packing__pill" data-priority="rec">
                Kids only
              </span>
            )}
          </div>
          <ul className="packing__items">
            {category.items.map((item) => (
              <li
                className={
                  item.details?.length ? 'packing__item packing__item--details' : 'packing__item'
                }
                key={item.name}
              >
                <div className="packing__item-body">
                  <p className="packing__item-name">{item.name}</p>
                  {item.details && item.details.length > 0 && (
                    <ul className="packing__item-details">
                      {item.details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="packing__pill" data-priority={item.priority}>
                  {PACKING_PRIORITY_LABELS[item.priority]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
