import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import './Section.css';
import type { SectionDensity, SectionProps, SectionVariant } from './Section.types';

function getSectionClassName(className: SectionProps['className']) {
  return ['surface-section', className].filter(Boolean).join(' ');
}

export function Section({
  actions,
  children,
  className,
  collapsed,
  collapsible = false,
  defaultCollapsed = false,
  density = 'comfortable',
  description,
  footer,
  heading,
  id,
  onCollapsedChange,
  showDivider = true,
  variant = 'plain',
  ...sectionProps
}: SectionProps) {
  const generatedId = useId();
  const contentId = `${id ?? generatedId}-content`;
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const isCollapsed = collapsible ? (collapsed ?? internalCollapsed) : false;
  const hasHeader = Boolean(heading || description || actions || collapsible);

  function toggleCollapsed() {
    const nextCollapsed = !isCollapsed;

    if (collapsed === undefined) {
      setInternalCollapsed(nextCollapsed);
    }

    onCollapsedChange?.(nextCollapsed);
  }

  return (
    <section
      {...sectionProps}
      className={getSectionClassName(className)}
      data-collapsed={isCollapsed ? 'true' : undefined}
      data-density={density}
      data-divider={showDivider ? 'true' : undefined}
      data-variant={variant}
      id={id}
    >
      {hasHeader ? (
        <header className="surface-section__header">
          <span className="surface-section__heading-copy">
            {heading ? <strong className="surface-section__heading">{heading}</strong> : null}
            {description ? <span className="surface-section__description">{description}</span> : null}
          </span>
          <span className="surface-section__actions">
            {actions}
            {collapsible ? (
              <Tooltip content={isCollapsed ? 'Expand section' : 'Collapse section'} placement="left" size="compact">
                <button
                  className="surface-section__toggle"
                  type="button"
                  aria-controls={contentId}
                  aria-expanded={!isCollapsed}
                  aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} section`}
                  onClick={toggleCollapsed}
                >
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
              </Tooltip>
            ) : null}
          </span>
        </header>
      ) : null}

      <div className="surface-section__disclosure" aria-hidden={isCollapsed} data-collapsed={isCollapsed ? 'true' : undefined} id={contentId}>
        <div className="surface-section__disclosure-inner">
          <div className="surface-section__body" inert={isCollapsed ? true : undefined}>
            {children}
          </div>
        </div>
      </div>
      {footer ? <footer className="surface-section__footer">{footer}</footer> : null}
    </section>
  );
}

export type { SectionDensity, SectionProps, SectionVariant };
