import { useState } from 'react';
import { Button } from '../../inputs/Button';
import { LocationMap } from './LocationMap';
import type { LocationMapMarker, LocationMapProps } from './LocationMap.types';

const markers: LocationMapMarker[] = [
  { id: 'library', label: 'Public library', coordinates: [-73.9823, 40.7532], badge: 1, description: 'Reading room', color: 'var(--color-accent)' },
  { id: 'park', label: 'Bryant Park', coordinates: [-73.9832, 40.7537], badge: 2, description: 'Outdoor space', color: 'var(--color-positive)' },
  { id: 'station', label: 'Grand Central', coordinates: [-73.9772, 40.7527], badge: 3, description: 'Meeting point', color: 'var(--color-warning)' },
];

type LocationMapExampleProps = Pick<LocationMapProps, 'mapStyle' | 'zoom' | 'selectionZoom'> & { selectable: boolean };

export function LocationMapExample({ selectable, ...props }: LocationMapExampleProps) {
  const [selected, setSelected] = useState<string>();
  return <div className="workspace-examples__stack">
    <LocationMap {...props} center={[-73.981, 40.753]} markers={markers} selectedId={selectable ? selected : undefined}
      onSelect={selectable ? (marker) => setSelected(marker.id) : undefined} />
    {selectable ? <div className="workspace-examples__actions" role="group" aria-label="Map locations">
      {markers.map((marker) => <Button key={marker.id} size="compact" variant="secondary" buttonType="toggle" showToggleIndicator={false}
        pressed={selected === marker.id} onPressedChange={(pressed) => setSelected(pressed ? marker.id : undefined)}>{marker.label}</Button>)}
    </div> : null}
  </div>;
}
