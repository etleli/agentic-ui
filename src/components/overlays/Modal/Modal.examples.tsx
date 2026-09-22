import { useEffect, useState } from 'react';
import { Button } from '../../inputs';
import { Modal } from './Modal';
import '../OverlayExample.css';
import type { ModalSize } from './Modal.types';

export type ModalExampleProps = {
  confirmLabel?: string;
  description?: string;
  open?: boolean;
  showClose?: boolean;
  size?: ModalSize;
  title?: string;
};

export function ModalExample({
  confirmLabel = 'Run check',
  description = 'This blocks the current workflow until the confirmation is handled.',
  open = true,
  showClose = true,
  size = 'comfortable',
  title = 'Confirm broker check',
}: ModalExampleProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return (
    <div className="overlay-example-stage overlay-example-stage--contained">
      <Button size="comfortable" variant="primary" onClick={() => setIsOpen(true)}>
        Open modal
      </Button>
      <Modal
        confirmLabel={confirmLabel}
        description={description}
        open={isOpen}
        presentation="viewport"
        showClose={showClose}
        size={size}
        title={title}
        onOpenChange={setIsOpen}
      >
        <span>Queued orders stay paused while the runtime verifies account and stream status.</span>
      </Modal>
    </div>
  );
}
