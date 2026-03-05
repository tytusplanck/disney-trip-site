import type { ReactNode } from 'react';

interface Props {
  label: string;
  summary: string;
  detail: string;
  children: ReactNode;
  className?: string;
}

export default function DisclosurePanel({ label, summary, detail, children, className }: Props) {
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
