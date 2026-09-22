import { Database, Folder, LineChart } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumb } from './Breadcrumb';
import './Breadcrumb.examples.css';
import type { BreadcrumbDensity, BreadcrumbItem, BreadcrumbVariant } from './Breadcrumb.types';

export type BreadcrumbExampleProps = {
  density?: BreadcrumbDensity;
  maxItems?: number;
  showHomeIcon?: boolean;
  variant?: BreadcrumbVariant;
};

const breadcrumbItems: BreadcrumbItem[] = [
  { href: '#workspace', icon: <Folder size={15} aria-hidden="true" />, id: 'workspace', label: 'Workspace' },
  { href: '#strategies', icon: <LineChart size={15} aria-hidden="true" />, id: 'strategies', label: 'Strategies' },
  { href: '#momentum', id: 'momentum', label: 'Demo Momentum' },
  { href: '#runtime', icon: <Database size={15} aria-hidden="true" />, id: 'runtime', label: 'Runtime' },
  { current: true, id: 'signals', label: 'Signals' },
];

export function BreadcrumbExample({ density = 'comfortable', maxItems = 5, showHomeIcon = true, variant = 'panel' }: BreadcrumbExampleProps) {
  const [selectedLabel, setSelectedLabel] = useState('Signals');

  return (
    <div className="breadcrumb-example">
      <Breadcrumb density={density} items={breadcrumbItems} maxItems={maxItems} showHomeIcon={showHomeIcon} variant={variant} onItemSelect={(item) => setSelectedLabel(item.label)} />
      <span className="breadcrumb-example__selection">Selected: {selectedLabel}</span>
    </div>
  );
}
