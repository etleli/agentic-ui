import { useEffect, useState } from 'react';
import '../SurfaceExample.css';
import { Section } from './Section';
import type { SectionDensity, SectionVariant } from './Section.types';

export type SectionExampleProps = {
  collapsed?: boolean;
  collapsible?: boolean;
  density?: SectionDensity;
  description?: string;
  heading?: string;
  showDivider?: boolean;
  variant?: SectionVariant;
};

export function SectionExample({
  collapsed = false,
  collapsible = true,
  density = 'comfortable',
  description = 'A titled region for related controls or content.',
  heading = 'Execution settings',
  showDivider = true,
  variant = 'panel',
}: SectionExampleProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);

  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);

  return (
    <div className="surface-example">
      <Section
        collapsed={isCollapsed}
        collapsible={collapsible}
        density={density}
        description={description}
        footer="Section footer text"
        heading={heading}
        showDivider={showDivider}
        variant={variant}
        onCollapsedChange={setIsCollapsed}
      >
        <div className="surface-example__split">
          <span className="surface-example__sample-line">
            <span>Mode</span>
            <strong>Simulated</strong>
          </span>
          <span className="surface-example__sample-line">
            <span>Guard</span>
            <strong>Enabled</strong>
          </span>
        </div>
      </Section>

      <div className="surface-example__summary" role="status">
        <span>Section</span>
        <strong>{isCollapsed ? 'Collapsed' : 'Expanded'}</strong>
      </div>
    </div>
  );
}
