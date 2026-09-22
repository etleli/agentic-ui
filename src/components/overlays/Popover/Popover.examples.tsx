import { useEffect, useState } from 'react';
import { Popover } from './Popover';
import '../OverlayExample.css';
import type { PopoverPlacement, PopoverSize } from './Popover.types';

export type PopoverExampleProps = {
  description?: string;
  footer?: string;
  open?: boolean;
  placement?: PopoverPlacement;
  size?: PopoverSize;
  title?: string;
  triggerLabel?: string;
};

export function PopoverExample({
  description = 'Adjust local settings without leaving the current workspace.',
  footer = 'Changes apply to the selected node only.',
  open = true,
  placement = 'bottom',
  size = 'comfortable',
  title = 'Quick settings',
  triggerLabel = 'Open settings',
}: PopoverExampleProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="overlay-example-stage">
      <Popover
        description={description}
        footer={footer}
        open={isOpen}
        placement={placement}
        size={size}
        title={title}
        triggerLabel={triggerLabel}
        onOpenChange={setIsOpen}
      >
        <div className="overlay-example-stack">
          <span>
            Mode <strong>Simulate</strong>
          </span>
          <span>
            Risk limit <strong>42%</strong>
          </span>
          <span>
            Feed <strong>Paper broker</strong>
          </span>
        </div>
      </Popover>
    </div>
  );
}
