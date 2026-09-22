import { useEffect, useState } from 'react';
import { Button } from '../../inputs';
import { StatusBadge } from '../../feedback';
import { Drawer } from './Drawer';
import '../OverlayExample.css';
import type { DrawerPlacement, DrawerSize } from './Drawer.types';

export type DrawerExampleProps = {
  description?: string;
  footer?: string;
  open?: boolean;
  placement?: DrawerPlacement;
  showClose?: boolean;
  size?: DrawerSize;
  title?: string;
};

export function DrawerExample({
  description = 'Side panel for selected node configuration and runtime details.',
  footer = 'Inspector state follows the selected canvas item.',
  open = true,
  placement = 'right',
  showClose = true,
  size = 'comfortable',
  title = 'Node inspector',
}: DrawerExampleProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="overlay-example-stage overlay-example-stage--contained">
      <Button size="comfortable" variant="secondary" onClick={() => setIsOpen(true)}>
        Open drawer
      </Button>
      <Drawer
        description={description}
        footer={footer}
        open={isOpen}
        placement={placement}
        presentation="viewport"
        showClose={showClose}
        size={size}
        title={title}
        onOpenChange={setIsOpen}
      >
        <div className="overlay-example-stack">
          <span>
            Status <StatusBadge animated={false} label="Watching" size="compact" status="watching" variant="soft" />
          </span>
          <span>
            Exposure <strong>42%</strong>
          </span>
          <span>
            Owner <strong>Risk gateway</strong>
          </span>
        </div>
      </Drawer>
    </div>
  );
}
