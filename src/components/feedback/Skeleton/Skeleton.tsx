import './Skeleton.css';
import type { SkeletonDensity, SkeletonProps, SkeletonVariant } from './Skeleton.types';

const SKELETON_ROW_MIN = 1;
const SKELETON_ROW_MAX = 6;

function getSkeletonClassName(className: SkeletonProps['className']) {
  return ['skeleton', className].filter(Boolean).join(' ');
}

function getSafeRows(rows: number): number {
  if (!Number.isFinite(rows)) {
    return 3;
  }

  return Math.min(Math.max(Math.round(rows), SKELETON_ROW_MIN), SKELETON_ROW_MAX);
}

function renderTextRows(rows: number) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <span className="skeleton__line" data-width={rowIndex === rows - 1 ? 'short' : rowIndex % 2 === 0 ? 'full' : 'medium'} key={rowIndex} />
  ));
}

function renderListRows(rows: number) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <span className="skeleton__list-row" key={rowIndex}>
      <span className="skeleton__avatar" />
      <span className="skeleton__list-copy">
        <span className="skeleton__line" data-width="medium" />
        <span className="skeleton__line" data-width={rowIndex % 2 === 0 ? 'full' : 'short'} />
      </span>
    </span>
  ));
}

export function Skeleton({ animated = true, className, density = 'comfortable', rows = 3, variant = 'text', ...skeletonProps }: SkeletonProps) {
  const safeRows = getSafeRows(rows);

  return (
    <div
      {...skeletonProps}
      aria-hidden="true"
      className={getSkeletonClassName(className)}
      data-animated={animated ? 'true' : 'false'}
      data-density={density}
      data-variant={variant}
    >
      {variant === 'card' ? (
        <>
          <span className="skeleton__media" />
          <span className="skeleton__line" data-width="medium" />
          {renderTextRows(Math.max(1, safeRows - 1))}
        </>
      ) : null}
      {variant === 'list' ? renderListRows(safeRows) : null}
      {variant === 'text' ? renderTextRows(safeRows) : null}
    </div>
  );
}

export type { SkeletonDensity, SkeletonProps, SkeletonVariant };
