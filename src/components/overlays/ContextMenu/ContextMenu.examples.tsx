import { useEffect, useState } from 'react';
import { ContextMenu } from './ContextMenu';
import '../OverlayExample.css';
import type { ContextMenuItem } from './ContextMenu.types';

export type ContextMenuExampleProps = {
  open?: boolean;
  selectedId?: string;
  showShortcuts?: boolean;
  triggerLabel?: string;
};

const contextMenuItems: ContextMenuItem[] = [
  { description: 'Inspect generated config', id: 'open', label: 'Open details', shortcut: 'Enter', tone: 'accent' },
  { description: 'Duplicate current strategy node', id: 'duplicate', label: 'Duplicate', shortcut: 'Ctrl D' },
  { description: 'Temporarily pause execution', id: 'pause', label: 'Pause', shortcut: 'P' },
  { description: 'Remove from canvas', id: 'delete', label: 'Delete', shortcut: 'Del', tone: 'danger' },
];

export function ContextMenuExample({ open = true, selectedId = 'open', showShortcuts = true, triggerLabel = 'Node actions' }: ContextMenuExampleProps) {
  const [isOpen, setIsOpen] = useState(open);
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  useEffect(() => {
    setActiveId(selectedId);
  }, [selectedId]);

  return (
    <div className="overlay-example-stage">
      <ContextMenu
        items={contextMenuItems}
        open={isOpen}
        selectedId={activeId}
        showShortcuts={showShortcuts}
        triggerLabel={triggerLabel}
        onOpenChange={setIsOpen}
        onSelect={(item) => setActiveId(item.id)}
      >
        <strong>Demo Momentum node</strong>
      </ContextMenu>
    </div>
  );
}
