import { ArrowLeft, Pencil } from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '../../feedback/StatusBadge';
import { Button } from '../../inputs/Button';
import { Tabs } from '../../navigation/Tabs';
import { Avatar } from '../../surfaces/Avatar';
import type { PageHeaderProps } from '../Layout.types';
import { PageHeader } from './PageHeader';

type RecordHeaderExampleProps = Pick<PageHeaderProps, 'title' | 'description' | 'meta' | 'density' | 'variant'> & {
  recordId: string;
  showActions: boolean;
  showBack: boolean;
  showBadges: boolean;
  showMedia: boolean;
  showTabs: boolean;
};

export function RecordHeaderExample({ recordId, showActions, showBack, showBadges, showMedia, showTabs, ...props }: RecordHeaderExampleProps) {
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  return <div className="workspace-examples__stack">
    <PageHeader {...props}
      record={{ id: recordId, headingLevel: 2, back: showBack ? <Button size="compact" variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => { setTab('overview'); setEditing(false); }}>Overview</Button> : null,
        badges: showBadges ? <StatusBadge label="Open" status="watching" /> : null,
        media: showMedia ? <Avatar name="Jamie Reed" size="spacious" /> : null,
        actionContent: showActions ? <Button size="compact" icon={<Pencil size={16} />} onClick={() => setEditing(!editing)}>{editing ? 'Finish editing' : 'Edit record'}</Button> : null,
        tabs: showTabs ? <Tabs ariaLabel="Record sections" items={[{ id: 'overview', label: 'Overview' }, { id: 'activity', label: 'Activity' }]} value={tab} showPanels={false} onValueChange={setTab} /> : null }} />
    <p role="status">{showActions && editing ? 'Editing the sample record.' : showTabs && tab === 'activity' ? 'Jamie updated the checklist today.' : 'Confirm the room and supplies with the team.'}</p>
  </div>;
}
