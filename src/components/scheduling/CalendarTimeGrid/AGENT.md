---
componentId: calendar-time-grid
---

Pass the selected `date`, `view`, and authorized events from the application. Use `YYYY-MM-DD` for dates and `YYYY-MM-DDTHH:mm` for wall-clock times in the display timezone. Timed intervals have an exclusive end and can cross midnight; all-day ranges include their `endDate`. Keep date-only deadlines in the reminder row. Supply `onDateChange` and `onEventSelect` for interactive date headers and cards; keep custom card contents non-interactive.
