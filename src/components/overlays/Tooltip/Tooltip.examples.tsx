import { useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '../../inputs';
import { Tooltip } from './Tooltip';
import '../OverlayExample.css';
import type { TooltipPlacement, TooltipSize, TooltipTone } from './Tooltip.types';

export type TooltipExampleProps = {
  content?: string;
  disabled?: boolean;
  open?: boolean;
  placement?: TooltipPlacement;
  size?: TooltipSize;
  tone?: TooltipTone;
  triggerLabel?: string;
};

export function TooltipExample({
  content = 'Live broker status updates every five seconds.',
  disabled = false,
  open = true,
  placement = 'top',
  size = 'comfortable',
  tone = 'neutral',
  triggerLabel = 'Broker stream',
}: TooltipExampleProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="overlay-example-stage overlay-example-stage--compact">
      <Tooltip
        content={content}
        disabled={disabled}
        open={isOpen}
        placement={placement}
        size={size}
        tone={tone}
        onOpenChange={setIsOpen}
      >
        <Button icon={<Info size={16} aria-hidden="true" />} size="comfortable" variant="secondary">
          {triggerLabel}
        </Button>
      </Tooltip>
    </div>
  );
}
