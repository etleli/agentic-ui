import './LogIndicator.css';
import { useId } from 'react';
import type { LogIndicatorProps, LogIndicatorSize, LogIndicatorTone } from './LogIndicator.types';

function getLogIndicatorClassName(className: LogIndicatorProps['className']) {
  return ['log-indicator', className].filter(Boolean).join(' ');
}

function getDisplayLine(line: string | undefined) {
  const trimmedLine = line?.trim();
  return trimmedLine ? trimmedLine : 'Waiting for log event';
}

function getDisplayHistory(line: string, previousLine: string | undefined, history: string[] | undefined) {
  const historyLines = [line, previousLine, ...(history ?? [])]
    .map((historyLine) => historyLine?.trim())
    .filter((historyLine): historyLine is string => Boolean(historyLine));
  return Array.from(new Set(historyLines)).slice(0, 6);
}

export function LogIndicator({
  animated = true,
  'aria-label': ariaLabel,
  className,
  history,
  historyLabel = 'Recent logs',
  label,
  line,
  previousLine,
  role,
  showTimestamp = true,
  size = 'comfortable',
  timestamp,
  tone = 'accent',
  ...indicatorProps
}: LogIndicatorProps) {
  const historyId = useId();
  const displayLine = getDisplayLine(line);
  const displayPreviousLine = previousLine?.trim();
  const displayLabel = label?.trim();
  const displayTimestamp = timestamp?.trim();
  const displayHistory = getDisplayHistory(displayLine, displayPreviousLine, history);
  const hasHistory = displayHistory.length > 1;
  const hasPreviousLine = Boolean(animated && displayPreviousLine && displayPreviousLine !== displayLine);
  const lineKey = `${displayTimestamp ?? ''}-${displayLine}`;
  const {
    'aria-describedby': ariaDescribedBy,
    tabIndex,
    title,
    ...indicatorRestProps
  } = indicatorProps;
  const describedBy = [ariaDescribedBy, hasHistory ? historyId : undefined].filter(Boolean).join(' ') || undefined;
  const historyTitle = title ?? (hasHistory ? `${historyLabel}\n${displayHistory.join('\n')}` : undefined);

  return (
    <div
      {...indicatorRestProps}
      aria-label={ariaLabel ?? `${displayLabel ? `${displayLabel} ` : ''}${displayLine}`}
      aria-describedby={describedBy}
      aria-live="polite"
      className={getLogIndicatorClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-tone={tone}
      role={role ?? 'status'}
      tabIndex={hasHistory ? (tabIndex ?? 0) : tabIndex}
      title={historyTitle}
    >
      <span className="log-indicator__signal" aria-hidden="true" />

      <span className="log-indicator__body">
        {displayLabel ? <span className="log-indicator__label">{displayLabel}</span> : null}
        <span className="log-indicator__viewport">
          {hasPreviousLine ? (
            <span className="log-indicator__line log-indicator__line--previous" key={`previous-${lineKey}`}>
              {displayPreviousLine}
            </span>
          ) : null}
          <span className="log-indicator__line log-indicator__line--current" key={`current-${lineKey}`}>
            {showTimestamp && displayTimestamp ? <span className="log-indicator__timestamp">{displayTimestamp}</span> : null}
            <span className="log-indicator__message">{displayLine}</span>
          </span>
        </span>
      </span>
      {hasHistory ? (
        <span className="log-indicator__history" id={historyId} role="tooltip">
          <span className="log-indicator__history-title">{historyLabel}</span>
          <span className="log-indicator__history-list">
            {displayHistory.map((historyLine, index) => (
              <span className="log-indicator__history-item" key={`${historyLine}-${index}`}>
                <span className="log-indicator__history-index">{index === 0 ? 'Latest' : `-${index}`}</span>
                <span className="log-indicator__history-message">{historyLine}</span>
              </span>
            ))}
          </span>
        </span>
      ) : null}
    </div>
  );
}

export type { LogIndicatorProps, LogIndicatorSize, LogIndicatorTone };
