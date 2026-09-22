import { ChevronRight, Ellipsis, Home } from 'lucide-react';
import './Breadcrumb.css';
import type { BreadcrumbItem, BreadcrumbProps } from './Breadcrumb.types';

function getBreadcrumbClassName(className: BreadcrumbProps['className']) {
  return ['navigation-breadcrumb', className].filter(Boolean).join(' ');
}

function getVisibleItems(items: BreadcrumbItem[], maxItems: number): Array<BreadcrumbItem | 'ellipsis'> {
  if (maxItems < 3 || items.length <= maxItems) {
    return items;
  }

  const tailCount = maxItems - 2;
  return [items[0], 'ellipsis', ...items.slice(items.length - tailCount)];
}

function isCurrentItem(item: BreadcrumbItem, itemIndex: number, items: BreadcrumbItem[]) {
  return item.current || (!items.some((candidate) => candidate.current) && itemIndex === items.length - 1);
}

export function Breadcrumb({
  anchorProps,
  ariaLabel = 'Breadcrumb',
  className,
  density = 'comfortable',
  items,
  maxItems = 5,
  showHomeIcon = true,
  variant = 'plain',
  onItemSelect,
  ...breadcrumbProps
}: BreadcrumbProps) {
  const visibleItems = getVisibleItems(items, maxItems);

  return (
    <nav {...breadcrumbProps} aria-label={ariaLabel} className={getBreadcrumbClassName(className)} data-density={density} data-variant={variant}>
      <ol className="navigation-breadcrumb__list">
        {visibleItems.map((item, visibleIndex) => {
          if (item === 'ellipsis') {
            return (
              <li className="navigation-breadcrumb__item" key="ellipsis">
                <span className="navigation-breadcrumb__separator" aria-hidden="true">
                  <ChevronRight size={14} />
                </span>
                <span className="navigation-breadcrumb__ellipsis" aria-label="Collapsed path">
                  <Ellipsis size={16} aria-hidden="true" />
                </span>
              </li>
            );
          }

          const originalIndex = items.findIndex((candidate) => candidate.id === item.id);
          const isCurrent = isCurrentItem(item, originalIndex, items);
          const content = (
            <>
              {showHomeIcon && originalIndex === 0 ? <Home size={15} aria-hidden="true" /> : item.icon}
              <span>{item.label}</span>
            </>
          );

          return (
            <li className="navigation-breadcrumb__item" key={item.id}>
              {visibleIndex > 0 ? (
                <span className="navigation-breadcrumb__separator" aria-hidden="true">
                  <ChevronRight size={14} />
                </span>
              ) : null}
              {isCurrent || item.disabled ? (
                <span aria-current={isCurrent ? 'page' : undefined} className="navigation-breadcrumb__current" data-disabled={item.disabled ? 'true' : undefined}>
                  {content}
                </span>
              ) : item.href ? (
                <a {...anchorProps} aria-label={item.ariaLabel ?? item.label} className="navigation-breadcrumb__link" href={item.href} onClick={() => onItemSelect?.(item)}>
                  {content}
                </a>
              ) : (
                <button aria-label={item.ariaLabel ?? item.label} className="navigation-breadcrumb__link" type="button" onClick={() => onItemSelect?.(item)}>
                  {content}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export type { BreadcrumbItem, BreadcrumbProps };
