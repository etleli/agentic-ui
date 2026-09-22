---
componentId: text-input
---

Use this component for a single short text value. Keep its value controlled in the parent through `value` and `onValueChange`.

- Supply a contextual `ariaLabel`; the workshop preview label is example content, not a product requirement.
- Enable `isPassword` only for credential-like secrets. Do not expose password values in summaries, logs, or nearby helper text.
- Prefer `TextArea` for multi-line input and a dedicated picker for constrained selection.
- The shared form-control styles already handle Chromium autofill through theme
  tokens; do not add app-specific autofill, email, hover, or dark-mode rules.
- Use `unavailableReason` only when a disabled field needs an accessible,
  focusable explanation. Otherwise retain ordinary native `disabled` behavior.
