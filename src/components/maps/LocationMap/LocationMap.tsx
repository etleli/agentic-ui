import { LocateFixed } from 'lucide-react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import bundledWorkerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../../inputs/Button';
import type { LocationMapMarker, LocationMapProps } from './LocationMap.types';
import 'maplibre-gl/dist/maplibre-gl.css';
import './LocationMap.css';

type Runtime = { library: typeof import('maplibre-gl'); map: MapLibreMap };

function MarkerView({ runtime, marker, selected, onSelect, renderMarker }: {
  runtime: Runtime;
  marker: LocationMapMarker;
  selected: boolean;
  onSelect: LocationMapProps['onSelect'];
  renderMarker: LocationMapProps['renderMarker'];
}) {
  const [host] = useState(() => document.createElement('div'));
  const [longitude, latitude] = marker.coordinates;

  useEffect(() => {
    const mark = new runtime.library.Marker({ element: host, anchor: 'bottom' }).setLngLat([longitude, latitude]).addTo(runtime.map);
    return () => { mark.remove(); };
  }, [host, latitude, longitude, runtime]);

  const contents = renderMarker ? renderMarker(marker, selected) : <>
    <span className="location-map__marker-badge">{marker.badge ?? '•'}</span>
    <span className="location-map__marker-copy"><strong>{marker.label}</strong>{marker.description ? <small>{marker.description}</small> : null}</span>
  </>;
  const className = 'location-map__marker';
  const style = { borderColor: marker.color };
  return createPortal(onSelect
    ? <button type="button" className={className} style={style} aria-pressed={selected} aria-label={marker.label} onClick={() => onSelect(marker)}>{contents}</button>
    : <div className={className} style={style} data-selected={selected}>{contents}</div>, host);
}

export function LocationMap({ mapStyle, center, zoom = 12, selectionZoom = 15, markers, selectedId, workerUrl = bundledWorkerUrl,
  onSelect, renderMarker, onError, labels, className, ...attributes }: LocationMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const [runtime, setRuntime] = useState<Runtime>();
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const view = useRef({ center, zoom });
  const errorHandler = useRef(onError);
  const [longitude, latitude] = center;
  const selected = markers.find((marker) => marker.id === selectedId);
  const selectedLongitude = selected?.coordinates[0], selectedLatitude = selected?.coordinates[1];
  const resetLabel = labels?.reset ?? 'Show map overview';

  useEffect(() => { view.current = { center: [longitude, latitude], zoom }; }, [latitude, longitude, zoom]);
  useEffect(() => { errorHandler.current = onError; }, [onError]);
  useEffect(() => {
    const element = container.current;
    if (!element) return undefined;
    let cancelled = false;
    let map: MapLibreMap | undefined;
    let observer: ResizeObserver | undefined;
    setLoaded(false);
    setFailed(false);
    setRuntime(undefined);

    void import('maplibre-gl').then((library) => {
      if (cancelled) return;
      library.setWorkerUrl(workerUrl);
      const instance = new library.Map({ ...view.current, container: element, style: mapStyle, scrollZoom: false });
      map = instance;
      instance.addControl(new library.NavigationControl(), 'top-right');
      instance.once('load', () => { if (!cancelled) { setLoaded(true); setFailed(false); } });
      instance.on('error', ({ error }) => {
        if (cancelled) return;
        if (!instance.isStyleLoaded()) setFailed(true);
        errorHandler.current?.(error instanceof Error ? error : new Error(error.message));
      });
      if (typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver(() => instance.resize());
        observer.observe(element);
      }
      setRuntime({ map: instance, library });
    }).catch((reason: unknown) => {
      if (cancelled) return;
      setFailed(true);
      errorHandler.current?.(reason instanceof Error ? reason : new Error(String(reason)));
    });

    return () => {
      cancelled = true;
      observer?.disconnect();
      map?.remove();
    };
  }, [mapStyle, workerUrl]);

  useEffect(() => {
    if (!runtime || !loaded) return;
    if (selectedLongitude !== undefined && selectedLatitude !== undefined) {
      runtime.map.easeTo({ center: [selectedLongitude, selectedLatitude], zoom: selectionZoom });
    } else {
      runtime.map.easeTo({ center: [longitude, latitude], zoom });
    }
  }, [latitude, loaded, longitude, runtime, selectedLatitude, selectedLongitude, selectionZoom, zoom]);

  return <div aria-label="Location map" {...attributes} className={['location-map', className].filter(Boolean).join(' ')}>
    <div className="location-map__surface" ref={container} />
    {runtime && loaded ? <div className="location-map__tools">
      <Button aria-label={resetLabel} tooltip={resetLabel} iconOnly icon={<LocateFixed size={16} aria-hidden="true" />} size="compact" variant="secondary"
        onClick={() => runtime.map.easeTo({ center: [longitude, latitude], zoom })} />
    </div> : <p className="location-map__status" role="status">{failed ? labels?.unavailable ?? 'Map unavailable.' : labels?.loading ?? 'Loading map…'}</p>}
    {runtime && loaded ? markers.filter(({ coordinates }) => coordinates.every(Number.isFinite) && Math.abs(coordinates[1]) <= 90).map((marker) =>
      <MarkerView key={marker.id} runtime={runtime} marker={marker} selected={selectedId === marker.id} onSelect={onSelect} renderMarker={renderMarker} />) : null}
  </div>;
}
