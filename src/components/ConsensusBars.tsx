import type { AttractionsExplorerAttraction } from '../lib/trips/attractions-explorer';

interface Props {
  items: AttractionsExplorerAttraction[];
}

export default function ConsensusBars({ items }: Props) {
  return (
    <div className="consensus-bars" aria-label="Consensus rankings">
      {items.map((item, index) => (
        <article className="consensus-row" key={item.id}>
          <div className="consensus-row__meta">
            <p className="consensus-row__label">
              <span className="consensus-row__label-text">{item.attractionLabel}</span>
              {index < 3 ? <span className="consensus-row__star">Top {index + 1}</span> : null}
            </p>
            <p className="consensus-row__sub">
              {item.parkLabel} / {item.areaLabel}
            </p>
          </div>

          <div className="consensus-row__track">
            <progress
              className={`consensus-progress consensus-progress--${item.tone}`}
              max={item.maxScore}
              value={item.consensusScore}
            />
            <p className="consensus-row__votes">
              {item.mustDoVotes} must-do / {item.preferredVotes} preferred
            </p>
          </div>

          <p className="consensus-row__score">
            {item.consensusScore}
            <span>/{item.maxScore}</span>
          </p>
        </article>
      ))}
    </div>
  );
}
