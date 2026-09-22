---
componentId: node-palette
---

Use `NodePalette` as a generic source of graph templates.

- Consumers own node creation and convert palette placement requests into their
  own node model; this component never assigns domain behavior to a template.
- Use the documented drag payload and `getNodePaletteDropRequest` to convert a
  drop into a logical graph position that accounts for scroll, offset, and zoom.
- Keep native `disabled` templates non-interactive. Use `unavailableReason`
  when a template should remain discoverable but must not be placed.
