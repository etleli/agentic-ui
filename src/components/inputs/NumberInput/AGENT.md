---
componentId: number-input
---

Use this component for a finite numeric value with optional bounds and increment.

- Convert saved string configuration values to numbers before passing `value`, `min`, `max`, or `step` to the component.
- Keep the value controlled in the parent through `value` and `onValueChange`.
- Use `suffix` only as a visual unit; validate and store the underlying raw number separately.
- Always provide a contextual `ariaLabel`, and set sensible bounds when an unsafe value could affect the workflow.
