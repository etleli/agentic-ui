import '../FeedbackExample.css';
import { LogIndicator } from './LogIndicator';
import type { LogIndicatorSize, LogIndicatorTone } from './LogIndicator.types';

const FALLBACK_LOG_LINES = [
  'Signal score updated for Demo Momentum',
  'Order router accepted rebalance instruction',
  'Risk gateway moved exposure limit to watch',
  'Broker stream heartbeat received',
];

export type LogIndicatorExampleProps = {
  animated?: boolean;
  label?: string;
  lineIndex?: number;
  lineSource?: string;
  showTimestamp?: boolean;
  size?: LogIndicatorSize;
  timestamp?: string;
  tone?: LogIndicatorTone;
};

function parseLogLines(lineSource: string | undefined) {
  const parsedLines = lineSource
    ?.split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return parsedLines && parsedLines.length > 0 ? parsedLines : FALLBACK_LOG_LINES;
}

function getWrappedIndex(index: number, itemCount: number) {
  if (itemCount <= 0) {
    return 0;
  }

  return ((index % itemCount) + itemCount) % itemCount;
}

export function LogIndicatorExample({
  animated = true,
  label = 'Runtime log',
  lineIndex = 1,
  lineSource,
  showTimestamp = true,
  size = 'comfortable',
  timestamp = '14:08:12',
  tone = 'accent',
}: LogIndicatorExampleProps) {
  const lines = parseLogLines(lineSource);
  const currentIndex = getWrappedIndex(lineIndex, lines.length);
  const previousIndex = getWrappedIndex(currentIndex - 1, lines.length);

  return (
    <div className="feedback-example">
      <div className="feedback-example__surface" data-wide="true">
        <LogIndicator
          animated={animated}
          label={label}
          line={lines[currentIndex]}
          previousLine={lines[previousIndex]}
          showTimestamp={showTimestamp}
          size={size}
          timestamp={timestamp}
          tone={tone}
        />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Log line</span>
        <strong>{currentIndex + 1}</strong>
      </div>
    </div>
  );
}

export { FALLBACK_LOG_LINES };
