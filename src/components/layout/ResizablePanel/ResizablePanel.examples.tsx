import { useEffect, useState } from 'react';
import { PropertyList } from '../../data-display/PropertyList';
import { ResizablePanel } from './ResizablePanel';
import type { ResizablePanelProps } from '../Layout.types';

export type ResizablePanelExampleProps = ResizablePanelProps;

export function ResizablePanelExample({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  defaultSize = 360,
  description = 'Drag the edge to resize the panel.',
  direction = 'right',
  maxSize = 680,
  minSize = 220,
  persistKey,
  resizable = true,
  size,
  title = 'Node inspector',
  variant = 'default',
}: ResizablePanelExampleProps) {
  const requestedSize = size ?? defaultSize;
  const [activeSize, setActiveSize] = useState(requestedSize);

  useEffect(() => {
    setActiveSize(requestedSize);
  }, [requestedSize]);

  return (
    <ResizablePanel
      brandWatermark={brandWatermark}
      brandWatermarkPlacement={brandWatermarkPlacement}
      defaultSize={defaultSize}
      description={description}
      direction={direction}
      maxSize={maxSize}
      minSize={minSize}
      persistKey={persistKey}
      resizable={resizable}
      size={activeSize}
      title={title}
      variant={variant}
      onSizeChange={setActiveSize}
    >
      <PropertyList
        columns="one"
        items={[
          { id: 'selected-node', label: 'Selected node', value: 'Risk gate' },
          { id: 'mode', label: 'Mode', value: 'Validate only' },
          { id: 'state', label: 'State', tone: 'warning', value: 'Watch' },
        ]}
        variant="panel"
      />
    </ResizablePanel>
  );
}
