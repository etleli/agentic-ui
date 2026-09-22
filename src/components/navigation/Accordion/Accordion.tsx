import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import './Accordion.css';
import type { AccordionItem, AccordionProps } from './Accordion.types';

function getAccordionClassName(className: AccordionProps['className']) {
  return ['navigation-accordion', className].filter(Boolean).join(' ');
}

function normalizeOpenIds(openIds: string[], items: AccordionItem[]) {
  const itemIds = new Set(items.map((item) => item.id));

  return openIds.filter((id) => itemIds.has(id));
}

export function Accordion({
  allowCollapse = true,
  className,
  defaultOpenIds = [],
  density = 'comfortable',
  items,
  mode = 'single',
  openIds,
  variant = 'bordered',
  onOpenIdsChange,
  ...accordionProps
}: AccordionProps) {
  const [uncontrolledOpenIds, setUncontrolledOpenIds] = useState(() => normalizeOpenIds(defaultOpenIds, items));
  const activeOpenIds = normalizeOpenIds(openIds ?? uncontrolledOpenIds, items);

  function toggleItem(item: AccordionItem) {
    if (item.disabled) {
      return;
    }

    const isOpen = activeOpenIds.includes(item.id);
    let nextOpenIds: string[];

    if (mode === 'multiple') {
      nextOpenIds = isOpen ? activeOpenIds.filter((id) => id !== item.id) : [...activeOpenIds, item.id];
    } else if (isOpen && allowCollapse) {
      nextOpenIds = [];
    } else {
      nextOpenIds = [item.id];
    }

    if (openIds === undefined) {
      setUncontrolledOpenIds(nextOpenIds);
    }

    onOpenIdsChange?.(nextOpenIds, item);
  }

  return (
    <div {...accordionProps} className={getAccordionClassName(className)} data-density={density} data-mode={mode} data-variant={variant}>
      {items.map((item) => {
        const isOpen = activeOpenIds.includes(item.id);
        const panelId = `${item.id}-accordion-panel`;
        const buttonId = `${item.id}-accordion-button`;

        return (
          <section className="navigation-accordion__item" data-open={isOpen ? 'true' : undefined} key={item.id}>
            <h3 className="navigation-accordion__heading">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="navigation-accordion__trigger"
                disabled={item.disabled}
                id={buttonId}
                type="button"
                onClick={() => toggleItem(item)}
              >
                {item.icon ? <span className="navigation-accordion__icon">{item.icon}</span> : null}
                <span className="navigation-accordion__copy">
                  <span className="navigation-accordion__title">{item.title}</span>
                  {item.summary ? <span className="navigation-accordion__summary">{item.summary}</span> : null}
                </span>
                {item.meta ? <span className="navigation-accordion__meta">{item.meta}</span> : null}
                <ChevronDown className="navigation-accordion__chevron" size={16} aria-hidden="true" />
              </button>
            </h3>

            <div aria-hidden={!isOpen} aria-labelledby={buttonId} className="navigation-accordion__disclosure" data-collapsed={!isOpen ? 'true' : undefined} id={panelId} role="region">
              <div className="navigation-accordion__disclosure-inner">
                <div className="navigation-accordion__panel" inert={!isOpen ? true : undefined}>
                  {item.content}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export type { AccordionItem, AccordionProps };
