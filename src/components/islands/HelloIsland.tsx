import { useState, type ReactElement } from 'react';

interface HelloIslandProps {
  initialLabel: string;
}

export default function HelloIsland({ initialLabel }: HelloIslandProps): ReactElement {
  const [isReady, setIsReady] = useState(false);
  const statusLabel = isReady ? 'Ready' : 'Not ready';

  return (
    <div className="panel panel-compact" aria-live="polite">
      <p className="eyebrow">React island check</p>
      <p className="status-text">
        {initialLabel} <strong>{statusLabel}</strong>
      </p>
      <button
        className="button button-secondary"
        type="button"
        onClick={() => {
          setIsReady((current) => !current);
        }}
      >
        {isReady ? 'Mark not ready' : 'Mark ready'}
      </button>
    </div>
  );
}
