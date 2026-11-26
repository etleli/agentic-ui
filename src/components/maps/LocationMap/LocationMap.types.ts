import type { HTMLAttributes, ReactNode } from 'react';
import type { StyleSpecification } from 'maplibre-gl';

/** A longitude/latitude pair in degrees. */
export type LocationMapCoordinates = [longitude: number, latitude: number];
export type LocationMapMarker = {
  id: string;
  coordinates: LocationMapCoordinates;
  label: string;
  description?: string;
  color?: string;
  badge?: ReactNode;
};

export type LocationMapProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onError' | 'onSelect'> & {
  mapStyle: string | StyleSpecification;
  /** Optional URL for a consumer-hosted MapLibre worker. Maps share MapLibre's worker configuration. */
  workerUrl?: string;
  center: LocationMapCoordinates;
  zoom?: number;
  selectionZoom?: number;
  markers: LocationMapMarker[];
  selectedId?: string;
  onSelect?: (marker: LocationMapMarker) => void;
  /** Render non-interactive content inside the marker's existing button or label. */
  renderMarker?: (marker: LocationMapMarker, selected: boolean) => ReactNode;
  onError?: (error: Error) => void;
  labels?: Partial<{ loading: string; unavailable: string; reset: string }>;
};
