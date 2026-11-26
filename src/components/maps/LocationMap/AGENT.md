---
componentId: location-map
---

Supply a MapLibre style and longitude/latitude pairs. Choose a tile provider permitted for the deployment and preserve its attribution. The library loads MapLibre only when the map mounts. Use the bundled worker or set `workerUrl` when your deployment hosts the worker separately. Maps share MapLibre’s worker configuration. Use a separate accessible list when a map is the main location picker, and synchronize it with `selectedId` and `onSelect`. Provide non-interactive content in `renderMarker` because selectable markers are already buttons.
