import { useEffect, useState } from 'react';
import { AuditTrail } from './AuditTrail';
import type { ActivityDensity, ActivityVariant } from '../Activity.types';

export type AuditTrailExampleProps = {
  density?: ActivityDensity;
  selectable?: boolean;
  selectedEntryId?: string;
  showActors?: boolean;
  variant?: ActivityVariant;
};

const auditEntries = [
  { actor: 'Risk gateway', description: 'Exposure limit moved to watch.', id: '105', state: 'system' as const, timestamp: '14:08', title: 'Runtime update 105' },
  { actor: 'Alex', description: 'Approved strategy candidate for paper routing.', id: '106', state: 'approved' as const, timestamp: '14:11', title: 'Approval recorded' },
  { actor: 'Order router', description: 'Blocked live submit until broker heartbeat returns.', id: '107', state: 'blocked' as const, timestamp: '14:13', title: 'Submit blocked' },
];

export function AuditTrailExample({ density = 'comfortable', selectable = true, selectedEntryId = '106', showActors = true, variant = 'default' }: AuditTrailExampleProps) {
  const [activeEntryId, setActiveEntryId] = useState(selectedEntryId);

  useEffect(() => {
    setActiveEntryId(selectedEntryId);
  }, [selectedEntryId]);

  return (
    <AuditTrail
      density={density}
      entries={auditEntries}
      selectable={selectable}
      selectedEntryId={activeEntryId}
      showActors={showActors}
      variant={variant}
      onEntrySelect={setActiveEntryId}
    />
  );
}
