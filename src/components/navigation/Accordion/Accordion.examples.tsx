import { Activity, Database, Shield } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Accordion } from './Accordion';
import './Accordion.examples.css';
import type { AccordionDensity, AccordionItem, AccordionMode, AccordionVariant } from './Accordion.types';

export type AccordionExampleProps = {
  density?: AccordionDensity;
  mode?: AccordionMode;
  openIdsSource?: string;
  showIcons?: boolean;
  showMetadata?: boolean;
  variant?: AccordionVariant;
};

const accordionItems: AccordionItem[] = [
  {
    content: 'Simulation requests, signal scoring, and replay workers are available.',
    icon: <Activity size={16} aria-hidden="true" />,
    id: 'runtime',
    meta: 'online',
    summary: 'Live service state',
    title: 'Runtime services',
  },
  {
    content: 'Exposure caps, broker limits, and manual override state are checked before routing.',
    icon: <Shield size={16} aria-hidden="true" />,
    id: 'risk',
    meta: 'guarded',
    summary: 'Execution safety controls',
    title: 'Risk controls',
  },
  {
    content: 'Market stream freshness and local cache health determine which previews can refresh.',
    icon: <Database size={16} aria-hidden="true" />,
    id: 'data',
    meta: 'fresh',
    summary: 'Feed and cache state',
    title: 'Data sources',
  },
];

function parseOpenIds(source: string | undefined): string[] {
  return String(source ?? '')
    .split(/[,/>\\n]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function AccordionExample({
  density = 'comfortable',
  mode = 'single',
  openIdsSource = 'runtime',
  showIcons = true,
  showMetadata = true,
  variant = 'bordered',
}: AccordionExampleProps) {
  const parsedOpenIds = useMemo(() => parseOpenIds(openIdsSource), [openIdsSource]);
  const [openIds, setOpenIds] = useState(parsedOpenIds);
  const items = accordionItems.map((item) => ({
    ...item,
    icon: showIcons ? item.icon : undefined,
    meta: showMetadata ? item.meta : undefined,
  }));

  useEffect(() => {
    setOpenIds(parsedOpenIds);
  }, [parsedOpenIds]);

  return (
    <div className="accordion-example">
      <Accordion density={density} items={items} mode={mode} openIds={openIds} variant={variant} onOpenIdsChange={setOpenIds} />
    </div>
  );
}
