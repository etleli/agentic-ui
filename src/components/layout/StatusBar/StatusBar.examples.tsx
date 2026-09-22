import { StatusBar } from './StatusBar';
import type { StatusBarProps } from '../Layout.types';

export type StatusBarExampleProps = StatusBarProps;

export function StatusBarExample({ density = 'comfortable', variant = 'default' }: StatusBarExampleProps) {
  return (
    <StatusBar
      density={density}
      items={[
        { id: 'stream', label: 'Broker stream', tone: 'positive', value: '38 ms' },
        { id: 'risk', label: 'Risk gate', tone: 'warning', value: 'Watch' },
        { id: 'mode', label: 'Mode', tone: 'accent', value: 'Paper' },
      ]}
      variant={variant}
    />
  );
}
