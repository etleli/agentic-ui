import { NotebookPen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TextInput } from '../../inputs/TextInput';
import { Panel } from '../../surfaces/Panel';
import { DockablePanel } from './DockablePanel';
import type { DockablePanelMode, DockablePanelProps } from './DockablePanel.types';

function DraftNote() {
  const [draft, setDraft] = useState('');
  return <TextInput ariaLabel="Draft note" label="Draft note" placeholder="Write a note before pinning" value={draft} onValueChange={setDraft} />;
}

type DockablePanelExampleProps = Pick<DockablePanelProps, 'title' | 'description' | 'side'> & {
  mode: DockablePanelMode;
  minDockWidth: number;
  count: number;
};

export function DockablePanelExample({ mode, minDockWidth, ...props }: DockablePanelExampleProps) {
  const [activeMode, setActiveMode] = useState(mode);
  useEffect(() => setActiveMode(mode), [mode]);

  return <DockablePanel {...props} minDockWidth={minDockWidth} mode={activeMode} onModeChange={setActiveMode}
    icon={<NotebookPen size={18} aria-hidden="true" />}
    panel={<div className="workspace-examples__stack">
      <p>Confirm the room and check material availability.</p>
      <DraftNote />
    </div>}>
    <Panel variant="outlined"><strong>Workshop preparation</strong><p>Open the notes panel. Pinning is available when the preview is at least {minDockWidth}px wide.</p></Panel>
  </DockablePanel>;
}
