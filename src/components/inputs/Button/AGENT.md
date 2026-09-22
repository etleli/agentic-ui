---
componentId: button
---

Use this component for immediate actions, confirmations, and compact toggle actions. Use a link component for navigation instead.

- Keep the visible label action-oriented and specific.
- When `buttonType` is `toggle`, store the state in the parent and wire `onPressedChange`; do not rely on preview-local state.
- For icon-only buttons, always provide an accessible label and a tooltip.
- Use `danger` only for destructive actions that have an appropriate confirmation or recovery path.
- Use native `disabled` when no explanation is needed. Use `unavailableReason`
  (and optional `onUnavailable`) when the person must be able to focus the
  action and learn why it cannot run; never duplicate that behavior with a
  product-specific wrapper.
- Buttons remain content-sized by default. Use `width="fill"` only when the
  surrounding layout intentionally requires a full-width action.
