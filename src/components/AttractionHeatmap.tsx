import { getPreferenceLegend, getPreferenceMeta } from '../lib/trips/details';
import type { AttractionHeatmapRow } from '../lib/trips/details';
import type { TripPartyMember } from '../lib/trips/types';

interface Props {
  party: TripPartyMember[];
  rows: AttractionHeatmapRow[];
  highlightMemberId?: string | null;
}

export default function AttractionHeatmap({ party, rows, highlightMemberId = null }: Props) {
  const legend = getPreferenceLegend();

  return (
    <div className="trip-heatmap">
      <div className="trip-heatmap__scroll">
        <table className="trip-heatmap__table">
          <thead>
            <tr>
              <th className="trip-heatmap__heading trip-heatmap__heading--attraction">
                Attraction
              </th>
              {party.map((member) => (
                <th
                  className={[
                    'trip-heatmap__heading',
                    highlightMemberId === member.id ? 'trip-heatmap__heading--highlighted' : null,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={member.id}
                >
                  {member.name}
                </th>
              ))}
              <th className="trip-heatmap__heading trip-heatmap__heading--score">Score</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th className="trip-heatmap__attraction" scope="row">
                  <span className="trip-heatmap__attraction-title">{row.attractionLabel}</span>
                  <span className="trip-heatmap__attraction-meta">
                    {row.parkLabel} / {row.areaLabel}
                  </span>
                </th>

                {row.ratings.map((rating) => {
                  const meta = getPreferenceMeta(rating.tier);

                  return (
                    <td
                      className={[
                        'trip-heatmap__cell',
                        highlightMemberId === rating.memberId
                          ? 'trip-heatmap__cell--highlighted'
                          : null,
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      key={rating.memberId}
                    >
                      <span
                        className={`trip-tier-token trip-tier-token--${String(rating.tier)}`}
                        title={`${rating.memberName}: ${meta.label}`}
                        aria-label={`${rating.memberName}: ${meta.label}`}
                      >
                        {meta.shortLabel}
                      </span>
                    </td>
                  );
                })}

                <td className="trip-heatmap__score">{row.consensusScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="trip-heatmap__legend">
        <span className="trip-heatmap__legend-label">Legend</span>
        <ul className="trip-heatmap__legend-list">
          {legend.map((item) => (
            <li className="trip-heatmap__legend-item" key={item.tier}>
              <span className={`trip-tier-token trip-tier-token--${String(item.tier)}`}>
                {item.shortLabel}
              </span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
