import type { Location } from '../types';

export function Legend({ locations }: { locations: Location[] }) {
  return (
    <div className="legend">
      <span className="legend-label">泊まる場所:</span>
      {locations.map((l) => (
        <span key={l.id} className="legend-item">
          <span className="legend-swatch" style={{ backgroundColor: l.color }}>
            {l.short}
          </span>
          {l.name}
        </span>
      ))}
    </div>
  );
}
